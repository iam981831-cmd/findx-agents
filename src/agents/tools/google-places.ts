import type { Tool } from "../core/types.js";
import { GooglePlacesSource } from "../../modules/discovery/sources/google-places.js";

export const googlePlacesTool: Tool = {
  name: "google_places_search",
  description:
    "Search Google Places API for businesses in Germany by location and category. Results are restricted to Germany (region=de, language=de). Returns structured data including name, address, phone, website, and city. Only available if GOOGLE_MAPS_API_KEY is configured.",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query in German, e.g. 'Hausverwaltung Berlin' or 'Restaurants Hamburg'. Always use German city names and German industry terms.",
      },
      city: {
        type: "string",
        description: "German city to search in (e.g. 'Berlin', 'Hamburg', 'München'). Must be a city in Germany.",
      },
      industry: {
        type: "string",
        description: "Industry or category to filter by",
      },
      limit: {
        type: "number",
        description: "Max number of results (default 50)",
      },
      company_size: {
        type: "string",
        enum: ["small", "medium", "any"],
        description: "Filter by company size. 'small'=5-20 employees, 'medium'=20-100 employees. Use 'small' or 'medium' for Mittelstand targets. Filters out large chains (500+ reviews). Default: 'medium'.",
      },
    },
    required: ["query"],
  },
  async execute(input: Record<string, unknown>) {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return JSON.stringify({
        available: false,
        message:
          "Google Places API is not configured (missing GOOGLE_MAPS_API_KEY). Use web_search instead to find businesses.",
      });
    }

    try {
      const source = new GooglePlacesSource({
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      });
      const leads: Array<Record<string, unknown>> = [];

      const query = input.query as string;
      // Extract city from query if not explicitly provided
      const city = (input.city as string) || undefined;
      const industry = (input.industry as string) || undefined;

      // Build params — use query text as the industry/city hint for the
      // source when explicit params are missing, so the search stays useful.
      const sizeFilter = (input.company_size as string) || "medium";
      // Map size to max ratings_total proxy: large chains get 500+ reviews
      const maxReviews = sizeFilter === "small" ? 100 : sizeFilter === "medium" ? 300 : 9999;

      for await (const lead of source.scrape({
        city,
        industry: industry ?? query,
        limit: (input.limit as number) || 50,
      })) {
        const meta = lead.notes ? JSON.parse(lead.notes) : {};
        const rating: number | null = meta.googleRating ?? null;
        const reviewCount: number | null = meta.googleRatingsTotal ?? null;
        const mittelstandScore: number = meta.mittelstandScore ?? 50;

        // Skip large companies (proxy: too many reviews for a Mittelstand firm)
        if (reviewCount != null && reviewCount > maxReviews) continue;

        // Skip publicly listed / large corps by name
        if (/\b(AG|SE|KGaA|GmbH\s*&\s*Co\.\s*KGaA)\b/.test(lead.businessName)) continue;

        // Skip perfect rating with too few reviews
        if (rating != null && rating >= 4.8 && (reviewCount ?? 0) < 5) continue;

        leads.push({
          businessName: lead.businessName,
          address: lead.address,
          city: lead.city,
          industry: lead.industry,
          website: lead.website,
          phone: lead.phone,
          placeId: lead.sourceId,
          googleRating: rating,
          googleReviewCount: reviewCount,
          hasPhone: !!lead.phone,
          mittelstandScore,
          skipReason: null,
        });
      }

      // Sort by mittelstand score descending (best targets first)
      leads.sort((a, b) => ((b.mittelstandScore as number) ?? 50) - ((a.mittelstandScore as number) ?? 50));

      return JSON.stringify({
        available: true,
        source: "google_places",
        totalFound: leads.length,
        results: leads,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err);
      return JSON.stringify({
        available: true,
        error: `Google Places API call failed: ${message}`,
        results: [],
      });
    }
  },
};
