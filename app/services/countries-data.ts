export type Country = {
  code: string;
  name: string;
  localName?: string;
  summary: string;
};

export type StarterPack = {
  countryCode: string;
  title: string;
  overview: string;
  steps: string[];
  checklist: string[];
  updatedAt: string;
};

export type TimelineItem = {
  countryCode: string;
  dayRange: string;
  title: string;
  items: string[];
};

export type ServiceEntry = {
  countryCode: string;
  category: string;
  name: string;
  city?: string;
  summary: string;
  contact?: string;
};

export type EmergencyContact = {
  countryCode: string;
  category: string;
  number: string;
  notes?: string;
};

export type FormGuide = {
  countryCode: string;
  title: string;
  summary: string;
  fields: Array<{
    name: string;
    persianHint: string;
    example?: string;
  }>;
  tips: string[];
};

export type DeadlineItem = {
  countryCode: string;
  title: string;
  dueInDays: number;
  notes: string;
};

export type PhraseEntry = {
  countryCode: string;
  category: string;
  phrase: string;
  persian: string;
  romanized?: string;
};

export const supportedCountries: Country[] = [
  {
    code: "DE",
    name: "Germany",
    localName: "Deutschland",
    summary: "Registration, insurance, and work essentials.",
  },
  {
    code: "CA",
    name: "Canada",
    summary: "Arrival checklist and settlement basics.",
  },
  {
    code: "US",
    name: "United States",
    summary: "Immigration basics and local setup.",
  },
  {
    code: "UK",
    name: "United Kingdom",
    summary: "Healthcare, residency, and work prep.",
  },
  {
    code: "AU",
    name: "Australia",
    summary: "Local onboarding and services.",
  },
  {
    code: "TR",
    name: "Turkey",
    summary: "Residency, banking, and daily life.",
  },
  {
    code: "SE",
    name: "Sweden",
    summary: "Registration and services.",
  },
  {
    code: "NL",
    name: "Netherlands",
    summary: "BSN, housing, and healthcare.",
  },
  {
    code: "FR",
    name: "France",
    summary: "Residence and health setup.",
  },
  {
    code: "IT",
    name: "Italy",
    summary: "Permesso and local services.",
  },
  {
    code: "ES",
    name: "Spain",
    summary: "Residency steps and services.",
  },
  {
    code: "AT",
    name: "Austria",
    summary: "Registration and work essentials.",
  },
  {
    code: "CH",
    name: "Switzerland",
    summary: "Permit, health, and registration.",
  },
  {
    code: "DK",
    name: "Denmark",
    summary: "CPR, housing, and services.",
  },
  {
    code: "NO",
    name: "Norway",
    summary: "Registration and local setup.",
  },
];

export const starterPacks: StarterPack[] = [
  {
    countryCode: "DE",
    title: "Germany Starter Pack",
    overview:
      "Complete the essentials: registration, insurance, tax ID, and a bank account.",
    steps: [
      "Do Anmeldung at Bürgeramt within 14 days.",
      "Choose health insurance and get your card.",
      "Wait for or request your Steuer-ID.",
      "Open a Girokonto (bank account).",
      "Register with Jobcenter if eligible.",
    ],
    checklist: [
      "Passport",
      "Rental contract",
      "Landlord confirmation",
      "Biometric photos",
      "Proof of insurance",
    ],
    updatedAt: "2026-02-08",
  },
  {
    countryCode: "GLOBAL",
    title: "Global Starter Pack",
    overview:
      "These steps apply almost everywhere. Country-specific details coming soon.",
    steps: [
      "Register your address or residency (local office).",
      "Secure health coverage or insurance.",
      "Open a local bank account.",
      "Prepare documents for work authorization.",
      "Find language courses and community support.",
    ],
    checklist: ["Passport", "Proof of address", "Local phone number"],
    updatedAt: "2026-02-08",
  },
];

export const timelineItems: TimelineItem[] = [
  {
    countryCode: "DE",
    dayRange: "Day 1–7",
    title: "Arrival",
    items: [
      "Get a local SIM card.",
      "Set up temporary housing.",
      "Book Anmeldung appointment.",
    ],
  },
  {
    countryCode: "DE",
    dayRange: "Day 8–30",
    title: "Registration & Setup",
    items: [
      "Complete Anmeldung.",
      "Apply for health insurance.",
      "Open a bank account.",
    ],
  },
  {
    countryCode: "DE",
    dayRange: "Day 31–90",
    title: "Stabilize",
    items: [
      "Start language or integration course.",
      "Apply for jobs or training.",
      "Set up long-term housing.",
    ],
  },
  {
    countryCode: "GLOBAL",
    dayRange: "First 30 days",
    title: "Essentials",
    items: [
      "Register address/residency.",
      "Get health coverage.",
      "Open a bank account.",
    ],
  },
];

export const serviceDirectory: ServiceEntry[] = [
  {
    countryCode: "DE",
    category: "Legal",
    name: "Immigration Legal Aid (Berlin)",
    city: "Berlin",
    summary: "Low-cost legal guidance for residency questions.",
  },
  {
    countryCode: "DE",
    category: "Translation",
    name: "Certified Translators Network",
    summary: "Find sworn translations for official documents.",
  },
  {
    countryCode: "DE",
    category: "Tax",
    name: "Tax Advisor Finder",
    summary: "Help with Steuerklasse and annual returns.",
  },
];

export const emergencyContacts: EmergencyContact[] = [
  {
    countryCode: "DE",
    category: "Police",
    number: "110",
    notes: "Immediate danger",
  },
  {
    countryCode: "DE",
    category: "Fire / Medical",
    number: "112",
    notes: "Ambulance or fire",
  },
  {
    countryCode: "GLOBAL",
    category: "Embassy (Iran)",
    number: "See local embassy website",
    notes: "For consular help",
  },
];

export const formGuides: FormGuide[] = [
  {
    countryCode: "DE",
    title: "Anmeldung Registration Form",
    summary: "Register your address at the Bürgeramt.",
    fields: [
      { name: "Familienname", persianHint: "نام خانوادگی" },
      { name: "Vorname", persianHint: "نام" },
      { name: "Geburtsdatum", persianHint: "تاریخ تولد", example: "01.01.1990" },
      { name: "Staatsangehörigkeit", persianHint: "تابعیت", example: "Iran" },
      { name: "Wohnungsgeber", persianHint: "نام صاحب‌خانه" },
      { name: "Einzugsdatum", persianHint: "تاریخ ورود", example: "10.02.2026" },
    ],
    tips: [
      "Bring landlord confirmation (Wohnungsgeberbestätigung).",
      "Use your passport spelling for names.",
    ],
  },
  {
    countryCode: "DE",
    title: "Jobcenter Application (Basic)",
    summary: "First registration for support services.",
    fields: [
      { name: "Kundennummer", persianHint: "شماره مشتری (اگر دارید)" },
      { name: "Adresse", persianHint: "آدرس" },
      { name: "Einkommen", persianHint: "درآمد", example: "0 EUR" },
      { name: "Miete", persianHint: "اجاره", example: "650 EUR" },
    ],
    tips: [
      "Bring rental contract and bank statements.",
      "Ask for interpreter support if needed.",
    ],
  },
  {
    countryCode: "GLOBAL",
    title: "Generic Address Registration",
    summary: "Common fields for local registration forms.",
    fields: [
      { name: "Full name", persianHint: "نام کامل" },
      { name: "Address", persianHint: "آدرس" },
      { name: "Date of arrival", persianHint: "تاریخ ورود" },
      { name: "Passport number", persianHint: "شماره گذرنامه" },
    ],
    tips: ["Use passport spelling for names."],
  },
];

export const deadlineItems: DeadlineItem[] = [
  {
    countryCode: "DE",
    title: "Anmeldung (address registration)",
    dueInDays: 14,
    notes: "Register your address at Bürgeramt within 14 days.",
  },
  {
    countryCode: "DE",
    title: "Health insurance proof",
    dueInDays: 30,
    notes: "Pick public or private insurance and get confirmation.",
  },
  {
    countryCode: "DE",
    title: "Residence permit appointment",
    dueInDays: 60,
    notes: "Book Ausländerbehörde appointment if needed.",
  },
  {
    countryCode: "GLOBAL",
    title: "Local address registration",
    dueInDays: 14,
    notes: "Register your address or residency locally.",
  },
  {
    countryCode: "GLOBAL",
    title: "Health coverage",
    dueInDays: 30,
    notes: "Secure health insurance or coverage.",
  },
];

export const phrasebook: PhraseEntry[] = [
  {
    countryCode: "DE",
    category: "Emergency",
    phrase: "I need help.",
    persian: "من به کمک نیاز دارم.",
    romanized: "man be komak niaz daram",
  },
  {
    countryCode: "DE",
    category: "Emergency",
    phrase: "Call the police.",
    persian: "با پلیس تماس بگیرید.",
    romanized: "ba polis tamas begirid",
  },
  {
    countryCode: "DE",
    category: "Medical",
    phrase: "I feel sick.",
    persian: "حالم خوب نیست.",
    romanized: "halam khub nist",
  },
  {
    countryCode: "DE",
    category: "Medical",
    phrase: "I need a doctor.",
    persian: "به دکتر نیاز دارم.",
    romanized: "be doktor niaz daram",
  },
  {
    countryCode: "DE",
    category: "Police",
    phrase: "I lost my documents.",
    persian: "مدارکم را گم کرده‌ام.",
    romanized: "madarek-am ra gom karde-am",
  },
  {
    countryCode: "GLOBAL",
    category: "Emergency",
    phrase: "Please help me.",
    persian: "لطفاً کمک کنید.",
    romanized: "lotfan komak konid",
  },
  {
    countryCode: "GLOBAL",
    category: "Medical",
    phrase: "I need a hospital.",
    persian: "به بیمارستان نیاز دارم.",
    romanized: "be bimarstan niaz daram",
  },
];

export function getStarterPack(countryCode: string): StarterPack {
  return (
    starterPacks.find((pack) => pack.countryCode === countryCode) ||
    starterPacks.find((pack) => pack.countryCode === "GLOBAL")!
  );
}

export function getTimeline(countryCode: string): TimelineItem[] {
  const items = timelineItems.filter(
    (item) => item.countryCode === countryCode
  );
  return items.length ? items : timelineItems.filter((i) => i.countryCode === "GLOBAL");
}

export function getServices(countryCode: string): ServiceEntry[] {
  const items = serviceDirectory.filter(
    (service) => service.countryCode === countryCode
  );
  return items;
}

export function getEmergencyContacts(countryCode: string): EmergencyContact[] {
  const items = emergencyContacts.filter(
    (contact) => contact.countryCode === countryCode
  );
  return items.length
    ? items
    : emergencyContacts.filter((contact) => contact.countryCode === "GLOBAL");
}

export function getFormGuides(countryCode: string): FormGuide[] {
  const items = formGuides.filter((guide) => guide.countryCode === countryCode);
  return items.length ? items : formGuides.filter((g) => g.countryCode === "GLOBAL");
}

export function getDeadlines(countryCode: string): DeadlineItem[] {
  const items = deadlineItems.filter((item) => item.countryCode === countryCode);
  return items.length ? items : deadlineItems.filter((item) => item.countryCode === "GLOBAL");
}

export function getPhrasebook(countryCode: string): PhraseEntry[] {
  const items = phrasebook.filter((item) => item.countryCode === countryCode);
  return items.length ? items : phrasebook.filter((item) => item.countryCode === "GLOBAL");
}
