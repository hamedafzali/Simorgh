export type GuideResource = {
  title: string;
  url: string;
  note?: string;
};

export type GuideSection = {
  title: string;
  titleFa?: string;
  bullets: string[];
  bulletsFa?: string[];
};

export type Guide = {
  id: string;
  title: string;
  titleFa?: string;
  category: string;
  categoryFa?: string;
  summary: string;
  summaryFa?: string;
  city?: string;
  steps: string[];
  stepsFa?: string[];
  checklist: string[];
  checklistFa?: string[];
  sections?: GuideSection[];
  resources?: GuideResource[];
  updatedAt: string;
};



export type DocumentGuide = {
  id: string;
  title: string;
  titleFa?: string;
  category: string;
  summary: string;
  summaryFa?: string;
  steps: string[];
  stepsFa?: string[];
  checklist: string[];
  checklistFa?: string[];
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
    titleFa: "آنملدونگ (ثبت شهری)",
    category: "Residency & Registration",
    categoryFa: "اقامت و ثبت‌نام",
    summary: "Register your address at the Bürgeramt within 14 days after moving.",
    summaryFa: "آدرس خود را ظرف ۱۴ روز از نقل‌مکان در بورگرامت ثبت کنید.",
    steps: [
      "Book an appointment online (Bürgeramt / Rathaus).",
      "Bring your passport, rental contract, and landlord confirmation.",
      "Complete the registration form (Anmeldung form).",
      "Receive your Meldebescheinigung on the spot.",
    ],
    stepsFa: [
      "آنلاین وقت رزرو کنید (بورگرامت / راتهاوس).",
      "گذرنامه، قرارداد اجاره و تأییدیه صاحب‌خانه بیاورید.",
      "فرم ثبت‌نام (آنملدونگ) را پر کنید.",
      "ملدبشایینیگونگ را در همان لحظه دریافت کنید.",
    ],
    checklist: ["Passport", "Rental contract", "Wohnungsgeberbestätigung (landlord confirmation)", "Completed registration form"],
    checklistFa: ["گذرنامه", "قرارداد اجاره", "Wohnungsgeberbestätigung (تأییدیه صاحب‌خانه)", "فرم ثبت‌نام تکمیل‌شده"],
    sections: [
      {
        title: "Wohnungsgeberbestätigung — Landlord Confirmation",
        titleFa: "Wohnungsgeberbestätigung — تأییدیه صاحب‌خانه",
        bullets: [
          "This form is required by law — without it the Bürgeramt will turn you away.",
          "Your landlord must sign it; they cannot legally refuse.",
          "If landlord refuses: send a written request by email and keep the record. Report to the Bürgeramt — they can issue a reminder.",
          "Download the blank form from your city's website or ask the Bürgeramt.",
          "Airbnb and short-term lets: the host may refuse. Try to negotiate — without it you cannot register.",
        ],
        bulletsFa: [
          "این فرم قانوناً اجباری است — بدون آن بورگرامت شما را برمی‌گرداند.",
          "صاحب‌خانه باید آن را امضا کند و از نظر قانونی حق رد کردن ندارد.",
          "اگر صاحب‌خانه امتناع کرد: درخواست کتبی از طریق ایمیل ارسال کنید و سابقه را نگه دارید. به بورگرامت اطلاع دهید — آن‌ها می‌توانند یادآوری قانونی صادر کنند.",
          "فرم خالی را از وب‌سایت شهر خود دانلود کنید یا از بورگرامت بخواهید.",
          "در Airbnb و اجاره‌های کوتاه‌مدت: میزبان ممکن است امتناع کند. سعی کنید مذاکره کنید — بدون آن نمی‌توانید ثبت‌نام کنید.",
        ],
      },
      {
        title: "Booking a Bürgeramt Appointment",
        titleFa: "رزرو وقت بورگرامت",
        bullets: [
          "Slots are released daily at midnight — check early morning for cancellations.",
          "Berlin: service.berlin.de | Munich: muenchen.de | Frankfurt: frankfurt.de",
          "Many cities allow walk-ins (Spontantermin) first thing in the morning — arrive 30 min before opening.",
          "If no appointments available: try neighbouring districts — you can register at any Bürgeramt in your city.",
          "Bring all documents even if listed as optional — missing one means rebooking.",
        ],
        bulletsFa: [
          "وقت‌ها هر روز نیمه‌شب آزاد می‌شوند — اول صبح برای لغوی‌ها چک کنید.",
          "برلین: service.berlin.de | مونیخ: muenchen.de | فرانکفورت: frankfurt.de",
          "بسیاری از شهرها اول صبح مراجعه بدون وقت (Spontantermin) می‌پذیرند — ۳۰ دقیقه قبل از باز شدن برسید.",
          "اگر وقت موجود نبود: منطقه‌های دیگر شهر را امتحان کنید — می‌توانید در هر بورگرامت شهر ثبت‌نام کنید.",
          "همه مدارک را بیاورید حتی اگر اختیاری باشند — یک مدرک کم یعنی رزرو مجدد.",
        ],
      },
      {
        title: "If You Miss the 14-Day Deadline",
        titleFa: "اگر مهلت ۱۴ روزه را از دست دادید",
        bullets: [
          "Late registration is not automatically punished — but it can cause problems with residence permit and health insurance.",
          "Register as soon as you can. The Bürgeramt may note the delay but typically does not fine first-time arrivals.",
          "Never falsify the move-in date on the form.",
          "If your residence permit depends on Anmeldung, contact the Ausländerbehörde immediately to explain the delay.",
        ],
        bulletsFa: [
          "دیر ثبت‌نام کردن به طور خودکار جریمه ندارد — اما می‌تواند مشکل اقامت و بیمه ایجاد کند.",
          "هر چه زودتر ثبت‌نام کنید. بورگرامت ممکن است تأخیر را یادداشت کند اما معمولاً تازه‌واردان را جریمه نمی‌کند.",
          "هرگز تاریخ نقل‌مکان را در فرم جعل نکنید.",
          "اگر اقامت شما به آنملدونگ بستگی دارد، فوراً با آوسلندربهورده تماس بگیرید و تأخیر را توضیح دهید.",
        ],
      },
    ],
    resources: [
      { title: "Berlin Bürgeramt appointments", url: "https://service.berlin.de/terminvereinbarung/" },
      { title: "Munich registration portal", url: "https://www.muenchen.de/rathaus/home_en/Department-of-Public-Order/Registration-Deregistration-and-Change-of-Address.html" },
      { title: "Wohnungsgeberbestätigung form (federal)", url: "https://www.mieterbund.de/mietrecht/mietrecht-a-z/w/wohnungsgeberbestaetigung.html" },
    ],
    updatedAt: "2026-05-16",
  },
  {
    id: "g-tax-id",
    title: "Tax ID (Steuer-ID)",
    titleFa: "شناسه مالیاتی (اشتویر-آی‌دی)",
    category: "Work & Taxes",
    categoryFa: "کار و مالیات",
    summary: "Your tax ID arrives by mail after Anmeldung; needed for jobs and payroll.",
    summaryFa: "شناسه مالیاتی پس از آنملدونگ از طریق پست می‌رسد؛ برای مشاغل و حقوق لازم است.",
    steps: [
      "Complete Anmeldung first.",
      "Wait for the letter (usually 2–3 weeks).",
      "If not received, request it from the tax office.",
    ],
    stepsFa: [
      "ابتدا آنملدونگ را کامل کنید.",
      "منتظر نامه باشید (معمولاً ۲-۳ هفته).",
      "اگر دریافت نشد، از اداره مالیاتی درخواست کنید.",
    ],
    checklist: ["Meldebescheinigung", "Valid address", "Passport"],
    checklistFa: ["ملدبشایینیگونگ", "آدرس معتبر", "گذرنامه"],
    resources: [{ title: "Request tax ID (Bundeszentralamt)", url: "https://www.bzst.de/SiteGlobals/Kontaktformulare/DE/Steuerliche_IDNr/steuerliche_idnr_node.html" }],
    updatedAt: "2026-02-08",
  },
  {
    id: "g-health-insurance",
    title: "Health Insurance (Krankenkasse)",
    titleFa: "بیمه درمانی (کرانکنکاسه)",
    category: "Health",
    categoryFa: "سلامت",
    summary: "Choose a public or private health insurer; you must be insured in Germany.",
    summaryFa: "یک بیمه‌گر دولتی یا خصوصی انتخاب کنید؛ داشتن بیمه در آلمان اجباری است.",
    steps: [
      "Compare public insurers (TK, AOK, Barmer, etc.).",
      "Apply online or in person.",
      "Provide employer details (if employed).",
      "Receive insurance card and member number.",
    ],
    stepsFa: [
      "بیمه‌گرهای دولتی را مقایسه کنید (TK، AOK، Barmer و غیره).",
      "آنلاین یا حضوری ثبت‌نام کنید.",
      "اطلاعات کارفرما را ارائه دهید (در صورت استخدام).",
      "کارت بیمه و شماره عضویت دریافت کنید.",
    ],
    checklist: ["Passport", "Address in Germany", "Employer information (if applicable)", "Residence permit or visa"],
    checklistFa: ["گذرنامه", "آدرس در آلمان", "اطلاعات کارفرما (در صورت لزوم)", "مجوز اقامت یا ویزا"],
    sections: [
      {
        title: "Which Insurer to Choose",
        titleFa: "کدام بیمه را انتخاب کنیم",
        bullets: [
          "TK (Techniker Krankenkasse): best English-language support, strong app, popular with engineers and tech workers. Recommended for most newcomers.",
          "Barmer: good multilingual support, easy online application, widely accepted.",
          "AOK: most common, regional offices everywhere, better for families with children, less English support.",
          "All public insurers cover the same basic services — the difference is service quality, app features, and extras.",
          "Cost: ~14.6% of gross salary split between you and employer. Maximum cap applies for high earners.",
        ],
        bulletsFa: [
          "TK (تکنیکر کرانکنکاسه): بهترین پشتیبانی به زبان انگلیسی، اپ قوی، محبوب در میان مهندسان و کارگران فنی. توصیه می‌شود برای اکثر تازه‌واردان.",
          "Barmer: پشتیبانی چندزبانه خوب، درخواست آنلاین آسان، پذیرفته‌شده در همه‌جا.",
          "AOK: رایج‌ترین، شعبات منطقه‌ای همه‌جا، بهتر برای خانواده‌هایی با فرزند، پشتیبانی انگلیسی کمتر.",
          "همه بیمه‌گران دولتی خدمات پایه یکسان دارند — تفاوت در کیفیت خدمات، امکانات اپ و مزایای اضافی است.",
          "هزینه: حدود ۱۴.۶٪ از حقوق ناخالص که بین شما و کارفرما تقسیم می‌شود. سقف حداکثری برای درآمدهای بالا اعمال می‌شود.",
        ],
      },
      {
        title: "Before Your First Day of Work",
        titleFa: "قبل از اولین روز کار",
        bullets: [
          "You must provide your insurer's name to HR before or on day one — they register you automatically.",
          "If you are self-employed or a student: apply directly to the insurer yourself.",
          "Between jobs or without income: you may qualify for free family co-insurance (Familienversicherung) through a spouse.",
          "Visiting or tourist visa holders: get travel health insurance first, then switch to public insurance once you have a residence permit.",
        ],
        bulletsFa: [
          "باید نام بیمه‌گر خود را قبل یا در روز اول به منابع انسانی بدهید — آن‌ها شما را به طور خودکار ثبت می‌کنند.",
          "اگر خوداشتغال یا دانشجو هستید: مستقیماً با بیمه‌گر ثبت‌نام کنید.",
          "بین مشاغل یا بدون درآمد: ممکن است واجد شرایط بیمه خانوادگی رایگان (Familienversicherung) از طریق همسر باشید.",
          "دارندگان ویزای توریستی: ابتدا بیمه درمانی سفر تهیه کنید، سپس پس از دریافت مجوز اقامت به بیمه دولتی تغییر دهید.",
        ],
      },
    ],
    updatedAt: "2026-05-16",
  },
  {
    id: "g-bank-account",
    title: "Open a Bank Account",
    titleFa: "باز کردن حساب بانکی",
    category: "Banking",
    categoryFa: "بانکداری",
    summary: "Open a Girokonto for salary, rent, and daily payments. Online and local options.",
    summaryFa: "یک گیروکونتو برای حقوق، اجاره و پرداخت‌های روزمره باز کنید. گزینه‌های آنلاین و محلی وجود دارد.",
    steps: [
      "Pick a bank (N26, DKB, Commerzbank, Sparkasse).",
      "Complete identity verification (PostIdent or video).",
      "Provide address and ID.",
      "Receive IBAN and bank card.",
    ],
    stepsFa: [
      "یک بانک انتخاب کنید (N26، DKB، Commerzbank، Sparkasse).",
      "احراز هویت را کامل کنید (PostIdent یا ویدیویی).",
      "آدرس و مدرک شناسایی ارائه دهید.",
      "IBAN و کارت بانکی دریافت کنید.",
    ],
    checklist: ["Passport", "German address (or foreign for N26/DKB)", "Phone/email", "Video call or PostIdent for verification"],
    checklistFa: ["گذرنامه", "آدرس آلمانی (یا خارجی برای N26/DKB)", "تلفن/ایمیل", "تماس ویدیویی یا PostIdent برای احراز هویت"],
    sections: [
      {
        title: "Before Anmeldung — Open Without a German Address",
        titleFa: "قبل از آنملدونگ — بدون آدرس آلمانی",
        bullets: [
          "N26: fully online, accepts foreign address, identity via video call. Open the same day. Free tier available. Best option for day 1.",
          "DKB (Deutsche Kreditbank): online application, accepts foreign address initially. Free with active use.",
          "Revolut / Wise: not German bank accounts but work for daily payments and receiving salary while you wait. No IBAN issues for most employers.",
          "Traditional banks (Commerzbank, Sparkasse, Deutsche Bank): require Meldebescheinigung — apply after Anmeldung.",
        ],
        bulletsFa: [
          "N26: کاملاً آنلاین، آدرس خارجی قبول می‌کند، احراز هویت از طریق تماس ویدیویی. همان روز باز می‌شود. طرح رایگان دارد. بهترین گزینه برای روز اول.",
          "DKB (دویچه کردیت بانک): درخواست آنلاین، آدرس خارجی را ابتدا قبول می‌کند. با استفاده فعال رایگان است.",
          "Revolut / Wise: حساب بانکی آلمانی نیستند اما برای پرداخت روزانه و دریافت حقوق در دوران انتظار کار می‌کنند. برای اکثر کارفرماها مشکل IBAN ندارند.",
          "بانک‌های سنتی (Commerzbank، Sparkasse، Deutsche Bank): به ملدبشایینیگونگ نیاز دارند — پس از آنملدونگ درخواست دهید.",
        ],
      },
      {
        title: "Bank Comparison",
        titleFa: "مقایسه بانک‌ها",
        bullets: [
          "N26 Free: no monthly fee, Mastercard, ATM withdrawals limited. Best for beginners.",
          "DKB: free unlimited ATM worldwide, VISA card, good for travel. Requires some activity.",
          "Commerzbank: branch support in Persian sometimes available in large cities. Requires Anmeldung.",
          "Sparkasse: most offices, good for cash deposits, regional bank. Requires Anmeldung.",
          "Important: most Iranian employers and landlords require a German IBAN (DE...). N26 and DKB both provide one.",
        ],
        bulletsFa: [
          "N26 رایگان: بدون کارمزد ماهانه، مسترکارت، برداشت از خودپرداز محدود. بهترین گزینه برای مبتدیان.",
          "DKB: برداشت نامحدود رایگان از خودپرداز در سراسر جهان، کارت VISA، مناسب برای سفر. به فعالیت نیاز دارد.",
          "Commerzbank: پشتیبانی شعبه گاهی در شهرهای بزرگ به فارسی. به آنملدونگ نیاز دارد.",
          "Sparkasse: بیشترین شعبه، مناسب برای واریز نقدی، بانک منطقه‌ای. به آنملدونگ نیاز دارد.",
          "مهم: اکثر کارفرمایان و صاحبخانه‌های ایرانی به IBAN آلمانی (DE...) نیاز دارند. N26 و DKB هر دو آن را فراهم می‌کنند.",
        ],
      },
    ],
    updatedAt: "2026-05-16",
  },
  {
    id: "g-jobcenter",
    title: "Jobcenter Registration",
    titleFa: "ثبت‌نام در جابسنتر",
    category: "Work & Jobcenter",
    categoryFa: "کار و جابسنتر",
    summary: "If eligible, register for support and integration services at your Jobcenter.",
    summaryFa: "در صورت واجد شرایط بودن، در جابسنتر برای خدمات حمایتی و ادغام ثبت‌نام کنید.",
    steps: [
      "Create an online account (or visit your local Jobcenter).",
      "Prepare income and housing documents.",
      "Submit application and wait for appointment.",
      "Attend appointment with required documents.",
    ],
    stepsFa: [
      "یک حساب آنلاین ایجاد کنید (یا به جابسنتر محلی خود مراجعه کنید).",
      "مدارک درآمد و مسکن را آماده کنید.",
      "درخواست ارسال کنید و منتظر وقت ملاقات باشید.",
      "با مدارک مورد نیاز در وقت ملاقات حاضر شوید.",
    ],
    checklist: ["Passport", "Meldebescheinigung", "Rental contract + cost of housing", "Bank statements"],
    checklistFa: ["گذرنامه", "ملدبشایینیگونگ", "قرارداد اجاره + هزینه مسکن", "صورتحساب بانکی"],
    updatedAt: "2026-02-08",
  },
  {
    id: "g-language-courses",
    title: "Integration & Language Courses",
    titleFa: "دوره‌های ادغام و زبان",
    category: "Language & Integration",
    categoryFa: "زبان و ادغام",
    summary: "Find subsidized courses (Integrationskurs) and official language exams.",
    summaryFa: "دوره‌های یارانه‌ای (اینتگراتسیونسکورس) و آزمون‌های رسمی زبان را پیدا کنید.",
    steps: [
      "Check eligibility at BAMF or Jobcenter.",
      "Choose a school and register.",
      "Attend placement test if required.",
      "Track attendance and exam dates.",
    ],
    stepsFa: [
      "واجد شرایط بودن را در BAMF یا جابسنتر بررسی کنید.",
      "یک مدرسه انتخاب کنید و ثبت‌نام کنید.",
      "در صورت نیاز در آزمون سطح‌بندی شرکت کنید.",
      "حضور و تاریخ‌های آزمون را پیگیری کنید.",
    ],
    checklist: ["Passport", "Residence permit", "Jobcenter/BAMF letter"],
    checklistFa: ["گذرنامه", "مجوز اقامت", "نامه جابسنتر/BAMF"],
    updatedAt: "2026-02-08",
  },
];

export const documentGuides: DocumentGuide[] = [
  {
    id: "d-residence-permit",
    title: "Residence Permit Appointment",
    titleFa: "وقت مجوز اقامت",
    category: "Immigration",
    summary: "Prepare for your Ausländerbehörde appointment with the right documents.",
    summaryFa: "با مدارک درست برای وقت آوسلندربهورده آماده شوید.",
    steps: [
      "Book an appointment early (slots fill fast).",
      "Gather required documents and copies.",
      "Prepare biometric photos.",
      "Arrive early and bring all originals.",
    ],
    stepsFa: [
      "زودتر وقت رزرو کنید (ظرفیت سریع پر می‌شود).",
      "مدارک و کپی‌های لازم را جمع‌آوری کنید.",
      "عکس‌های بیومتریک آماده کنید.",
      "زودتر بیایید و تمام اصل مدارک را همراه داشته باشید.",
    ],
    checklist: ["Passport", "Appointment confirmation", "Biometric photos", "Meldebescheinigung", "Proof of income or funding", "Health insurance proof"],
    checklistFa: ["گذرنامه", "تأییدیه وقت", "عکس‌های بیومتریک", "ملدبشایینیگونگ", "گواهی درآمد یا تأمین مالی", "گواهی بیمه درمانی"],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-family-reunification",
    title: "Family Reunification Checklist",
    titleFa: "چک‌لیست اعزام خانواده",
    category: "Immigration",
    summary: "Documents typically required for spouse/child reunification.",
    summaryFa: "مدارک معمولاً برای اعزام همسر/فرزند لازم است.",
    steps: [
      "Check embassy requirements for your case.",
      "Collect legalized documents and translations.",
      "Prepare accommodation proof.",
      "Book consulate appointment.",
    ],
    stepsFa: [
      "الزامات سفارت را برای پرونده خود بررسی کنید.",
      "مدارک قانونی و ترجمه‌ها را جمع کنید.",
      "گواهی اسکان آماده کنید.",
      "وقت کنسولگری رزرو کنید.",
    ],
    checklist: ["Marriage certificate or birth certificates", "Certified translations", "Proof of income", "Housing contract"],
    checklistFa: ["گواهی ازدواج یا گواهی تولد", "ترجمه‌های تأیید شده", "گواهی درآمد", "قرارداد مسکن"],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-job-application",
    title: "Job Application Documents",
    titleFa: "مدارک درخواست شغلی",
    category: "Work & Jobcenter",
    summary: "A German job application pack (Bewerbungsmappe).",
    summaryFa: "یک بسته درخواست شغلی آلمانی (Bewerbungsmappe).",
    steps: [
      "Prepare a CV (Lebenslauf) with a clear layout.",
      "Write a short cover letter tailored to the job.",
      "Attach relevant certificates (education, training).",
      "Export as a single PDF when possible.",
    ],
    stepsFa: [
      "رزومه (Lebenslauf) با قالب واضح آماده کنید.",
      "یک نامه انگیزشی کوتاه متناسب با شغل بنویسید.",
      "گواهینامه‌های مربوطه (تحصیل، آموزش) ضمیمه کنید.",
      "در صورت امکان به صورت یک PDF واحد صادر کنید.",
    ],
    checklist: ["CV (1–2 pages)", "Cover letter", "Certificates and references", "Portfolio (if applicable)"],
    checklistFa: ["رزومه (۱-۲ صفحه)", "نامه انگیزشی", "مدارک و مراجع", "نمونه کار (در صورت لزوم)"],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-doctor-visit",
    title: "Doctor Appointment Prep",
    titleFa: "آماده‌سازی برای ویزیت پزشک",
    category: "Appointments",
    summary: "What to bring and how to describe symptoms.",
    summaryFa: "چه بیاورید و چگونه علائم را توضیح دهید.",
    steps: [
      "Bring health insurance card (Elektronische Gesundheitskarte).",
      "Write down symptoms and duration.",
      "Arrive 10 minutes early.",
      "Ask for a note (Krankschreibung) if needed.",
    ],
    stepsFa: [
      "کارت بیمه درمانی (الکترونیشه گزوندهایتسکارته) بیاورید.",
      "علائم و مدت آن را یادداشت کنید.",
      "۱۰ دقیقه زودتر برسید.",
      "در صورت نیاز بیمارینامه (کرانکشرایبونگ) درخواست کنید.",
    ],
    checklist: ["Insurance card", "List of symptoms", "Current medications"],
    checklistFa: ["کارت بیمه", "لیست علائم", "داروهای فعلی"],
    updatedAt: "2026-02-08",
  },
  {
    id: "d-kita",
    title: "Kita Enrollment",
    titleFa: "ثبت‌نام کیتا",
    category: "Family",
    summary: "Steps to secure a daycare spot.",
    summaryFa: "مراحل برای گرفتن جای مهدکودک.",
    steps: [
      "Get a Kita-Gutschein from your Jugendamt.",
      "Visit Kitas and apply early.",
      "Submit forms and required documents.",
      "Confirm placement and start date.",
    ],
    stepsFa: [
      "کوپن کیتا (Kita-Gutschein) از یوگنتامت خود دریافت کنید.",
      "کیتاها را بازدید کنید و زود ثبت‌نام کنید.",
      "فرم‌ها و مدارک لازم را ارائه دهید.",
      "پذیرش و تاریخ شروع را تأیید کنید.",
    ],
    checklist: ["Passports", "Child birth certificate", "Meldebescheinigung", "Kita-Gutschein"],
    checklistFa: ["گذرنامه‌ها", "گواهی تولد کودک", "ملدبشایینیگونگ", "کوپن کیتا"],
    updatedAt: "2026-02-08",
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
    answer: "Usually within 14 days of moving into a new address. Book an appointment early.",
    category: "Registration",
  },
  {
    id: "f2",
    question: "Do I need health insurance before starting work?",
    answer: "Yes. You must choose a public or private insurer. Most people start with a public insurer.",
    category: "Health",
  },
  {
    id: "f3",
    question: "What is a Schufa?",
    answer: "A credit record used for rentals and contracts. Many banks and landlords check it.",
    category: "Banking",
  },
  {
    id: "f4",
    question: "Can I open a bank account without Anmeldung?",
    answer: "Some online banks may allow it, but most require a German address and registration.",
    category: "Banking",
  },
  {
    id: "f5",
    question: "What level of German do I need for basic jobs?",
    answer: "Many entry roles accept A1–A2, but B1 helps a lot for office or customer roles.",
    category: "Work",
  },
  {
    id: "f6",
    question: "Where can I find official integration courses?",
    answer: "Look for BAMF-approved schools or ask Jobcenter/immigration office.",
    category: "Language",
  },
];

export const survivalPhrases: Phrase[] = [
  { id: "p1", german: "Ich brauche Hilfe.", persian: "من کمک نیاز دارم.", english: "I need help.", category: "Emergency" },
  { id: "p2", german: "Wo ist das Bürgeramt?", persian: "اداره ثبت آدرس کجاست؟", english: "Where is the registration office?", category: "City" },
  { id: "p3", german: "Ich habe einen Termin.", persian: "من وقت ملاقات دارم.", english: "I have an appointment.", category: "Appointments" },
  { id: "p4", german: "Ich suche eine Wohnung.", persian: "دنبال یک آپارتمان می‌گردم.", english: "I am looking for an apartment.", category: "Housing" },
  { id: "p5", german: "Können Sie das bitte wiederholen?", persian: "می‌توانید لطفاً دوباره تکرار کنید؟", english: "Can you please repeat that?", category: "Communication" },
  { id: "p6", german: "Ich spreche nur ein bisschen Deutsch.", persian: "من فقط کمی آلمانی صحبت می‌کنم.", english: "I speak only a little German.", category: "Communication" },
  { id: "p7", german: "Wie viel kostet das?", persian: "این چقدر قیمت دارد؟", english: "How much does this cost?", category: "Daily life" },
  { id: "p8", german: "Ich brauche einen Arzt.", persian: "من دکتر نیاز دارم.", english: "I need a doctor.", category: "Health" },
  { id: "p9", german: "Meine Adresse ist …", persian: "آدرس من … است.", english: "My address is …", category: "Forms" },
  { id: "p10", german: "Danke für Ihre Hilfe.", persian: "ممنون از کمک‌تان.", english: "Thank you for your help.", category: "Polite" },
];
