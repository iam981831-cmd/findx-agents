// Email template system for FindX outreach
// Supports Dutch (default) and English with tone variants
// Dutch templates use formal "u" register for professional business communication

export type EmailTone = "professional" | "friendly" | "urgent";
export type EmailLanguage = "en" | "nl" | "ar" | "de";

export interface TemplateVariables {
  companyName: string;
  contactName: string;
  industry?: string;
  city: string;
  specificInsight: string;
  improvementArea: string;
  estimatedImpact: string;
  overallScore?: string;
  senderName: string;
  meetingLink: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: "cold_no_website" | "cold_has_website" | "followup_1" | "followup_2" | "breakup" | "meeting_confirm" | "proposal_followup";
  language: EmailLanguage;
  subject: string;
  body: string;
}

const TEMPLATES: EmailTemplate[] = [
  // --- Dutch templates (redirected to German Viego AI pitch) ---
  {
    id: "nl_cold_no_website",
    name: "Cold Outreach, kein Website (NL→DE)",
    category: "cold_no_website",
    language: "nl",
    subject: "24/7 erreichbar für Ihre Mieter – KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

bei meiner Recherche zu Hausverwaltungen in {{city}} bin ich auf {{companyName}} aufmerksam geworden.

Viego AI ist ein KI-Assistent speziell für die Immobilienwirtschaft:
- Beantwortet Mieteranfragen rund um die Uhr – automatisch
- Nimmt Schadensmeldungen strukturiert entgegen
- Entlastet Ihr Team von repetitiven Routineaufgaben
- 100% DSGVO-konform, Hosting in Deutschland

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "nl_cold_has_website",
    name: "Cold Outreach, mit Website (NL→DE)",
    category: "cold_has_website",
    language: "nl",
    subject: "24/7 erreichbar für Ihre Mieter – KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

bei meiner Recherche zu Hausverwaltungen in {{city}} bin ich auf {{companyName}} aufmerksam geworden. {{specificInsight}}.

Viego AI ist ein KI-Assistent speziell für die Immobilienwirtschaft:
- Beantwortet Mieteranfragen rund um die Uhr – automatisch
- Nimmt Schadensmeldungen strukturiert entgegen
- Entlastet Ihr Team von repetitiven Routineaufgaben
- 100% DSGVO-konform, Hosting in Deutschland

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "nl_followup_1",
    name: "Follow-Up 1, 3 Tage (NL→DE)",
    category: "followup_1",
    language: "nl",
    subject: "Kurze Nachfrage: KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

ich wollte kurz nachfragen, ob meine letzte Nachricht angekommen ist.

Demo verfügbar: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "nl_followup_2",
    name: "Follow-Up 2, 7 Tage (NL→DE)",
    category: "followup_2",
    language: "nl",
    subject: "Letzte Nachricht: Viego AI für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

ich melde mich ein letztes Mal bezüglich des Viego AI Assistenten für {{companyName}}.

Hausverwaltungen reduzieren mit Viego AI den Aufwand für Routineanfragen um durchschnittlich 60%. Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "nl_breakup",
    name: "Break-Up, 14 Tage (NL→DE)",
    category: "breakup",
    language: "nl",
    subject: "Kein weiterer Kontakt von unserer Seite",
    body: `Sehr geehrte Damen und Herren,

dies ist meine letzte Nachricht. Ich verstehe, dass der Zeitpunkt gerade nicht passt.

Bei Interesse finden Sie uns unter viego-ai.de.

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "nl_meeting_confirm",
    name: "Terminbestätigung (NL→DE)",
    category: "meeting_confirm",
    language: "nl",
    subject: "Terminbestätigung: Viego AI Demo für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

vielen Dank für Ihr Interesse. Unser Demo-Termin für {{companyName}} ist bestätigt.

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "nl_proposal_followup",
    name: "Angebots-Nachfrage (NL→DE)",
    category: "proposal_followup",
    language: "nl",
    subject: "Unser Angebot für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

anbei eine Zusammenfassung für {{companyName}}:

{{improvementArea}}

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },

  // --- English templates (redirected to German Viego AI pitch) ---
  {
    id: "en_cold_no_website",
    name: "Cold Outreach, kein Website (EN→DE)",
    category: "cold_no_website",
    language: "en",
    subject: "24/7 erreichbar für Ihre Mieter – KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

bei meiner Recherche zu Hausverwaltungen in {{city}} bin ich auf {{companyName}} aufmerksam geworden.

Viego AI ist ein KI-Assistent speziell für die Immobilienwirtschaft:
- Beantwortet Mieteranfragen rund um die Uhr – automatisch
- Nimmt Schadensmeldungen strukturiert entgegen
- Entlastet Ihr Team von repetitiven Routineaufgaben
- 100% DSGVO-konform, Hosting in Deutschland

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "en_cold_has_website",
    name: "Cold Outreach, mit Website (EN→DE)",
    category: "cold_has_website",
    language: "en",
    subject: "24/7 erreichbar für Ihre Mieter – KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

bei meiner Recherche zu Hausverwaltungen in {{city}} bin ich auf {{companyName}} aufmerksam geworden. {{specificInsight}}.

Viego AI ist ein KI-Assistent speziell für die Immobilienwirtschaft:
- Beantwortet Mieteranfragen rund um die Uhr – automatisch
- Nimmt Schadensmeldungen strukturiert entgegen
- Entlastet Ihr Team von repetitiven Routineaufgaben
- 100% DSGVO-konform, Hosting in Deutschland

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "en_followup_1",
    name: "Follow-Up 1, 3 Tage (EN→DE)",
    category: "followup_1",
    language: "en",
    subject: "Kurze Nachfrage: KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

ich wollte kurz nachfragen, ob meine letzte Nachricht angekommen ist.

Falls Sie Interesse haben, den Viego AI Assistenten für {{companyName}} in einer kurzen Demo zu sehen: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "en_followup_2",
    name: "Follow-Up 2, 7 Tage (EN→DE)",
    category: "followup_2",
    language: "en",
    subject: "Letzte Nachricht: Viego AI für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

ich melde mich ein letztes Mal bezüglich des Viego AI Assistenten für {{companyName}}.

Hausverwaltungen, die unseren KI-Assistenten einsetzen, reduzieren den Aufwand für Routineanfragen um durchschnittlich 60%. Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "en_breakup",
    name: "Break-Up, 14 Tage (EN→DE)",
    category: "breakup",
    language: "en",
    subject: "Kein weiterer Kontakt von unserer Seite",
    body: `Sehr geehrte Damen und Herren,

dies ist meine letzte Nachricht. Ich verstehe, dass der Zeitpunkt gerade nicht passt.

Falls Sie zu einem späteren Zeitpunkt Interesse haben: viego-ai.de

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "en_meeting_confirm",
    name: "Terminbestätigung (EN→DE)",
    category: "meeting_confirm",
    language: "en",
    subject: "Terminbestätigung: Viego AI Demo für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

vielen Dank für Ihr Interesse. Unser Demo-Termin für {{companyName}} ist bestätigt.

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "en_proposal_followup",
    name: "Angebots-Nachfrage (EN→DE)",
    category: "proposal_followup",
    language: "en",
    subject: "Unser Angebot für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

anbei eine Zusammenfassung für {{companyName}}:

{{improvementArea}}

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },

  // --- German templates (Viego AI chatbot — formal Sie/Ihnen) ---
  {
    id: "de_cold_no_website",
    name: "Cold Outreach, kein Website (DE)",
    category: "cold_no_website",
    language: "de",
    subject: "24/7 erreichbar für Ihre Mieter – KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

bei meiner Recherche zu Hausverwaltungen in {{city}} bin ich auf {{companyName}} aufmerksam geworden.

Viego AI ist ein KI-Assistent speziell für die Immobilienwirtschaft:
- Beantwortet Mieteranfragen rund um die Uhr automatisch
- Nimmt Schadensmeldungen strukturiert entgegen
- Entlastet Ihr Team von repetitiven Routineaufgaben
- 100% DSGVO-konform, Hosting in Deutschland

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "de_cold_has_website",
    name: "Cold Outreach, mit Website (DE)",
    category: "cold_has_website",
    language: "de",
    subject: "24/7 erreichbar für Ihre Mieter – KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

bei meiner Recherche zu Hausverwaltungen in {{city}} bin ich auf {{companyName}} aufmerksam geworden. {{specificInsight}}.

Viego AI ist ein KI-Assistent speziell für die Immobilienwirtschaft:
- Beantwortet Mieteranfragen rund um die Uhr automatisch
- Nimmt Schadensmeldungen strukturiert entgegen
- Entlastet Ihr Team von repetitiven Routineaufgaben
- 100% DSGVO-konform, Hosting in Deutschland

Demo: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "de_followup_1",
    name: "Follow-Up 1, 3 Tage (DE)",
    category: "followup_1",
    language: "de",
    subject: "Kurze Nachfrage: KI-Assistent für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

ich wollte kurz nachfragen, ob meine letzte Nachricht angekommen ist.

Falls Sie Interesse haben, den Viego AI Assistenten für {{companyName}} in einer kurzen Demo zu sehen: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "de_followup_2",
    name: "Follow-Up 2, 7 Tage (DE)",
    category: "followup_2",
    language: "de",
    subject: "Letzte Nachricht: Viego AI für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

ich melde mich ein letztes Mal bezüglich des Viego AI Assistenten für {{companyName}}.

Hausverwaltungen, die unseren KI-Assistenten einsetzen, reduzieren den Aufwand für Routineanfragen um durchschnittlich 60%. Die Demo ist jederzeit verfügbar: viego-ai.de/chat-demo

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "de_breakup",
    name: "Break-Up, 14 Tage (DE)",
    category: "breakup",
    language: "de",
    subject: "Kein weiterer Kontakt von unserer Seite",
    body: `Sehr geehrte Damen und Herren,

dies ist meine letzte Nachricht. Ich verstehe, dass der Zeitpunkt gerade nicht passt.

Falls Sie zu einem späteren Zeitpunkt Interesse an einem KI-Assistenten für {{companyName}} haben, finden Sie uns unter viego-ai.de.

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "de_meeting_confirm",
    name: "Terminbestätigung (DE)",
    category: "meeting_confirm",
    language: "de",
    subject: "Terminbestätigung: Viego AI Demo für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

vielen Dank für Ihr Interesse. Unser Demo-Termin für {{companyName}} ist hiermit bestätigt.

Ich zeige Ihnen, wie der Viego AI Assistent Mieteranfragen automatisch beantwortet und Schadensmeldungen strukturiert entgegennimmt. Die Demo dauert maximal 15 Minuten.

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },
  {
    id: "de_proposal_followup",
    name: "Angebots-Nachfrage (DE)",
    category: "proposal_followup",
    language: "de",
    subject: "Unser Angebot für {{companyName}}",
    body: `Sehr geehrte Damen und Herren,

anbei eine Zusammenfassung unseres Gesprächs zum Viego AI Assistenten für {{companyName}}:

{{improvementArea}}

Bei Fragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Mustafa
Viego AI
info@viego-ai.de`,
  },

  // --- Arabic templates (conversational, professional) ---
  {
    id: "ar_cold_no_website",
    name: "Cold Outreach, لا يوجد موقع (AR)",
    category: "cold_no_website",
    language: "ar",
    subject: "جعل {{companyName}} ظاهرًا على الإنترنت",
    body: `مرحبًا {{contactName}},

كنت أبحث مؤخرًا في التواجد الرقمي لشركات {{industry}} في {{city}}. لاحظت أن {{companyName}} لا يمتلك موقعًا إلكترونيًا.

في مجال {{industry}}، يبحث 7 من كل 10 عملاء عبر الإنترنت عن مزوّد خدمة. بدون موقع، يذهب هؤلاء العملاء إلى المنافسين مباشرة.

يمكنني إنشاء موقع لـ {{companyName}}:
- يظهر في نتائج البحث المحلية في {{city}}
- يعكس هوية شركتكم
- يكون جاهزًا خلال أسبوعين

مكالمة قصيرة مدتها 15 دقيقة كافية لمناقشة الخيارات.

[احجز مكالمة]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_cold_has_website",
    name: "Cold Outreach, فرص تحسين (AR)",
    category: "cold_has_website",
    language: "ar",
    subject: "لاحظت شيئًا عن موقع {{companyName}}",
    body: `مرحبًا {{contactName}},

كنت أتصفح موقع {{companyName}} الإلكتروني ولاحظت أمرًا واحدًا: {{specificInsight}}.

الشركات في مجال {{industry}} التي تعالج هذه النقطة تشهد عادةً {{estimatedImpact}}. الخطوة التالية المنطقية لـ {{companyName}}: {{improvementArea}}.

لديّ التحليل الكامل مع توصيات عملية جاهزة. هل نجري مكالمة مدتها 15 دقيقة لأعرض عليكم النتائج؟

[احجز مكالمة]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_followup_1",
    name: "Follow-Up 1, 3 أيام (AR)",
    category: "followup_1",
    language: "ar",
    subject: "رد: {{originalSubject}}",
    body: `مرحبًا {{contactName}},

متابعة سريعة بخصوص تحليلي لـ {{companyName}}. أفهم أنكم مشغولون، سأكون موجزًا.

النتائج لا تزال ذات صلة. يسعدني تحديد موعد يناسبكم بشكل أفضل.

[احجز مكالمة]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_followup_2",
    name: "Follow-Up 2, 7 أيام (AR)",
    category: "followup_2",
    language: "ar",
    subject: "شيء أخير بخصوص {{companyName}}",
    body: `مرحبًا {{contactName}},

شيء أخير. عند مقارنة {{companyName}} ببقية شركات {{industry}} في {{city}}، هناك فرصة واضحة ضائعة: {{specificInsight}}.

الشركات التي تتحرك في هذا الاتجاه تشهد عادةً {{estimatedImpact}}. سأحتفظ بالتحليل الكامل لكم.

إذا رغبتم في المناقشة لاحقًا: [مكالمة 15 دقيقة]({{meetingLink}}). وإلا، لن أتواصل معكم مجددًا.

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_breakup",
    name: "Break-Up, 14 يوم (AR)",
    category: "breakup",
    language: "ar",
    subject: "حفظت تحليل {{companyName}}",
    body: `مرحبًا {{contactName}},

هذه رسالتي الأخيرة. أفهم أن التوقيت قد لا يكون مناسبًا الآن.

تحليل {{companyName}} محفوظ. إذا أردتم مستقبلًا تحسين التواجد الرقمي، يمكنكم [مراجعة النتائج هنا]({{meetingLink}}).

أتمنى لـ {{companyName}} كل التوفيق.

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_meeting_confirm",
    name: "تأكيد الموعد (AR)",
    category: "meeting_confirm",
    language: "ar",
    subject: "تأكيد: مكالمة بخصوص {{companyName}}",
    body: `مرحبًا {{contactName}},

شكرًا على وقتكم. مكالمتنا لمناقشة تحليل موقع {{companyName}} الإلكتروني مؤكدة.

سأعرض عليكم النتائج مع توصيات عملية. 15 دقيقة كحد أقصى.

[تأكيد الموعد]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
  {
    id: "ar_proposal_followup",
    name: "متابعة العرض (AR)",
    category: "proposal_followup",
    language: "ar",
    subject: "ملخص العرض لـ {{companyName}}",
    body: `مرحبًا {{contactName}},

بناءً على محادثتنا، إليكم ملخص نقاط التحسين لـ {{companyName}}:

{{improvementArea}}

الأثر المتوقع: {{estimatedImpact}}.

أخبروني إذا كنتم ترغبون في المضي قدمًا.

[عرض العرض]({{meetingLink}})

تحياتي،
{{senderName}}`,
  },
];

export function getTemplates(
  language: EmailLanguage = "en",
  category?: EmailTemplate["category"],
): EmailTemplate[] {
  let filtered = TEMPLATES.filter((t) => t.language === language);
  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }
  return filtered;
}

export function getTemplate(id: string): EmailTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/** Strip em dashes (—) and double hyphens (--) from text, replacing with appropriate punctuation. */
function stripEmDashes(text: string): string {
  return text
    .replace(/\s*—\s*/g, ": ")   // em dash → colon
    .replace(/\s*–\s*/g, ", ")    // en dash → comma
    .replace(/\s*--\s*/g, ": ");  // double hyphen → colon
}

export function renderTemplate(
  template: EmailTemplate,
  vars: TemplateVariables,
): { subject: string; body: string } {
  let { subject, body } = template;
  const allVars: Record<string, string> = {
    ...vars,
    originalSubject: vars.specificInsight, // fallback for follow-ups
    overallScore: vars.overallScore ?? "—",
  };

  for (const [key, value] of Object.entries(allVars)) {
    const placeholder = `{{${key}}}`;
    // Strip em dashes from variable values before substitution
    const cleanValue = key === "overallScore" ? value : stripEmDashes(value);
    subject = subject.replaceAll(placeholder, cleanValue);
    body = body.replaceAll(placeholder, cleanValue);
  }

  return { subject, body };
}

export function pickColdTemplate(
  hasWebsite: boolean,
  language: EmailLanguage = "en",
): EmailTemplate {
  const category = hasWebsite ? "cold_has_website" : "cold_no_website";
  const template = TEMPLATES.find(
    (t) => t.language === language && t.category === category,
  );
  if (!template) {
    throw new Error(`No cold template found for ${category} in ${language}`);
  }
  return template;
}
