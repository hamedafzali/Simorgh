export type GuideResource = {
  title: string;
  url: string;
  note?: string;
};

export type GuideSection = {
  title: string;
  bullets: string[];
};

export type Guide = {
  id: string;
  title: string;
  category: string;
  summary: string;
  city?: string;
  steps: string[];
  checklist: string[];
  sections?: GuideSection[];
  resources?: GuideResource[];
  updatedAt: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  type: "Full-time" | "Part-time" | "Internship";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  description: string;
  requirements: string[];
  benefits: string[];
  howToApply: string[];
};

export type CommunityEvent = {
  id: string;
  title: string;
  city: string;
  date: string;
  time: string;
  venue: string;
  language: string;
  price: string;
  description: string;
};

export type DocumentGuide = {
  id: string;
  title: string;
  category: string;
  summary: string;
  steps: string[];
  checklist: string[];
  resources?: GuideResource[];
  updatedAt: string;
};

export type Location = {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  hours: string;
  contact: string;
  notes: string;
  website?: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type Phrase = {
  id: string;
  german: string;
  persian: string;
  english: string;
  category: string;
};

export const germanyGuides: Guide[] = [
  {
    id: "g-anmeldung",
    title: "Anmeldung (City Registration)",
    category: "Residency & Registration",
    summary:
      "Register your address at the Bürgeramt within 14 days after moving.",
    steps: [
      "Book an appointment online (Bürgeramt / Rathaus).",
      "Bring your passport, rental contract, and landlord confirmation.",
      "Complete the registration form (Anmeldung form).",
      "Receive your Meldebescheinigung on the spot.",
    ],
    checklist: [
      "Passport",
      "Rental contract",
      "Wohnungsgeberbestätigung (landlord confirmation)",
      "Completed registration form",
    ],
    resources: [
      {
        title: "Berlin Bürgeramt appointment portal",
        url: "https://service.berlin.de/terminvereinbarung/",
      },
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "g-tax-id",
    title: "Tax ID (Steuer-ID)",
    category: "Work & Taxes",
    summary:
      "Your tax ID arrives by mail after Anmeldung; needed for jobs and payroll.",
    steps: [
      "Complete Anmeldung first.",
      "Wait for the letter (usually 2–3 weeks).",
      "If not received, request it from the tax office.",
    ],
    checklist: ["Meldebescheinigung", "Valid address", "Passport"],
    resources: [
      {
        title: "Request tax ID (Bundeszentralamt)",
        url: "https://www.bzst.de/SiteGlobals/Kontaktformulare/DE/Steuerliche_IDNr/steuerliche_idnr_node.html",
      },
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "g-health-insurance",
    title: "Health Insurance (Krankenkasse)",
    category: "Health",
    summary:
      "Choose a public or private health insurer; you must be insured in Germany.",
    steps: [
      "Compare public insurers (TK, AOK, Barmer, etc.).",
      "Apply online or in person.",
      "Provide employer details (if employed).",
      "Receive insurance card and member number.",
    ],
    checklist: [
      "Passport",
      "Address in Germany",
      "Employer information (if applicable)",
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "g-bank-account",
    title: "Open a Bank Account",
    category: "Banking",
    summary:
      "Open a Girokonto for salary, rent, and daily payments. Online and local options.",
    steps: [
      "Pick a bank (N26, DKB, Commerzbank, Sparkasse).",
      "Complete identity verification (PostIdent or video).",
      "Provide address and ID.",
      "Receive IBAN and bank card.",
    ],
    checklist: ["Passport", "German address", "Phone/email"],
    updatedAt: "2026-02-08",
  },
  {
    id: "g-jobcenter",
    title: "Jobcenter Registration",
    category: "Work & Jobcenter",
    summary:
      "If eligible, register for support and integration services at your Jobcenter.",
    steps: [
      "Create an online account (or visit your local Jobcenter).",
      "Prepare income and housing documents.",
      "Submit application and wait for appointment.",
      "Attend appointment with required documents.",
    ],
    checklist: [
      "Passport",
      "Meldebescheinigung",
      "Rental contract + cost of housing",
      "Bank statements",
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "g-language-courses",
    title: "Integration & Language Courses",
    category: "Language & Integration",
    summary:
      "Find subsidized courses (Integrationskurs) and official language exams.",
    steps: [
      "Check eligibility at BAMF or Jobcenter.",
      "Choose a school and register.",
      "Attend placement test if required.",
      "Track attendance and exam dates.",
    ],
    checklist: ["Passport", "Residence permit", "Jobcenter/BAMF letter"],
    updatedAt: "2026-02-08",
  },
];

export const documentGuides: DocumentGuide[] = [
  {
    id: "d-residence-permit",
    title: "Residence Permit Appointment",
    category: "Immigration",
    summary:
      "Prepare for your Ausländerbehörde appointment with the right documents.",
    steps: [
      "Book an appointment early (slots fill fast).",
      "Gather required documents and copies.",
      "Prepare biometric photos.",
      "Arrive early and bring all originals.",
    ],
    checklist: [
      "Passport",
      "Appointment confirmation",
      "Biometric photos",
      "Meldebescheinigung",
      "Proof of income or funding",
      "Health insurance proof",
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-family-reunification",
    title: "Family Reunification Checklist",
    category: "Immigration",
    summary:
      "Documents typically required for spouse/child reunification.",
    steps: [
      "Check embassy requirements for your case.",
      "Collect legalized documents and translations.",
      "Prepare accommodation proof.",
      "Book consulate appointment.",
    ],
    checklist: [
      "Marriage certificate or birth certificates",
      "Certified translations",
      "Proof of income",
      "Housing contract",
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-job-application",
    title: "Job Application Documents",
    category: "Work & Jobcenter",
    summary: "A German job application pack (Bewerbungsmappe).",
    steps: [
      "Prepare a CV (Lebenslauf) with a clear layout.",
      "Write a short cover letter tailored to the job.",
      "Attach relevant certificates (education, training).",
      "Export as a single PDF when possible.",
    ],
    checklist: [
      "CV (1–2 pages)",
      "Cover letter",
      "Certificates and references",
      "Portfolio (if applicable)",
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-doctor-visit",
    title: "Doctor Appointment Prep",
    category: "Appointments",
    summary: "What to bring and how to describe symptoms.",
    steps: [
      "Bring health insurance card (Elektronische Gesundheitskarte).",
      "Write down symptoms and duration.",
      "Arrive 10 minutes early.",
      "Ask for a note (Krankschreibung) if needed.",
    ],
    checklist: [
      "Insurance card",
      "List of symptoms",
      "Current medications",
    ],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-kita",
    title: "Kita Enrollment",
    category: "Family",
    summary: "Steps to secure a daycare spot.",
    steps: [
      "Get a Kita-Gutschein from your Jugendamt.",
      "Visit Kitas and apply early.",
      "Submit forms and required documents.",
      "Confirm placement and start date.",
    ],
    checklist: [
      "Passports",
      "Child birth certificate",
      "Meldebescheinigung",
      "Kita-Gutschein",
    ],
    updatedAt: "2026-02-08",
  },
];

export const germanyJobs: Job[] = [
  {
    id: "j1",
    title: "Warehouse Associate",
    company: "LogiBerlin GmbH",
    city: "Berlin",
    type: "Full-time",
    level: "A2",
    description:
      "Entry-level warehouse role with training and clear processes.",
    requirements: ["Basic German (A2)", "Reliability", "Physical stamina"],
    benefits: ["Paid training", "Shift allowance", "Fixed contract"],
    howToApply: [
      "Prepare CV in PDF",
      "Send short email application",
      "Attend on-site interview",
    ],
  },
  {
    id: "j2",
    title: "Restaurant Service",
    company: "Rhein Café",
    city: "Köln",
    type: "Part-time",
    level: "A1",
    description: "Front-of-house service and customer support.",
    requirements: ["Friendly communication", "Basic German", "Punctuality"],
    benefits: ["Tips", "Flexible shifts"],
    howToApply: ["Walk in with CV", "Short trial shift"],
  },
  {
    id: "j3",
    title: "Office Assistant",
    company: "Nord Solutions",
    city: "Hamburg",
    type: "Internship",
    level: "B1",
    description: "Support scheduling, emails, and simple reports.",
    requirements: ["B1 German", "MS Office basics", "Attention to detail"],
    benefits: ["Mentorship", "Certificate", "Potential full-time offer"],
    howToApply: ["CV + cover letter", "Remote interview"],
  },
  {
    id: "j4",
    title: "Delivery Driver (E-bike)",
    company: "SpeedGo",
    city: "Berlin",
    type: "Part-time",
    level: "A1",
    description: "Deliver food orders within the city.",
    requirements: ["Basic German or English", "Smartphone"],
    benefits: ["Flexible schedule", "Bonuses"],
    howToApply: ["Online form", "ID verification"],
  },
  {
    id: "j5",
    title: "Customer Support (Persian/German)",
    company: "ConnectCare",
    city: "Frankfurt",
    type: "Full-time",
    level: "B2",
    description: "Support Persian-speaking customers with services in German.",
    requirements: ["B2 German", "Persian native", "Customer empathy"],
    benefits: ["Remote days", "Training budget"],
    howToApply: ["CV + short video intro"],
  },
];

export const germanyEvents: CommunityEvent[] = [
  {
    id: "e1",
    title: "German Conversation Night",
    city: "Berlin",
    date: "2026-02-20",
    time: "18:00",
    venue: "Mitte Community Hub",
    language: "German + Persian support",
    price: "Free",
    description:
      "Practice German in a friendly group. Topics for A1–B2. Free entry.",
  },
  {
    id: "e2",
    title: "CV & Job Applications Workshop",
    city: "Köln",
    date: "2026-02-25",
    time: "17:30",
    venue: "Rhein Skills Center",
    language: "German + English",
    price: "€5",
    description:
      "Learn how to build a German CV and write application emails. Bring your laptop.",
  },
  {
    id: "e3",
    title: "Newcomer Orientation Q&A",
    city: "Hamburg",
    date: "2026-02-28",
    time: "16:00",
    venue: "Altona Library Hall",
    language: "Persian",
    price: "Free",
    description:
      "Ask questions about Anmeldung, insurance, and daily life in Germany.",
  },
];

export const germanyLocations: Location[] = [
  {
    id: "l1",
    name: "Bürgeramt Berlin Mitte",
    category: "Registration",
    city: "Berlin",
    address: "Karl-Marx-Allee 31, 10178 Berlin",
    hours: "Mon–Fri 08:00–16:00",
    contact: "+49 30 115",
    notes: "Book appointments early. Walk-ins are rare.",
    website: "https://service.berlin.de/",
  },
  {
    id: "l2",
    name: "Jobcenter Berlin",
    category: "Jobcenter",
    city: "Berlin",
    address: "Charlottenstraße 87–90, 10969 Berlin",
    hours: "Mon–Fri 08:00–12:30",
    contact: "+49 30 5555 0",
    notes: "Bring all housing and income documents.",
  },
  {
    id: "l3",
    name: "Welcome Center Hamburg",
    category: "Integration",
    city: "Hamburg",
    address: "Hamburg Welcome Center, 20457 Hamburg",
    hours: "Mon–Thu 09:00–17:00",
    contact: "+49 40 42831 1480",
    notes: "Advice on work permits and settling in.",
  },
  {
    id: "l4",
    name: "AOK Service Center München",
    category: "Health Insurance",
    city: "Munich",
    address: "Ridlersstraße 57, 80339 München",
    hours: "Mon–Fri 08:00–17:00",
    contact: "+49 89 6221 0",
    notes: "Public health insurance consultations.",
  },
];

export const germanyFaq: FaqItem[] = [
  {
    id: "f1",
    question: "How soon must I do Anmeldung after moving?",
    answer:
      "Usually within 14 days of moving into a new address. Book an appointment early.",
    category: "Registration",
  },
  {
    id: "f2",
    question: "Do I need health insurance before starting work?",
    answer:
      "Yes. You must choose a public or private insurer. Most people start with a public insurer.",
    category: "Health",
  },
  {
    id: "f3",
    question: "What is a Schufa?",
    answer:
      "A credit record used for rentals and contracts. Many banks and landlords check it.",
    category: "Banking",
  },
  {
    id: "f4",
    question: "Can I open a bank account without Anmeldung?",
    answer:
      "Some online banks may allow it, but most require a German address and registration.",
    category: "Banking",
  },
  {
    id: "f5",
    question: "What level of German do I need for basic jobs?",
    answer:
      "Many entry roles accept A1–A2, but B1 helps a lot for office or customer roles.",
    category: "Work",
  },
  {
    id: "f6",
    question: "Where can I find official integration courses?",
    answer:
      "Look for BAMF-approved schools or ask Jobcenter/immigration office.",
    category: "Language",
  },
];

export const survivalPhrases: Phrase[] = [
  {
    id: "p1",
    german: "Ich brauche Hilfe.",
    persian: "من کمک نیاز دارم.",
    english: "I need help.",
    category: "Emergency",
  },
  {
    id: "p2",
    german: "Wo ist das Bürgeramt?",
    persian: "اداره ثبت آدرس کجاست؟",
    english: "Where is the registration office?",
    category: "City",
  },
  {
    id: "p3",
    german: "Ich habe einen Termin.",
    persian: "من وقت ملاقات دارم.",
    english: "I have an appointment.",
    category: "Appointments",
  },
  {
    id: "p4",
    german: "Ich suche eine Wohnung.",
    persian: "دنبال یک آپارتمان می‌گردم.",
    english: "I am looking for an apartment.",
    category: "Housing",
  },
  {
    id: "p5",
    german: "Können Sie das bitte wiederholen?",
    persian: "می‌توانید لطفاً دوباره تکرار کنید؟",
    english: "Can you please repeat that?",
    category: "Communication",
  },
  {
    id: "p6",
    german: "Ich spreche nur ein bisschen Deutsch.",
    persian: "من فقط کمی آلمانی صحبت می‌کنم.",
    english: "I speak only a little German.",
    category: "Communication",
  },
  {
    id: "p7",
    german: "Wie viel kostet das?",
    persian: "این چقدر قیمت دارد؟",
    english: "How much does this cost?",
    category: "Daily life",
  },
  {
    id: "p8",
    german: "Ich brauche einen Arzt.",
    persian: "من دکتر نیاز دارم.",
    english: "I need a doctor.",
    category: "Health",
  },
  {
    id: "p9",
    german: "Meine Adresse ist …",
    persian: "آدرس من … است.",
    english: "My address is …",
    category: "Forms",
  },
  {
    id: "p10",
    german: "Danke für Ihre Hilfe.",
    persian: "ممنون از کمک‌تان.",
    english: "Thank you for your help.",
    category: "Polite",
  },
];
