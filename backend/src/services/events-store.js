const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

const dataDir = path.join(__dirname, '../../../admin/dist/admin-data');
const eventsPath = path.join(dataDir, 'events.json');

const defaultEvents = [
  {
    id: 'ev1', enabled: true, country: 'DE', state: null, city: null,
    category: 'Tax', categoryFa: 'مالیات',
    title: 'Income Tax Filing Deadline',
    titleFa: 'آخرین مهلت ثبت اظهارنامه مالیاتی',
    description: 'Annual Steuererklärung deadline for employed persons. Use ELSTER online or a Lohnsteuerhilfe club.',
    descriptionFa: 'آخرین مهلت ثبت اظهارنامه مالیاتی سالانه برای کارمندان. از پورتال ELSTER یا باشگاه‌های کمک مالیاتی استفاده کنید.',
    date: '2026-07-31', endDate: null, time: null,
    venue: null, price: 'Free', link: 'https://www.elster.de', source: 'Finanzamt',
  },
  {
    id: 'ev2', enabled: true, country: 'DE', state: null, city: null,
    category: 'Integration', categoryFa: 'یکپارچگی',
    title: 'BAMF Integration Course — New Intake',
    titleFa: 'پذیرش جدید دوره یکپارچگی BAMF',
    description: 'New intake for government-subsidized German language and orientation courses (1,000 hours). Register at your local BAMF-certified provider.',
    descriptionFa: 'پذیرش جدید برای دوره‌های زبان آلمانی و آشنایی با جامعه با یارانه دولتی (۱۰۰۰ ساعت). در ارائه‌دهنده مجاز BAMF محلی خود ثبت‌نام کنید.',
    date: '2026-03-01', endDate: '2026-03-31', time: null,
    venue: null, price: 'Subsidized', link: 'https://www.bamf.de/integrationskurse', source: 'BAMF',
  },
  {
    id: 'ev3', enabled: true, country: 'DE', state: null, city: 'Berlin',
    category: 'Community', categoryFa: 'جامعه',
    title: 'Newcomer Orientation Q&A — Berlin',
    titleFa: 'جلسه پرسش و پاسخ تازه‌واردان — برلین',
    description: 'Ask questions about Anmeldung, insurance, banking, and daily life. Persian-speaking support available.',
    descriptionFa: 'سؤالات خود را درباره آنملدونگ، بیمه، بانک و زندگی روزمره بپرسید. پشتیبانی فارسی‌زبان موجود است.',
    date: '2026-03-15', endDate: null, time: '16:00',
    venue: 'Altona Library Hall', price: 'Free', link: null, source: 'Community',
  },
  {
    id: 'ev4', enabled: true, country: 'DE', state: null, city: null,
    category: 'Language', categoryFa: 'زبان',
    title: 'TestDaF / Goethe-Zertifikat Exam Registration',
    titleFa: 'ثبت‌نام آزمون TestDaF / گوته‌زرتیفیکات',
    description: 'Registration window for German language certification exams (B1, B2, C1). Required for university admission and many visas.',
    descriptionFa: 'دوره ثبت‌نام آزمون‌های گواهینامه زبان آلمانی (B1، B2، C1). لازم برای پذیرش دانشگاه و بسیاری از ویزاها.',
    date: '2026-04-01', endDate: '2026-04-30', time: null,
    venue: null, price: 'Paid', link: 'https://www.goethe.de', source: 'Goethe-Institut',
  },
  {
    id: 'ev5', enabled: true, country: 'DE', state: 'Bayern', city: 'Munich',
    category: 'Employment', categoryFa: 'اشتغال',
    title: 'Job Fair for International Professionals — Munich',
    titleFa: 'نمایشگاه شغلی برای متخصصان بین‌المللی — مونیخ',
    description: 'Annual job fair for skilled international workers. Companies looking for engineers, IT specialists, and healthcare workers.',
    descriptionFa: 'نمایشگاه شغلی سالانه برای کارمندان متخصص بین‌المللی. شرکت‌ها به دنبال مهندسان، متخصصان IT و کارمندان بهداشت هستند.',
    date: '2026-05-14', endDate: null, time: '09:00',
    venue: 'MOC Veranstaltungscenter München', price: 'Free', link: 'https://www.make-it-in-germany.com', source: 'Make it in Germany',
  },
  {
    id: 'ev6', enabled: true, country: 'DE', state: null, city: 'Hamburg',
    category: 'Integration', categoryFa: 'یکپارچگی',
    title: 'Welcome Center Hamburg — Open Day',
    titleFa: 'روز باز مرکز پذیرایی هامبورگ',
    description: 'Free advice on work permits, residence permits, and settling in Hamburg. No appointment needed.',
    descriptionFa: 'مشاوره رایگان درباره مجوز کار، اجازه اقامت و استقرار در هامبورگ. بدون نیاز به وقت قبلی.',
    date: '2026-04-10', endDate: null, time: '10:00',
    venue: 'Hamburg Welcome Center, Gänsemarkt', price: 'Free', link: 'https://www.hamburg.de/welcome-center', source: 'Hamburg Welcome Center',
  },
  {
    id: 'ev7', enabled: true, country: 'DE', state: null, city: null,
    category: 'Legal', categoryFa: 'حقوقی',
    title: 'Free Immigration Legal Advice — Pro Asyl',
    titleFa: 'مشاوره حقوقی رایگان مهاجرت — پرو آزیل',
    description: 'Monthly free legal advice sessions on residence permits, asylum, and family reunification. Online and in-person options.',
    descriptionFa: 'جلسات مشاوره حقوقی رایگان ماهانه درباره اجازه اقامت، پناهندگی و اتحاد مجدد خانواده. گزینه‌های آنلاین و حضوری.',
    date: '2026-03-20', endDate: null, time: '14:00',
    venue: 'Online + Frankfurt office', price: 'Free', link: 'https://www.proasyl.de', source: 'Pro Asyl',
  },
  {
    id: 'ev8', enabled: true, country: 'DE', state: null, city: 'Berlin',
    category: 'Community', categoryFa: 'جامعه',
    title: 'Nowruz Celebration — Iranian Community Berlin',
    titleFa: 'جشن نوروز — جامعه ایرانیان برلین',
    description: 'Annual Nowruz celebration with Persian music, food, and cultural activities. Open to all.',
    descriptionFa: 'جشن سالانه نوروز با موسیقی، غذا و فعالیت‌های فرهنگی ایرانی. برای همه آزاد است.',
    date: '2026-03-21', endDate: null, time: '17:00',
    venue: 'Kulturzentrum Berlin Mitte', price: '€10', link: null, source: 'Community',
  },
  {
    id: 'ev9', enabled: true, country: 'DE', state: null, city: null,
    category: 'Integration', categoryFa: 'یکپارچگی',
    title: 'VHS Spring Semester Registration',
    titleFa: 'ثبت‌نام ترم بهاره VHS',
    description: 'Volkshochschule spring semester registrations open. German courses from A1 to C1, integration courses, and vocational training.',
    descriptionFa: 'ثبت‌نام ترم بهاره مدرسه عمومی آغاز می‌شود. دوره‌های آلمانی از A1 تا C1، دوره‌های یکپارچگی و آموزش حرفه‌ای.',
    date: '2026-02-01', endDate: '2026-02-28', time: null,
    venue: null, price: 'Subsidized', link: 'https://www.vhs.de', source: 'VHS',
  },
];

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(eventsPath);
  } catch {
    await fs.writeFile(eventsPath, JSON.stringify(defaultEvents, null, 2));
  }
}

async function getEvents({ country, state, city, category, enabledOnly = false } = {}) {
  await ensureStore();
  try {
    const raw = await fs.readFile(eventsPath, 'utf8');
    let events = JSON.parse(raw);
    if (enabledOnly) events = events.filter(e => e.enabled);
    if (country) events = events.filter(e => e.country === country);
    if (state) events = events.filter(e => !e.state || e.state === state);
    if (city) events = events.filter(e => !e.city || e.city === city);
    if (category) events = events.filter(e => e.category === category);
    return events.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return defaultEvents;
  }
}

async function saveAllEvents(events) {
  await ensureStore();
  await fs.writeFile(eventsPath, JSON.stringify(events, null, 2));
}

async function addEvent(event) {
  const events = await getEvents();
  const newEvent = { ...event, id: randomUUID(), enabled: event.enabled ?? true };
  await saveAllEvents([...events, newEvent]);
  return newEvent;
}

async function updateEvent(id, updates) {
  const events = await getEvents();
  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) throw new Error(`Event ${id} not found`);
  events[idx] = { ...events[idx], ...updates, id };
  await saveAllEvents(events);
  return events[idx];
}

async function deleteEvent(id) {
  const events = await getEvents();
  await saveAllEvents(events.filter(e => e.id !== id));
}

module.exports = { getEvents, addEvent, updateEvent, deleteEvent, saveAllEvents };
