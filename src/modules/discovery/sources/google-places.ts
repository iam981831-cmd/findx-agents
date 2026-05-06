/**
 * Google Places API source adapter.
 *
 * Searches businesses by location/category using Google Places,
 * retrieves website presence and contact info.
 *
 * API: Google Places API (Text Search + Place Details)
 * Rate limit: managed via quota — conservative 5 req/s
 */

import type { DiscoveredLead, DiscoveryParams } from "../discovery.service.js";
import { createGoogleRateLimiter, type RateLimiter } from "./rate-limiter.js";

const PLACES_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry?: { location: { lat: number; lng: number } };
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
}

export interface GooglePlaceDetails {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  types?: string[];
  business_status?: string;
}

export interface GoogleSearchResponse {
  status: string;
  results: GooglePlaceResult[];
  next_page_token?: string;
  error_message?: string;
}

export interface GoogleDetailsResponse {
  status: string;
  result: GooglePlaceDetails;
  error_message?: string;
}

export interface GooglePlacesConfig {
  apiKey: string;
}

const GERMAN_CITIES = [
  "Berlin", "Hamburg", "München", "Frankfurt", "Köln", "Leipzig",
  "Stuttgart", "Düsseldorf", "Dresden", "Hannover", "Nürnberg", "Bremen",
  "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld",
  "Bonn", "Münster",
];

/** Return true if the query already names a German city (or Deutschland/Germany). */
function hasCityInQuery(query: string): boolean {
  if (/deutschland|germany/i.test(query)) return true;
  return GERMAN_CITIES.some((c) => new RegExp(`\\b${c}\\b`, "i").test(query));
}

function buildSearchQuery(industry: string | undefined, city: string): string {
  const parts: string[] = [];
  if (industry) parts.push(industry);
  parts.push(`in ${city} Deutschland`);
  return parts.join(" ");
}

function extractCity(address: string): string {
  // German: "12345 Berlin, Germany"
  const deMatch = address.match(/\d{5}\s+([^,]+)/);
  if (deMatch) return deMatch[1].trim();
  // Dutch: "1234 AB City"
  const nlMatch = address.match(/\d{4}\s?[A-Z]{2}\s+(.+?)(?:,\s*Netherlands)?$/i);
  if (nlMatch) return nlMatch[1].trim();
  // Fallback: second-to-last comma segment (before country)
  const segments = address.split(",").map((s) => s.trim());
  if (segments.length >= 2) return segments[segments.length - 2].replace(/\d+/g, "").trim() || segments[segments.length - 2].trim();
  return segments[segments.length - 1]?.trim() || "Unknown";
}

export class GooglePlacesSource {
  private readonly apiKey: string;
  private readonly rateLimiter: RateLimiter;

  constructor(config: GooglePlacesConfig) {
    this.apiKey = config.apiKey;
    this.rateLimiter = createGoogleRateLimiter();
  }

  async *scrape(
    params: DiscoveryParams,
  ): AsyncGenerator<DiscoveredLead, void, undefined> {
    const limit = params.limit ?? 500;

    // Determine which cities to search
    // If a city is provided OR the industry string already contains a city/country,
    // search only that single city. Otherwise fan out across all major German cities.
    const industryStr = params.industry ?? "";
    const cities: string[] =
      params.city
        ? [params.city]
        : hasCityInQuery(industryStr)
          ? [industryStr] // treat the whole string as the query; city extracted below
          : GERMAN_CITIES;

    // Cross-run dedup: website URL and placeId seen so far
    const seenWebsites = new Set<string>();
    const seenPlaceIds = new Set<string>();
    let totalFetched = 0;

    for (const city of cities) {
      if (totalFetched >= limit) break;

      const query = params.city || hasCityInQuery(industryStr)
        ? buildSearchQuery(params.industry, city)
        : buildSearchQuery(industryStr, city);

      let pageToken: string | undefined;

      while (totalFetched < limit) {
        await this.rateLimiter.acquire();

        const lang = process.env.DEFAULT_LANGUAGE ?? "de";
        const region = process.env.DEFAULT_COUNTRY?.toLowerCase() ?? "de";
        const qs = new URLSearchParams({
          query,
          key: this.apiKey,
          language: lang,
          region,
        });
        if (pageToken) qs.set("pagetoken", pageToken);

        const response = await fetch(`${PLACES_SEARCH_URL}?${qs}`);
        if (!response.ok) {
          throw new Error(`Google Places API error: ${response.status}`);
        }

        const data = (await response.json()) as GoogleSearchResponse;

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
          throw new Error(
            `Google Places error: ${data.status} — ${data.error_message ?? "unknown"}`,
          );
        }

        if (!data.results?.length) break;

        for (const place of data.results) {
          if (totalFetched >= limit) break;

          // Skip duplicate place IDs across city searches
          if (seenPlaceIds.has(place.place_id)) continue;
          seenPlaceIds.add(place.place_id);

          // Skip publicly listed companies (AG, GmbH & Co. KGaA, SE, Plc)
          if (/\b(AG|SE|KGaA|Plc|GmbH\s*&\s*Co\.\s*KGaA)\b/.test(place.name)) continue;

          // Skip large national chains
          if (/\b(Vonovia|Deutsche Wohnen|LEG|TAG Immobilien|Patrizia|Gewobag|Degewo|SAGA|WBM)\b/i.test(place.name)) continue;

          // Skip high-rated companies (4.2+ well-established)
          if (place.rating != null && place.rating > 4.2) continue;

          // Skip suspiciously perfect with no reviews
          if (place.rating != null && place.rating >= 4.8 && (place.user_ratings_total ?? 0) < 5) continue;

          // Skip companies with too few reviews (not a real active business)
          if ((place.user_ratings_total ?? 0) < 10) continue;

          // Skip large orgs (500+ reviews = chain/franchise)
          if (place.user_ratings_total != null && place.user_ratings_total > 500) continue;

          // Get details (website, phone) for each place
          const details = await this.getDetails(place.place_id);

          // Skip duplicate websites across city searches
          if (details?.website) {
            const normalizedUrl = details.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").toLowerCase();
            if (seenWebsites.has(normalizedUrl)) continue;
            seenWebsites.add(normalizedUrl);
          }

          // Compute Mittelstand priority score
          const rating = place.rating ?? 3.0;
          const reviewCount = place.user_ratings_total ?? 0;
          const ratingBoost = rating <= 3.5 ? 20 : rating <= 4.0 ? 10 : 0;
          const ratingPenalty = rating >= 4.5 ? -20 : 0;
          const reviewPenalty = reviewCount >= 300 ? -15 : 0;
          const mittelstandScore = 50 + ratingBoost + ratingPenalty + reviewPenalty;

          const lead: DiscoveredLead = {
            businessName: place.name,
            address: place.formatted_address,
            city: extractCity(place.formatted_address),
            industry: params.industry,
            website: details?.website,
            phone:
              details?.international_phone_number ??
              details?.formatted_phone_number,
            source: "google",
            sourceId: place.place_id,
            notes: JSON.stringify({
              googleRating: place.rating ?? null,
              googleRatingsTotal: place.user_ratings_total ?? null,
              mittelstandScore,
            }),
          };

          yield lead;
          totalFetched++;
        }

        if (!data.next_page_token) break;
        pageToken = data.next_page_token;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  private async getDetails(
    placeId: string,
  ): Promise<GooglePlaceDetails | null> {
    await this.rateLimiter.acquire();

    const qs = new URLSearchParams({
      place_id: placeId,
      key: this.apiKey,
      fields:
        "name,formatted_address,formatted_phone_number,international_phone_number,website,url,types,business_status",
      language: process.env.DEFAULT_LANGUAGE ?? "de",
    });

    const response = await fetch(`${PLACE_DETAILS_URL}?${qs}`);
    if (!response.ok) return null;

    const data = (await response.json()) as GoogleDetailsResponse;
    if (data.status !== "OK") return null;

    return data.result;
  }
}
