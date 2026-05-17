export type Country = {
  code: string;
  name: string;
  localName?: string;
  summary: string;
};

export type StarterPack = {
  countryCode: string;
  title: string;
  titleFa?: string;
  overview: string;
  overviewFa?: string;
  steps: string[];
  stepsFa?: string[];
  checklist: string[];
  checklistFa?: string[];
  updatedAt: string;
};

export type TimelineItem = {
  countryCode: string;
  dayRange: string;
  title: string;
  titleFa?: string;
  items: string[];
  itemsFa?: string[];
};

export type ServiceEntry = {
  countryCode: string;
  category: string;
  categoryFa?: string;
  name: string;
  nameFa?: string;
  city?: string;
  summary: string;
  summaryFa?: string;
  contact?: string;
  website?: string;
  verified?: boolean;
  verifiedNote?: string;
};

export type EmergencyContact = {
  countryCode: string;
  category: string;
  categoryFa?: string;
  number: string;
  notes?: string;
  notesFa?: string;
};

export type FormGuide = {
  countryCode: string;
  title: string;
  titleFa?: string;
  summary: string;
  summaryFa?: string;
  fields: Array<{
    name: string;
    persianHint: string;
    example?: string;
  }>;
  tips: string[];
  tipsFa?: string[];
};

export type ReminderItem = {
  countryCode: string;
  title: string;
  titleFa?: string;
  dueInDays: number;
  notes: string;
  notesFa?: string;
};

export type SchoolGuide = {
  countryCode: string;
  title: string;
  titleFa?: string;
  summary: string;
  summaryFa?: string;
  steps: string[];
  stepsFa?: string[];
  documents: string[];
  documentsFa?: string[];
};

export type SupportResource = {
  countryCode: string;
  category: string;
  categoryFa?: string;
  name: string;
  nameFa?: string;
  summary: string;
  summaryFa?: string;
  contact?: string;
};

export type HousingChecklist = {
  countryCode: string;
  title: string;
  titleFa?: string;
  items: string[];
  itemsFa?: string[];
  warnings: string[];
  warningsFa?: string[];
};

export type TaxReminder = {
  countryCode: string;
  title: string;
  titleFa?: string;
  timing: string;
  timingFa?: string;
  notes: string;
  notesFa?: string;
};

export type DeadlineItem = {
  countryCode: string;
  title: string;
  titleFa?: string;
  dueInDays: number;
  notes: string;
  notesFa?: string;
};

export type PhraseEntry = {
  countryCode: string;
  category: string;
  categoryFa?: string;
  phrase: string;
  german?: string;
  persian: string;
  romanized?: string;
};

export const supportedCountries: Country[] = [
  { code: "DE", name: "Germany", localName: "Deutschland", summary: "Registration, insurance, and work essentials." },
  { code: "CA", name: "Canada", summary: "Arrival checklist and settlement basics." },
  { code: "US", name: "United States", summary: "Immigration basics and local setup." },
  { code: "UK", name: "United Kingdom", summary: "Healthcare, residency, and work prep." },
  { code: "AU", name: "Australia", summary: "Local onboarding and services." },
  { code: "TR", name: "Turkey", summary: "Residency, banking, and daily life." },
  { code: "SE", name: "Sweden", summary: "Registration and services." },
  { code: "NL", name: "Netherlands", summary: "BSN, housing, and healthcare." },
  { code: "FR", name: "France", summary: "Residence and health setup." },
  { code: "IT", name: "Italy", summary: "Permesso and local services." },
  { code: "ES", name: "Spain", summary: "Residency steps and services." },
  { code: "AT", name: "Austria", summary: "Registration and work essentials." },
  { code: "CH", name: "Switzerland", summary: "Permit, health, and registration." },
  { code: "DK", name: "Denmark", summary: "CPR, housing, and services." },
  { code: "NO", name: "Norway", summary: "Registration and local setup." },
];

export const starterPacks: StarterPack[] = [
  {
    countryCode: "DE",
    title: "Germany Starter Pack",
    titleFa: "بسته شروع آلمان",
    overview: "Complete the essentials: registration, insurance, tax ID, and a bank account.",
    overviewFa: "ضروریات را کامل کنید: ثبت‌نام، بیمه، شناسه مالیاتی، و حساب بانکی.",
    steps: [
      "Do Anmeldung at Bürgeramt within 14 days.",
      "Choose health insurance and get your card.",
      "Wait for or request your Steuer-ID.",
      "Open a Girokonto (bank account).",
      "Register with Jobcenter if eligible.",
    ],
    stepsFa: [
      "آنملدونگ را ظرف ۱۴ روز در بورگرامت انجام دهید.",
      "بیمه درمانی انتخاب کنید و کارت بیمه دریافت کنید.",
      "منتظر اشتویر-آی‌دی باشید یا آن را درخواست کنید.",
      "یک حساب گیروکونتو (حساب بانکی) باز کنید.",
      "در صورت واجد شرایط بودن، در جابسنتر ثبت‌نام کنید.",
    ],
    checklist: ["Passport", "Rental contract", "Landlord confirmation", "Biometric photos", "Proof of insurance"],
    checklistFa: ["گذرنامه", "قرارداد اجاره", "تأییدیه صاحب‌خانه", "عکس‌های بیومتریک", "گواهی بیمه"],
    updatedAt: "2026-02-08",
  },
  {
    countryCode: "GLOBAL",
    title: "Global Starter Pack",
    titleFa: "بسته شروع جهانی",
    overview: "These steps apply almost everywhere. Country-specific details coming soon.",
    overviewFa: "این مراحل تقریباً در همه جا کاربرد دارند. جزئیات مخصوص هر کشور به زودی اضافه می‌شود.",
    steps: [
      "Register your address or residency (local office).",
      "Secure health coverage or insurance.",
      "Open a local bank account.",
      "Prepare documents for work authorization.",
      "Find language courses and community support.",
    ],
    stepsFa: [
      "آدرس یا اقامت خود را ثبت کنید (اداره محلی).",
      "پوشش بهداشتی یا بیمه را تأمین کنید.",
      "یک حساب بانکی محلی باز کنید.",
      "مدارک مجوز کار را آماده کنید.",
      "کلاس‌های زبان و حمایت جامعه را پیدا کنید.",
    ],
    checklist: ["Passport", "Proof of address", "Local phone number"],
    checklistFa: ["گذرنامه", "گواهی آدرس", "شماره تلفن محلی"],
    updatedAt: "2026-02-08",
  },
];

export const timelineItems: TimelineItem[] = [
  {
    countryCode: "DE",
    dayRange: "Day 1–7",
    title: "Arrival",
    titleFa: "ورود",
    items: ["Get a local SIM card.", "Set up temporary housing.", "Book Anmeldung appointment."],
    itemsFa: ["سیم‌کارت محلی بگیرید.", "مسکن موقت تنظیم کنید.", "وقت آنملدونگ رزرو کنید."],
  },
  {
    countryCode: "DE",
    dayRange: "Day 8–30",
    title: "Registration & Setup",
    titleFa: "ثبت‌نام و راه‌اندازی",
    items: ["Complete Anmeldung.", "Apply for health insurance.", "Open a bank account."],
    itemsFa: ["آنملدونگ را کامل کنید.", "برای بیمه درمانی ثبت‌نام کنید.", "حساب بانکی باز کنید."],
  },
  {
    countryCode: "DE",
    dayRange: "Day 31–90",
    title: "Stabilize",
    titleFa: "تثبیت",
    items: ["Start language or integration course.", "Apply for jobs or training.", "Set up long-term housing."],
    itemsFa: ["شروع به کلاس زبان یا ادغام کنید.", "برای مشاغل یا آموزش ثبت‌نام کنید.", "مسکن بلندمدت تنظیم کنید."],
  },
  {
    countryCode: "GLOBAL",
    dayRange: "First 30 days",
    title: "Essentials",
    titleFa: "ضروریات",
    items: ["Register address/residency.", "Get health coverage.", "Open a bank account."],
    itemsFa: ["آدرس/اقامت را ثبت کنید.", "پوشش بهداشتی دریافت کنید.", "حساب بانکی باز کنید."],
  },
];

export const serviceDirectory: ServiceEntry[] = [
  // Legal & Immigration
  {
    countryCode: "DE",
    category: "Legal & Immigration",
    categoryFa: "حقوقی و اقامت",
    name: "Pro Asyl",
    nameFa: "پرو آزیل",
    summary: "Germany's largest refugee and migration legal aid organization. Free advice on asylum, residence permits, and rights.",
    summaryFa: "بزرگ‌ترین سازمان کمک حقوقی پناهندگان در آلمان. مشاوره رایگان درباره پناهندگی، اجازه اقامت و حقوق.",
    website: "https://www.proasyl.de",
    verified: true,
    verifiedNote: "Official NGO, founded 1986",
  },
  {
    countryCode: "DE",
    category: "Legal & Immigration",
    categoryFa: "حقوقی و اقامت",
    name: "Caritas Migration Counseling",
    nameFa: "مشاوره مهاجرتی کاریتاس",
    summary: "Free migration and integration counseling at offices nationwide. Helps with paperwork, permits, and social benefits.",
    summaryFa: "مشاوره رایگان مهاجرت و یکپارچگی در دفاتر سراسر آلمان. کمک با مدارک، مجوزها و مزایای اجتماعی.",
    website: "https://www.caritas.de/hilfeundberatung/onlineberatung/migrationsberatung",
    verified: true,
    verifiedNote: "Nationwide Catholic welfare organization",
  },
  {
    countryCode: "DE",
    category: "Legal & Immigration",
    categoryFa: "حقوقی و اقامت",
    name: "AWO Migrationsberatung",
    nameFa: "مشاوره مهاجرتی AWO",
    summary: "Workers' welfare association offering free migration counseling for adults. Offices in most German cities.",
    summaryFa: "انجمن رفاه کارگران که مشاوره مهاجرتی رایگان برای بزرگسالان ارائه می‌دهد. دفاتر در اکثر شهرهای آلمان.",
    website: "https://www.awo.org",
    verified: true,
    verifiedNote: "Nationwide welfare organization",
  },
  {
    countryCode: "DE",
    category: "Legal & Immigration",
    categoryFa: "حقوقی و اقامت",
    name: "Diakonie Migrationsberatung",
    nameFa: "مشاوره مهاجرتی دیاکونی",
    summary: "Protestant welfare organization. Free counseling on residency, employment rights, and integration.",
    summaryFa: "سازمان رفاه پروتستان. مشاوره رایگان درباره اقامت، حقوق کاری و یکپارچگی.",
    website: "https://www.diakonie.de",
    verified: true,
    verifiedNote: "Nationwide Protestant welfare organization",
  },
  // Translation
  {
    countryCode: "DE",
    category: "Translation",
    categoryFa: "ترجمه رسمی",
    name: "BDÜ Certified Translators",
    nameFa: "مترجمان رسمی BDÜ",
    summary: "Search for sworn (beeidigter) translators recognized by German courts and authorities. Required for Anmeldung, visa, and legal documents.",
    summaryFa: "جستجوی مترجمان سوگندخورده که توسط دادگاه‌ها و مراجع آلمانی به رسمیت شناخته شده‌اند. لازم برای آنملدونگ، ویزا و مدارک حقوقی.",
    website: "https://www.bdue.de/en/find-a-translator",
    verified: true,
    verifiedNote: "Federal Association of Interpreters and Translators",
  },
  {
    countryCode: "DE",
    category: "Translation",
    categoryFa: "ترجمه رسمی",
    name: "IHK-Certified Translators",
    nameFa: "مترجمان تأیید شده IHK",
    summary: "Find officially certified translators through Germany's Chamber of Commerce and Industry registry.",
    summaryFa: "مترجمان دارای گواهی رسمی را از طریق دفتر اتاق بازرگانی و صنعت آلمان پیدا کنید.",
    website: "https://www.ihk.de",
    verified: true,
    verifiedNote: "Official Chamber of Commerce registry",
  },
  // Tax
  {
    countryCode: "DE",
    category: "Tax",
    categoryFa: "مالیات",
    name: "Vereinigte Lohnsteuerhilfe (VLH)",
    nameFa: "اتحادیه کمک مالیات بر درآمد VLH",
    summary: "Germany's largest income tax assistance association. Affordable help with annual returns. Many offices have English-speaking staff.",
    summaryFa: "بزرگ‌ترین انجمن کمک مالیاتی آلمان. کمک مقرون به صرفه با اظهارنامه سالانه. بسیاری از دفاتر کارمندان انگلیسی‌زبان دارند.",
    website: "https://www.vlh.de",
    verified: true,
    verifiedNote: "1.4 million members across Germany",
  },
  {
    countryCode: "DE",
    category: "Tax",
    categoryFa: "مالیات",
    name: "ELSTER – Online Tax Filing",
    nameFa: "الکستر – اظهارنامه مالیاتی آنلاین",
    summary: "Official German tax authority portal. File your Steuererklärung (tax return) online for free.",
    summaryFa: "پورتال رسمی اداره مالیاتی آلمان. اظهارنامه مالیاتی خود را به صورت آنلاین و رایگان ثبت کنید.",
    website: "https://www.elster.de",
    verified: true,
    verifiedNote: "Official German tax authority",
  },
  // Housing
  {
    countryCode: "DE",
    category: "Housing & Tenants",
    categoryFa: "مسکن و مستأجران",
    name: "Deutscher Mieterbund",
    nameFa: "اتحادیه مستأجران آلمان",
    summary: "Germany's largest tenant protection association. Advice on rental contracts, deposits (Kaution), repairs, and eviction rights.",
    summaryFa: "بزرگ‌ترین انجمن حمایت از مستأجران آلمان. مشاوره درباره قرارداد اجاره، ودیعه، تعمیرات و حقوق تخلیه.",
    website: "https://www.mieterbund.de",
    verified: true,
    verifiedNote: "1.3 million members, local offices nationwide",
  },
  {
    countryCode: "DE",
    category: "Housing & Tenants",
    categoryFa: "مسکن و مستأجران",
    name: "Wohnungsgeberbestätigung Generator",
    nameFa: "ژنراتور تأییدیه موجر",
    summary: "Free tool to generate the landlord confirmation form required for Anmeldung. Your landlord is legally required to sign it.",
    summaryFa: "ابزار رایگان برای تولید فرم تأییدیه موجر که برای آنملدونگ لازم است. موجر شما موظف به امضای آن است.",
    website: "https://www.wohnungsgeberbestaetigung.de",
    verified: true,
    verifiedNote: "Free online form generator",
  },
  // Mental Health
  {
    countryCode: "DE",
    category: "Mental Health",
    categoryFa: "سلامت روان",
    name: "Refugio Berlin",
    nameFa: "رفوجیو برلین",
    city: "Berlin",
    summary: "Psychosocial support center for refugees and migrants. Offers therapy in multiple languages including Farsi.",
    summaryFa: "مرکز حمایت روانی-اجتماعی برای پناهندگان و مهاجران. درمان به چندین زبان از جمله فارسی ارائه می‌دهد.",
    website: "https://www.refugio.berlin",
    contact: "+49 30 2009 1490",
    verified: true,
    verifiedNote: "Non-profit, established 1996",
  },
  {
    countryCode: "DE",
    category: "Mental Health",
    categoryFa: "سلامت روان",
    name: "psychenet – Mental Health Network Hamburg",
    nameFa: "شبکه سلامت روان هامبورگ",
    city: "Hamburg",
    summary: "Hamburg's mental health network with multilingual crisis support and therapist referrals.",
    summaryFa: "شبکه سلامت روان هامبورگ با پشتیبانی بحران چندزبانه و ارجاع به درمانگر.",
    website: "https://www.psychenet.de",
    verified: true,
    verifiedNote: "Hamburg University Medical Center network",
  },
  {
    countryCode: "DE",
    category: "Mental Health",
    categoryFa: "سلامت روان",
    name: "Telefonseelsorge (Crisis Helpline)",
    nameFa: "خط کمک بحران",
    summary: "Free, anonymous 24/7 telephone counseling in German. For emotional distress and mental health crises.",
    summaryFa: "مشاوره تلفنی رایگان و ناشناس ۲۴/۷ به زبان آلمانی. برای ناراحتی عاطفی و بحران‌های سلامت روان.",
    contact: "0800 111 0 111",
    verified: true,
    verifiedNote: "Free nationwide service",
  },
  // Integration & Language
  {
    countryCode: "DE",
    category: "Integration & Language",
    categoryFa: "یکپارچگی و زبان",
    name: "BAMF Integration Courses",
    nameFa: "دوره‌های یکپارچگی BAMF",
    summary: "Government-subsidized German language and orientation courses. Required for most residence permits. Up to 1,000 hours.",
    summaryFa: "دوره‌های یادگیری زبان آلمانی و آشنایی با جامعه با یارانه دولتی. برای اکثر اجازه‌های اقامت الزامی است. تا ۱۰۰۰ ساعت.",
    website: "https://www.bamf.de/integrationskurse",
    verified: true,
    verifiedNote: "Federal Office for Migration and Refugees",
  },
  {
    countryCode: "DE",
    category: "Integration & Language",
    categoryFa: "یکپارچگی و زبان",
    name: "Volkshochschule (VHS)",
    nameFa: "مدرسه عمومی آلمان (VHS)",
    summary: "Adult education centers in every German city. Affordable German courses from A1 to B2, plus integration courses.",
    summaryFa: "مراکز آموزش بزرگسالان در هر شهر آلمان. دوره‌های مقرون‌به‌صرفه زبان آلمانی از A1 تا B2، و دوره‌های یکپارچگی.",
    website: "https://www.vhs.de",
    verified: true,
    verifiedNote: "Public institution, subsidized rates",
  },
  // Employment
  {
    countryCode: "DE",
    category: "Employment",
    categoryFa: "اشتغال",
    name: "Bundesagentur für Arbeit",
    nameFa: "آژانس فدرال کار آلمان",
    summary: "Germany's official employment agency. Register for job search support, Arbeitslosengeld (unemployment benefit), and career counseling.",
    summaryFa: "آژانس رسمی اشتغال آلمان. برای پشتیبانی جستجوی شغل، مزایای بیکاری و مشاوره شغلی ثبت‌نام کنید.",
    website: "https://www.arbeitsagentur.de",
    contact: "0800 4 5555 00",
    verified: true,
    verifiedNote: "Official federal employment agency",
  },
  {
    countryCode: "DE",
    category: "Employment",
    categoryFa: "اشتغال",
    name: "Make it in Germany",
    nameFa: "در آلمان موفق شوید",
    summary: "Official German government portal for skilled workers. Job search, visa info, recognition of foreign qualifications.",
    summaryFa: "پورتال رسمی دولت آلمان برای نیروهای متخصص. جستجوی شغل، اطلاعات ویزا، تأیید مدارک تحصیلی خارجی.",
    website: "https://www.make-it-in-germany.com",
    verified: true,
    verifiedNote: "Federal Government official portal",
  },
  // Health
  {
    countryCode: "DE",
    category: "Health Insurance",
    categoryFa: "بیمه درمانی",
    name: "Techniker Krankenkasse (TK)",
    nameFa: "صندوق بیمه درمانی تکنیکر",
    summary: "Recommended for newcomers. English-language service hotline, strong digital app, and multilingual support. Best for employees and students.",
    summaryFa: "برای تازه‌واردان توصیه می‌شود. خط تلفن به انگلیسی، اپلیکیشن دیجیتال قوی و پشتیبانی چندزبانه. بهترین برای کارمندان و دانشجویان.",
    website: "https://www.tk.de/en",
    contact: "0800 285 8585",
    verified: true,
    verifiedNote: "Germany's largest public health insurer",
  },
  {
    countryCode: "DE",
    category: "Health Insurance",
    categoryFa: "بیمه درمانی",
    name: "Barmer",
    nameFa: "بارمر",
    summary: "Good multilingual support including Persian. Strong app, nationwide offices. Good option for families.",
    summaryFa: "پشتیبانی چندزبانه خوب از جمله فارسی. اپلیکیشن قوی، دفاتر سراسری. گزینه خوب برای خانواده‌ها.",
    website: "https://www.barmer.de",
    contact: "0800 333 1010",
    verified: true,
    verifiedNote: "Second largest public health insurer",
  },
];

export const emergencyContacts: EmergencyContact[] = [
  {
    countryCode: "DE",
    category: "Police",
    categoryFa: "پلیس",
    number: "110",
    notes: "Immediate danger",
    notesFa: "خطر فوری",
  },
  {
    countryCode: "DE",
    category: "Fire / Medical",
    categoryFa: "آتش‌نشانی / اورژانس",
    number: "112",
    notes: "Ambulance or fire",
    notesFa: "آمبولانس یا آتش‌نشانی",
  },
  {
    countryCode: "DE",
    category: "Poison Control",
    categoryFa: "مرکز کنترل مسمومیت",
    number: "030 19240",
    notes: "Berlin poison control",
    notesFa: "مرکز کنترل مسمومیت برلین",
  },
  {
    countryCode: "DE",
    category: "Crisis Hotline",
    categoryFa: "خط بحران",
    number: "116 123",
    notes: "Emotional support, 24/7",
    notesFa: "حمایت عاطفی، ۲۴ ساعته",
  },
  {
    countryCode: "GLOBAL",
    category: "Embassy (Iran)",
    categoryFa: "سفارت (ایران)",
    number: "See local embassy website",
    notes: "For consular help",
    notesFa: "برای کمک کنسولی",
  },
];

export const formGuides: FormGuide[] = [
  {
    countryCode: "DE",
    title: "Anmeldung Registration Form",
    titleFa: "فرم ثبت‌نام آنملدونگ",
    summary: "Register your address at the Bürgeramt.",
    summaryFa: "آدرس خود را در بورگرامت ثبت کنید.",
    fields: [
      { name: "Familienname", persianHint: "نام خانوادگی" },
      { name: "Vorname", persianHint: "نام" },
      { name: "Geburtsdatum", persianHint: "تاریخ تولد", example: "01.01.1990" },
      { name: "Staatsangehörigkeit", persianHint: "تابعیت", example: "Iran" },
      { name: "Wohnungsgeber", persianHint: "نام صاحب‌خانه" },
      { name: "Einzugsdatum", persianHint: "تاریخ ورود", example: "10.02.2026" },
    ],
    tips: ["Bring landlord confirmation (Wohnungsgeberbestätigung).", "Use your passport spelling for names."],
    tipsFa: ["تأییدیه صاحب‌خانه (Wohnungsgeberbestätigung) بیاورید.", "از هجای گذرنامه برای نوشتن نام استفاده کنید."],
  },
  {
    countryCode: "DE",
    title: "Jobcenter Application (Basic)",
    titleFa: "درخواست جابسنتر (پایه)",
    summary: "First registration for support services.",
    summaryFa: "اولین ثبت‌نام برای خدمات حمایتی.",
    fields: [
      { name: "Kundennummer", persianHint: "شماره مشتری (اگر دارید)" },
      { name: "Adresse", persianHint: "آدرس" },
      { name: "Einkommen", persianHint: "درآمد", example: "0 EUR" },
      { name: "Miete", persianHint: "اجاره", example: "650 EUR" },
    ],
    tips: ["Bring rental contract and bank statements.", "Ask for interpreter support if needed."],
    tipsFa: ["قرارداد اجاره و صورتحساب بانکی بیاورید.", "در صورت نیاز درخواست مترجم کنید."],
  },
  {
    countryCode: "GLOBAL",
    title: "Generic Address Registration",
    titleFa: "فرم ثبت آدرس عمومی",
    summary: "Common fields for local registration forms.",
    summaryFa: "فیلدهای رایج برای فرم‌های ثبت محلی.",
    fields: [
      { name: "Full name", persianHint: "نام کامل" },
      { name: "Address", persianHint: "آدرس" },
      { name: "Date of arrival", persianHint: "تاریخ ورود" },
      { name: "Passport number", persianHint: "شماره گذرنامه" },
    ],
    tips: ["Use passport spelling for names."],
    tipsFa: ["از هجای گذرنامه برای نوشتن نام استفاده کنید."],
  },
];

export const deadlineItems: DeadlineItem[] = [
  {
    countryCode: "DE",
    title: "Anmeldung (address registration)",
    titleFa: "آنملدونگ (ثبت آدرس)",
    dueInDays: 14,
    notes: "Register your address at Bürgeramt within 14 days.",
    notesFa: "آدرس خود را ظرف ۱۴ روز در بورگرامت ثبت کنید.",
  },
  {
    countryCode: "DE",
    title: "Health insurance proof",
    titleFa: "گواهی بیمه درمانی",
    dueInDays: 30,
    notes: "Pick public or private insurance and get confirmation.",
    notesFa: "بیمه دولتی یا خصوصی انتخاب کنید و تأییدیه دریافت کنید.",
  },
  {
    countryCode: "DE",
    title: "Residence permit appointment",
    titleFa: "وقت مجوز اقامت",
    dueInDays: 60,
    notes: "Book Ausländerbehörde appointment if needed.",
    notesFa: "در صورت نیاز، وقت آوسلندربهورده رزرو کنید.",
  },
  {
    countryCode: "GLOBAL",
    title: "Local address registration",
    titleFa: "ثبت‌نام آدرس محلی",
    dueInDays: 14,
    notes: "Register your address or residency locally.",
    notesFa: "آدرس یا اقامت خود را به صورت محلی ثبت کنید.",
  },
  {
    countryCode: "GLOBAL",
    title: "Health coverage",
    titleFa: "پوشش بهداشتی",
    dueInDays: 30,
    notes: "Secure health insurance or coverage.",
    notesFa: "بیمه یا پوشش درمانی تأمین کنید.",
  },
];

export const residencyReminders: ReminderItem[] = [
  {
    countryCode: "DE",
    title: "Register address (Anmeldung)",
    titleFa: "ثبت آدرس (آنملدونگ)",
    dueInDays: 14,
    notes: "Book appointment and bring landlord confirmation.",
    notesFa: "وقت رزرو کنید و تأییدیه صاحب‌خانه بیاورید.",
  },
  {
    countryCode: "DE",
    title: "Health insurance confirmation",
    titleFa: "تأییدیه بیمه درمانی",
    dueInDays: 30,
    notes: "Pick public/private insurance and request confirmation.",
    notesFa: "بیمه دولتی/خصوصی انتخاب کنید و درخواست تأییدیه دهید.",
  },
  {
    countryCode: "DE",
    title: "Residence permit appointment",
    titleFa: "وقت مجوز اقامت",
    dueInDays: 60,
    notes: "Schedule Ausländerbehörde appointment if needed.",
    notesFa: "در صورت نیاز، وقت آوسلندربهورده برنامه‌ریزی کنید.",
  },
  {
    countryCode: "GLOBAL",
    title: "Local address registration",
    titleFa: "ثبت‌نام آدرس محلی",
    dueInDays: 14,
    notes: "Register your address or residency locally.",
    notesFa: "آدرس یا اقامت خود را به صورت محلی ثبت کنید.",
  },
  {
    countryCode: "GLOBAL",
    title: "Health coverage setup",
    titleFa: "راه‌اندازی پوشش بهداشتی",
    dueInDays: 30,
    notes: "Secure insurance or coverage.",
    notesFa: "بیمه یا پوشش درمانی تأمین کنید.",
  },
];

export const schoolGuides: SchoolGuide[] = [
  {
    countryCode: "DE",
    title: "School Enrollment (Children 6-16)",
    titleFa: "ثبت‌نام مدرسه (کودکان ۶-۱۶ سال)",
    summary: "Public school enrollment steps for Germany.",
    summaryFa: "مراحل ثبت‌نام در مدرسه دولتی آلمان.",
    steps: [
      "Register your address (Anmeldung).",
      "Contact the local Schulamt (education office).",
      "Schedule placement or language assessment if needed.",
      "Submit enrollment forms and documents.",
    ],
    stepsFa: [
      "آدرس خود را ثبت کنید (آنملدونگ).",
      "با شولامت (اداره آموزش و پرورش) محلی تماس بگیرید.",
      "در صورت نیاز، آزمون سطح‌بندی یا ارزیابی زبانی برنامه‌ریزی کنید.",
      "فرم‌های ثبت‌نام و مدارک را ارائه دهید.",
    ],
    documents: [
      "Child passport or ID",
      "Residence permit (if applicable)",
      "Anmeldung certificate",
      "Vaccination record (Impfpass)",
      "Previous school records (if any)",
    ],
    documentsFa: [
      "گذرنامه یا کارت شناسایی کودک",
      "مجوز اقامت (در صورت لزوم)",
      "گواهی آنملدونگ",
      "کارت واکسیناسیون (ایمپفپاس)",
      "مدارک مدرسه قبلی (در صورت وجود)",
    ],
  },
  {
    countryCode: "GLOBAL",
    title: "School Enrollment Basics",
    titleFa: "اصول ثبت‌نام مدرسه",
    summary: "Common steps for enrolling children in public schools.",
    summaryFa: "مراحل رایج برای ثبت‌نام کودکان در مدارس دولتی.",
    steps: [
      "Check local school district rules.",
      "Prepare identification and residency proofs.",
      "Ask about language support programs.",
    ],
    stepsFa: [
      "قوانین منطقه آموزشی محلی را بررسی کنید.",
      "شناسنامه و مدارک اقامت را آماده کنید.",
      "درباره برنامه‌های حمایت زبانی سؤال کنید.",
    ],
    documents: ["Child ID/passport", "Proof of address", "Vaccination records"],
    documentsFa: ["شناسنامه/گذرنامه کودک", "گواهی آدرس", "مدارک واکسیناسیون"],
  },
];

export const supportResources: SupportResource[] = [
  {
    countryCode: "DE",
    category: "Mental Health",
    categoryFa: "سلامت روان",
    name: "Persian-Speaking Therapists",
    nameFa: "درمانگران فارسی‌زبان",
    summary: "Find Farsi-speaking counselors and therapists.",
    summaryFa: "مشاوران و درمانگران فارسی‌زبان را پیدا کنید.",
    contact: "Ask your Hausarzt for referrals",
  },
  {
    countryCode: "DE",
    category: "Women's Support",
    categoryFa: "حمایت از زنان",
    name: "Women's Counseling Centers",
    nameFa: "مراکز مشاوره زنان",
    summary: "Support for women, family, and safety concerns.",
    summaryFa: "حمایت برای زنان، خانواده و نگرانی‌های ایمنی.",
    contact: "Local Frauenberatung offices",
  },
  {
    countryCode: "DE",
    category: "Crisis",
    categoryFa: "بحران",
    name: "Crisis Hotline",
    nameFa: "خط بحران",
    summary: "Immediate emotional support and crisis help.",
    summaryFa: "حمایت عاطفی فوری و کمک در بحران.",
    contact: "Telefonseelsorge 116 123",
  },
  {
    countryCode: "GLOBAL",
    category: "Mental Health",
    categoryFa: "سلامت روان",
    name: "Local Counseling Services",
    nameFa: "خدمات مشاوره محلی",
    summary: "Search for counseling services in your city.",
    summaryFa: "خدمات مشاوره در شهر خود را جستجو کنید.",
  },
  {
    countryCode: "GLOBAL",
    category: "Women's Support",
    categoryFa: "حمایت از زنان",
    name: "Women's Resource Centers",
    nameFa: "مراکز منابع زنان",
    summary: "Safety and support resources for women.",
    summaryFa: "منابع ایمنی و حمایت برای زنان.",
  },
];

export const housingChecklists: HousingChecklist[] = [
  {
    countryCode: "DE",
    title: "Housing Safety Checklist",
    titleFa: "چک‌لیست ایمنی مسکن",
    items: [
      "Signed rental contract with full address",
      "Deposit receipt and payment method",
      "Handover protocol (Übergabeprotokoll)",
      "Check for mold, heating, and water issues",
      "Confirm who pays utilities (Nebenkosten)",
    ],
    itemsFa: [
      "قرارداد اجاره امضاشده با آدرس کامل",
      "رسید ودیعه و روش پرداخت",
      "پروتکل تحویل (Übergabeprotokoll)",
      "بررسی کپک، گرمایش و مشکلات آب",
      "تأیید چه کسی هزینه‌های جانبی (Nebenkosten) را می‌پردازد",
    ],
    warnings: [
      "Never pay cash without receipt.",
      "Avoid listings that require prepayment before viewing.",
      "Verify landlord identity and property address.",
    ],
    warningsFa: [
      "هرگز بدون رسید نقد پرداخت نکنید.",
      "از آگهی‌هایی که قبل از بازدید پیش‌پرداخت می‌خواهند اجتناب کنید.",
      "هویت صاحب‌خانه و آدرس ملک را تأیید کنید.",
    ],
  },
  {
    countryCode: "GLOBAL",
    title: "Housing Safety Checklist",
    titleFa: "چک‌لیست ایمنی مسکن",
    items: [
      "Written contract with full address",
      "Receipt for deposits or fees",
      "Check utilities, locks, and safety",
      "Confirm who pays which bills",
    ],
    itemsFa: [
      "قرارداد کتبی با آدرس کامل",
      "رسید ودیعه یا هزینه‌ها",
      "بررسی تأسیسات، قفل‌ها و ایمنی",
      "تأیید چه کسی کدام قبض‌ها را پرداخت می‌کند",
    ],
    warnings: ["Avoid prepayment before viewing.", "Verify landlord identity and address."],
    warningsFa: ["قبل از بازدید پیش‌پرداخت نکنید.", "هویت صاحب‌خانه و آدرس را تأیید کنید."],
  },
];

export const taxReminders: TaxReminder[] = [
  {
    countryCode: "DE",
    title: "Annual tax return",
    titleFa: "اظهارنامه مالیاتی سالانه",
    timing: "Yearly (often by July 31)",
    timingFa: "سالانه (معمولاً تا ۳۱ جولای)",
    notes: "Use ELSTER or a tax advisor for filing.",
    notesFa: "برای تسلیم از ELSTER یا مشاور مالیاتی استفاده کنید.",
  },
  {
    countryCode: "DE",
    title: "Check tax class (Steuerklasse)",
    titleFa: "بررسی کلاس مالیاتی (اشتویرکلاسه)",
    timing: "After marriage or job change",
    timingFa: "پس از ازدواج یا تغییر شغل",
    notes: "Update via Finanzamt if needed.",
    notesFa: "در صورت نیاز از طریق فینانزامت به‌روزرسانی کنید.",
  },
  {
    countryCode: "GLOBAL",
    title: "Annual tax return",
    titleFa: "اظهارنامه مالیاتی سالانه",
    timing: "Yearly (local deadline)",
    timingFa: "سالانه (موعد محلی)",
    notes: "Check local tax authority deadlines.",
    notesFa: "موعدهای اداره مالیاتی محلی را بررسی کنید.",
  },
];

export const phrasebook: PhraseEntry[] = [
  // Emergency
  { countryCode: "DE", category: "Emergency", categoryFa: "اورژانس", phrase: "I need help!", german: "Ich brauche Hilfe!", persian: "من به کمک نیاز دارم!", romanized: "man be komak niaz daram" },
  { countryCode: "DE", category: "Emergency", categoryFa: "اورژانس", phrase: "Call the police!", german: "Rufen Sie die Polizei!", persian: "با پلیس تماس بگیرید!", romanized: "ba polis tamas begirid" },
  { countryCode: "DE", category: "Emergency", categoryFa: "اورژانس", phrase: "Call an ambulance!", german: "Rufen Sie einen Krankenwagen!", persian: "آمبولانس صدا کنید!", romanized: "ambulans seda konid" },
  { countryCode: "DE", category: "Emergency", categoryFa: "اورژانس", phrase: "There is a fire!", german: "Es brennt!", persian: "آتش گرفته!", romanized: "atash gerafte" },
  // Medical
  { countryCode: "DE", category: "Medical", categoryFa: "پزشکی", phrase: "I feel sick.", german: "Ich bin krank.", persian: "حالم خوب نیست.", romanized: "halam khub nist" },
  { countryCode: "DE", category: "Medical", categoryFa: "پزشکی", phrase: "I need a doctor.", german: "Ich brauche einen Arzt.", persian: "به دکتر نیاز دارم.", romanized: "be doktor niaz daram" },
  { countryCode: "DE", category: "Medical", categoryFa: "پزشکی", phrase: "I have pain here.", german: "Ich habe hier Schmerzen.", persian: "اینجا درد دارم.", romanized: "inja dard daram" },
  { countryCode: "DE", category: "Medical", categoryFa: "پزشکی", phrase: "I am allergic to...", german: "Ich bin allergisch gegen...", persian: "من به ... حساسیت دارم.", romanized: "man be ... hassasiyat daram" },
  { countryCode: "DE", category: "Medical", categoryFa: "پزشکی", phrase: "I need a prescription.", german: "Ich brauche ein Rezept.", persian: "به نسخه پزشکی نیاز دارم.", romanized: "be noskheh pezeshki niaz daram" },
  { countryCode: "DE", category: "Medical", categoryFa: "پزشکی", phrase: "Do you speak English?", german: "Sprechen Sie Englisch?", persian: "آیا انگلیسی صحبت می‌کنید؟", romanized: "aya englisi sohbat mikonid" },
  // At the Office (Bürgeramt)
  { countryCode: "DE", category: "At the Office", categoryFa: "در اداره", phrase: "I have an appointment.", german: "Ich habe einen Termin.", persian: "وقت قبلی دارم.", romanized: "vaght ghabli daram" },
  { countryCode: "DE", category: "At the Office", categoryFa: "در اداره", phrase: "I would like to register my address.", german: "Ich möchte mich anmelden.", persian: "می‌خواهم آدرسم را ثبت کنم.", romanized: "mikhAham adresam ra sabt konam" },
  { countryCode: "DE", category: "At the Office", categoryFa: "در اداره", phrase: "What documents do I need?", german: "Welche Dokumente brauche ich?", persian: "چه مدارکی نیاز دارم؟", romanized: "che madaraki niaz daram" },
  { countryCode: "DE", category: "At the Office", categoryFa: "در اداره", phrase: "Please speak slowly.", german: "Bitte sprechen Sie langsam.", persian: "لطفاً آرام صحبت کنید.", romanized: "lotfan aram sohbat konid" },
  { countryCode: "DE", category: "At the Office", categoryFa: "در اداره", phrase: "I do not understand.", german: "Ich verstehe nicht.", persian: "نمی‌فهمم.", romanized: "nemifahmam" },
  { countryCode: "DE", category: "At the Office", categoryFa: "در اداره", phrase: "Can you write it down?", german: "Können Sie das aufschreiben?", persian: "می‌توانید آن را بنویسید؟", romanized: "mitavanid an ra benevisid" },
  // Banking
  { countryCode: "DE", category: "Banking", categoryFa: "بانک", phrase: "I would like to open an account.", german: "Ich möchte ein Konto eröffnen.", persian: "می‌خواهم حساب باز کنم.", romanized: "mikhAham hesab baz konam" },
  { countryCode: "DE", category: "Banking", categoryFa: "بانک", phrase: "What is my IBAN?", german: "Was ist meine IBAN?", persian: "IBAN من چیست؟", romanized: "IBAN man chist" },
  { countryCode: "DE", category: "Banking", categoryFa: "بانک", phrase: "I lost my bank card.", german: "Ich habe meine Bankkarte verloren.", persian: "کارت بانکی‌ام را گم کرده‌ام.", romanized: "kart bankiam ra gom kardeam" },
  { countryCode: "DE", category: "Banking", categoryFa: "بانک", phrase: "I would like to transfer money.", german: "Ich möchte Geld überweisen.", persian: "می‌خواهم پول انتقال دهم.", romanized: "mikhAham pul entegal deham" },
  // Transport
  { countryCode: "DE", category: "Transport", categoryFa: "حمل‌ونقل", phrase: "Where is the train station?", german: "Wo ist der Bahnhof?", persian: "ایستگاه قطار کجاست؟", romanized: "istgah gatar kojast" },
  { countryCode: "DE", category: "Transport", categoryFa: "حمل‌ونقل", phrase: "One ticket to..., please.", german: "Einmal nach..., bitte.", persian: "یک بلیط به ... لطفاً.", romanized: "yek belit be ... lotfan" },
  { countryCode: "DE", category: "Transport", categoryFa: "حمل‌ونقل", phrase: "Is this the right bus for...?", german: "Ist das der richtige Bus nach...?", persian: "آیا این اتوبوس به ... می‌رود؟", romanized: "aya in otobus be ... miravad" },
  { countryCode: "DE", category: "Transport", categoryFa: "حمل‌ونقل", phrase: "I need to validate my ticket.", german: "Ich muss meinen Fahrschein entwerten.", persian: "باید بلیطم را اعتبارسنجی کنم.", romanized: "bayad belitam ra etebarsanji konam" },
  // Housing
  { countryCode: "DE", category: "Housing", categoryFa: "مسکن", phrase: "I am looking for an apartment.", german: "Ich suche eine Wohnung.", persian: "دنبال آپارتمان می‌گردم.", romanized: "donbal apartman migardam" },
  { countryCode: "DE", category: "Housing", categoryFa: "مسکن", phrase: "How much is the rent?", german: "Wie hoch ist die Miete?", persian: "اجاره چقدر است؟", romanized: "ejare cheghadr ast" },
  { countryCode: "DE", category: "Housing", categoryFa: "مسکن", phrase: "The heating is not working.", german: "Die Heizung funktioniert nicht.", persian: "گرمایش کار نمی‌کند.", romanized: "garmayesh kar nemikonad" },
  { countryCode: "DE", category: "Housing", categoryFa: "مسکن", phrase: "I need the landlord's confirmation form.", german: "Ich brauche die Wohnungsgeberbestätigung.", persian: "به تأییدیه موجر نیاز دارم.", romanized: "be ta'idiyeh mojar niaz daram" },
  // Daily Life
  { countryCode: "DE", category: "Daily Life", categoryFa: "زندگی روزمره", phrase: "Where is the supermarket?", german: "Wo ist der Supermarkt?", persian: "سوپرمارکت کجاست؟", romanized: "supermarket kojast" },
  { countryCode: "DE", category: "Daily Life", categoryFa: "زندگی روزمره", phrase: "How much does this cost?", german: "Was kostet das?", persian: "این چقدر است؟", romanized: "in cheghadr ast" },
  { countryCode: "DE", category: "Daily Life", categoryFa: "زندگی روزمره", phrase: "Do you accept card payment?", german: "Akzeptieren Sie Kartenzahlung?", persian: "پرداخت کارتی قبول می‌کنید؟", romanized: "pardakht karti qabul mikonid" },
  { countryCode: "DE", category: "Daily Life", categoryFa: "زندگی روزمره", phrase: "Can I get a receipt?", german: "Kann ich eine Quittung bekommen?", persian: "می‌توانم رسید بگیرم؟", romanized: "mitavanam resid begiram" },
  // Workplace
  { countryCode: "DE", category: "Workplace", categoryFa: "محل کار", phrase: "I would like to apply for this job.", german: "Ich möchte mich auf diese Stelle bewerben.", persian: "می‌خواهم برای این شغل درخواست دهم.", romanized: "mikhAham baraye in shoql darkhast deham" },
  { countryCode: "DE", category: "Workplace", categoryFa: "محل کار", phrase: "What is my tax class?", german: "Was ist meine Steuerklasse?", persian: "کلاس مالیاتی من چیست؟", romanized: "kelas maliyati man chist" },
  { countryCode: "DE", category: "Workplace", categoryFa: "محل کار", phrase: "I would like to take a sick day.", german: "Ich bin krankgeschrieben.", persian: "مریضم و نمی‌توانم بیایم.", romanized: "marizam va nemitavanam biayam" },
  { countryCode: "DE", category: "Workplace", categoryFa: "محل کار", phrase: "When will I receive my payslip?", german: "Wann bekomme ich meine Gehaltsabrechnung?", persian: "فیش حقوقی‌ام را کِی می‌گیرم؟", romanized: "fish hoghugiam ra key migiram" },
];

export function getStarterPack(countryCode: string): StarterPack {
  return (
    starterPacks.find((pack) => pack.countryCode === countryCode) ||
    starterPacks.find((pack) => pack.countryCode === "GLOBAL")!
  );
}

export function getTimeline(countryCode: string): TimelineItem[] {
  const items = timelineItems.filter((item) => item.countryCode === countryCode);
  return items.length ? items : timelineItems.filter((i) => i.countryCode === "GLOBAL");
}

export function getServices(countryCode: string): ServiceEntry[] {
  return serviceDirectory.filter((service) => service.countryCode === countryCode);
}

export function getEmergencyContacts(countryCode: string): EmergencyContact[] {
  const items = emergencyContacts.filter((contact) => contact.countryCode === countryCode);
  return items.length ? items : emergencyContacts.filter((contact) => contact.countryCode === "GLOBAL");
}

export function getFormGuides(countryCode: string): FormGuide[] {
  const items = formGuides.filter((guide) => guide.countryCode === countryCode);
  return items.length ? items : formGuides.filter((g) => g.countryCode === "GLOBAL");
}

export function getResidencyReminders(countryCode: string): ReminderItem[] {
  const items = residencyReminders.filter((item) => item.countryCode === countryCode);
  return items.length ? items : residencyReminders.filter((item) => item.countryCode === "GLOBAL");
}

export function getDeadlines(countryCode: string): DeadlineItem[] {
  const items = deadlineItems.filter((item) => item.countryCode === countryCode);
  return items.length ? items : deadlineItems.filter((item) => item.countryCode === "GLOBAL");
}

export function getSchoolGuide(countryCode: string): SchoolGuide {
  return (
    schoolGuides.find((guide) => guide.countryCode === countryCode) ||
    schoolGuides.find((guide) => guide.countryCode === "GLOBAL")!
  );
}

export function getSupportResources(countryCode: string): SupportResource[] {
  const items = supportResources.filter((item) => item.countryCode === countryCode);
  return items.length ? items : supportResources.filter((item) => item.countryCode === "GLOBAL");
}

export function getHousingChecklist(countryCode: string): HousingChecklist {
  return (
    housingChecklists.find((item) => item.countryCode === countryCode) ||
    housingChecklists.find((item) => item.countryCode === "GLOBAL")!
  );
}

export function getTaxReminders(countryCode: string): TaxReminder[] {
  const items = taxReminders.filter((item) => item.countryCode === countryCode);
  return items.length ? items : taxReminders.filter((item) => item.countryCode === "GLOBAL");
}

export function getPhrasebook(countryCode: string): PhraseEntry[] {
  const items = phrasebook.filter((item) => item.countryCode === countryCode);
  return items.length ? items : phrasebook.filter((item) => item.countryCode === "GLOBAL");
}
