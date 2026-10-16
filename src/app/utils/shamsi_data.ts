import moment from 'moment-jalaali';

// اعداد فارسی در نمایش (۱۴۰۴ به جای 1404)
moment.loadPersian({ usePersianDigits: true });

// نمایش: ISO میلادی → رشته شمسی فارسی
export function toShamsiDisplay(iso: string): string {
  return moment(iso).format('jYYYY/jMM/jDD');
}

// پر کردن selectها: ISO میلادی → اجزای عددی شمسی
export function gregorianToShamsi(iso: string): { jy: number; jm: number; jd: number } {
  const m = moment(iso);
  return { jy: m.jYear(), jm: m.jMonth() + 1, jd: m.jDate() };
}

// ارسال به سرور: اجزای شمسی → اجزای میلادی
export function shamsiToGregorian(
  jy: number,
  jm: number,
  jd: number
): { gy: number; gm: number; gd: number } {
  const pad = (n: number) => String(n).padStart(2, '0');
  const m = moment(`${jy}/${pad(jm)}/${pad(jd)}`, 'jYYYY/jMM/jDD', true);
  if (!m.isValid()) {
    console.warn('تاریخ شمسی نامعتبر:', jy, jm, jd);
    return { gy: 2025, gm: 1, gd: 1 };
  }
  return { gy: m.year(), gm: m.month() + 1, gd: m.date() };
}

/////


// امروز شمسی به صورت رشته (برای پیش‌فرض فرم ثبت)
export function todayShamsiString(): string {
  const j = gregorianToShamsi(new Date().toISOString());
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`;
}

// رشته شمسی مثل "1404-07-16" → اجزای میلادی
export function shamsiStringToGregorian(jalali: string): { gy: number; gm: number; gd: number } {
  const [jy, jm, jd] = jalali.split('/').map(Number);
  return shamsiToGregorian(jy, jm, jd);
}

export function todayGregorianString(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}