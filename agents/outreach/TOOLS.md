# Available Tools

## Email Composition
- **render_template**: Render the Viego AI email template. Always pass `language: "de"`, `has_website`, `company_name`, `contact_name`, `city`, and `specific_insight`. The template contains the fixed Viego AI chatbot pitch — do not override the body.

## Persistence
- **save_outreach**: Save the drafted email to the database. Sets lead status to "contacting".

## Data Enrichment
- **extract_emails**: Extract email addresses from the lead's website.
- **check_mx**: Verify a domain can receive email before saving. Always run before relying on an extracted email.
- **scrape_page**: Get additional context (Google reviews mentioning slow response, contact info) for personalization.
- **check_website**: Verify the website URL is accessible.
- **get_place_details**: Get Google rating and review snippets — use to find specific insight for personalization.

## CRITICAL: No Send Capability
This agent does **NOT** have `send_email`. Emails are drafted and saved for human review only.

## Execution Steps

### Step 1: Get personalization data
- Call `get_place_details` or read analysis data to find:
  - Google rating (if ≤ 4.0: use as specific_insight)
  - Review mentioning slow/unreachable service
  - If nothing found: use default insight about manual tenant requests

### Step 2: Verify email deliverability
- Call `extract_emails` if no email on the lead
- Call `check_mx` to verify
- If no email found: save outreach with note "manualContactNeeded: true"

### Step 3: Draft email
- Call `render_template` with:
  - `language: "de"`
  - `has_website`: true or false
  - `company_name`: exact business name
  - `contact_name`: "Damen und Herren" (unless specific name found)
  - `city`: lead's city
  - `specific_insight`: one specific finding (or default)
  - `improvement_area`: "KI-Assistent für automatische Mieteranfragen"

### Step 4: Quality check
- [ ] Subject contains "KI-Assistent" or "24/7 erreichbar"
- [ ] Body mentions viego-ai.de/chat-demo
- [ ] No mention of website speed, SEO, images, or optimization
- [ ] Formal Sie/Ihnen throughout
- [ ] Signed off as: Mustafa / Viego AI / info@viego-ai.de
- [ ] Under 200 words

### Step 5: Save
- Call `save_outreach` with the rendered subject and body
