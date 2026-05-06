// Outreach Agent — fixed Viego AI German email, no AI-generated body
import type { AgentConfig } from "../core/types.js";
import { saveOutreachTool } from "../tools/database.js";
import { extractEmailsTool } from "../tools/extract-emails.js";
import { checkMxTool } from "../tools/check-mx.js";

const FIXED_SUBJECT = "24/7 erreichbar für Ihre Mieter – KI-Assistent für {COMPANY_NAME}";

const FIXED_BODY = `Sehr geehrte Damen und Herren,

bei meiner Recherche zu Hausverwaltungen in Deutschland bin ich auf {COMPANY_NAME} aufmerksam geworden.

Viego AI ist ein KI-Assistent speziell für die Immobilienwirtschaft:
- Beantwortet Mieteranfragen rund um die Uhr – automatisch
- Nimmt Schadensmeldungen strukturiert entgegen
- Entlastet Ihr Team von repetitiven Routineaufgaben
- 100% DSGVO-konform, Hosting in Deutschland

Damit Sie sich selbst ein Bild machen können:
🌐 www.viego-ai.de
💬 viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`;

const SYSTEM_PROMPT = `You are an outreach agent for Viego AI. Your ONLY job is to save a fixed German email for each lead using save_outreach.

CRITICAL RULES:
- Write the ENTIRE email in German only. Do NOT include ANY English sentences.
- Do NOT mention website scores, SEO, site speed, or any website service.
- ONLY promote Viego AI chatbot.
- Do NOT modify the email body. Use the EXACT fixed template below.
- Do NOT call render_template. Use save_outreach directly.

FIXED SUBJECT (replace {COMPANY_NAME} with the actual business name):
${FIXED_SUBJECT}

FIXED BODY (replace {COMPANY_NAME} with the actual business name):
${FIXED_BODY}

STEPS:
1. Get the businessName from the lead input.
2. Replace {COMPANY_NAME} in subject and body with the exact businessName.
3. If no email on the lead: call extract_emails, then check_mx to verify.
4. Call save_outreach with:
   - leadId: from input
   - subject: the fixed subject with company name substituted
   - body: the EXACT fixed body above with company name substituted — no changes, no additions, no English
5. Output: "Saved: <subject line>"`;

export function createOutreachAgent(): AgentConfig {
  return {
    name: "outreach",
    systemPrompt: SYSTEM_PROMPT,
    tools: [
      saveOutreachTool,
      extractEmailsTool,
      checkMxTool,
    ],
    maxIterations: 5,
    maxTokens: 2048,
  };
}
