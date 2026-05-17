// Jalali (Shamsi) calendar utilities
// Algorithm based on jalaali-js (MIT)

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

// Persian week starts Saturday: ش ی د س چ پ ج
export const JALALI_WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(n: number): string {
  return n.toString().split("").map((d) => PERSIAN_DIGITS[parseInt(d, 10)] ?? d).join("");
}

// Gregorian day number from 1600-01-01
function g2d(gy: number, gm: number, gd: number): number {
  const y = gy - 1600, m = gm - 1, d = gd - 1;
  let dn = 365 * y + Math.floor((y + 3) / 4) - Math.floor((y + 99) / 100) + Math.floor((y + 399) / 400);
  const gml = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (let i = 0; i < m; i++) dn += gml[i];
  if (m >= 2 && y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) dn++;
  return dn + d;
}

function d2g(dn: number): [number, number, number] {
  let gy = 400 * Math.floor(dn / 146097);
  dn %= 146097;
  let leap = true;
  if (dn >= 36525) {
    dn--;
    gy += 100 * Math.floor(dn / 36524);
    dn %= 36524;
    if (dn >= 365) dn++;
    else leap = false;
  }
  gy += 4 * Math.floor(dn / 1461);
  dn %= 1461;
  if (dn >= 366) {
    leap = false;
    dn--;
    gy += Math.floor(dn / 365);
    dn %= 365;
  }
  const gml = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (!leap) gml[1] = 28;
  let gm = 0;
  while (dn >= gml[gm]) { dn -= gml[gm]; gm++; }
  return [gy + 1600, gm + 1, dn + 1];
}

function j2d(jy: number, jm: number, jd: number): number {
  const y = jy - 979, m = jm - 1, d = jd - 1;
  let dn = 365 * y + Math.floor(y / 33) * 8 + Math.floor((y % 33 + 3) / 4);
  const jml = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  for (let i = 0; i < m; i++) dn += jml[i];
  return dn + d + 79;
}

function d2j(dn: number): [number, number, number] {
  let jdn = dn - 79;
  const np = Math.floor(jdn / 12053);
  jdn %= 12053;
  let jy = 979 + 33 * np + 4 * Math.floor(jdn / 1461);
  jdn %= 1461;
  if (jdn >= 366) {
    jy += Math.floor((jdn - 1) / 365);
    jdn = (jdn - 1) % 365;
  }
  const jml = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30];
  let jm = 0;
  while (jm < 11 && jdn >= jml[jm]) { jdn -= jml[jm]; jm++; }
  return [jy, jm + 1, jdn + 1];
}

export function toJalali(gy: number, gm: number, gd: number): [number, number, number] {
  return d2j(g2d(gy, gm, gd));
}

export function fromJalali(jy: number, jm: number, jd: number): [number, number, number] {
  return d2g(j2d(jy, jm, jd));
}

export function jalaliDaysInMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // Esfand: 29, or 30 in leap year
  // A year is leap if (jy % 4 === 1 and specific cycle) — use day count diff
  const [, , d1] = d2g(j2d(jy, 12, 1));
  const [, , d2] = d2g(j2d(jy, 12, 29));
  void d1; void d2;
  // Simple: compare day number of jy/12/29 vs jy+1/1/1
  const n29 = j2d(jy, 12, 29);
  const n30 = j2d(jy, 12, 30);
  // if 30th is valid (next year starts after it), return 30
  const [ny] = d2j(n30 + 1);
  return ny === jy + 1 ? 30 : 29;
}

// JS getDay() → Persian weekday index (0=Sat, 1=Sun, ..., 6=Fri)
export function jsWeekdayToPersian(jsDay: number): number {
  return (jsDay + 1) % 7;
}

export function todayJalali(): [number, number, number] {
  const now = new Date();
  return toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}
