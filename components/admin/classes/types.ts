export type DayOfWeek =
  | "شنبه"
  | "یکشنبه"
  | "دوشنبه"
  | "سه‌شنبه"
  | "چهارشنبه"
  | "پنجشنبه";

export type TimeSlot = "۰۸:۰۰" | "۱۰:۰۰" | "۱۷:۰۰" | "۱۹:۳۰" | string;

export type ClassTheme = "emerald" | "cyan" | "amber";

export interface ClassMember {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  joinedDate: string;
  status: "active" | "waiting";
}

export interface ClassSession {
  id: string;
  name: string;
  category: "بدنسازی" | "یوگا" | "فیتنس" | "کراس‌فیت" | "TRX" | "پیلاتس" | string;
  coach: string;
  coachShort: string;
  day: DayOfWeek;
  time: TimeSlot;
  endTime?: string;
  enrolled: number;
  capacity: number;
  theme: ClassTheme;
  room: string;
  level: "مبتدی" | "متوسط" | "پیشرفته" | "همه سطوح";
  description?: string;
  members?: ClassMember[];
}

export const INITIAL_CLASSES: ClassSession[] = [
  {
    id: "cls-1",
    name: "بدنسازی",
    category: "بدنسازی",
    coach: "آرش رضایی",
    coachShort: "آرش",
    day: "شنبه",
    time: "۰۸:۰۰",
    endTime: "۰۹:۳۰",
    enrolled: 18,
    capacity: 20,
    theme: "emerald",
    room: "سالن اصلی بدنسازی",
    level: "همه سطوح",
    description: "تمرینات قدرتی و هایپرتروفی برای عضلات بالاتنه و پایین‌تنه با دستگاه‌های پیشرفته.",
    members: [
      { id: "m1", name: "محمد محمدی", avatar: "م‌م", phone: "۰۹۱۲۳۴۵۶۷۸۹", joinedDate: "۱۴۰۳/۰۶/۰۱", status: "active" },
      { id: "m2", name: "علی احمدی", avatar: "ع‌ا", phone: "۰۹۱۹۸۷۶۵۴۳۲", joinedDate: "۱۴۰۳/۰۶/۰۵", status: "active" },
      { id: "m3", name: "رضا قاسمی", avatar: "ر‌ق", phone: "۰۹۳۵۱۱۱۴۴۵۵", joinedDate: "۱۴۰۳/۰۶/۱۰", status: "active" },
    ],
  },
  {
    id: "cls-2",
    name: "یوگا",
    category: "یوگا",
    coach: "سپیده کاظمی",
    coachShort: "سپیده",
    day: "شنبه",
    time: "۱۰:۰۰",
    endTime: "۱۱:۳۰",
    enrolled: 12,
    capacity: 15,
    theme: "cyan",
    room: "استودیو ذهن و آرامش",
    level: "مبتدی",
    description: "تمرینات آسانا، افزایش انعطاف‌پذیری و تمرکز تنفس در فضایی آرام‌بخش.",
    members: [
      { id: "m4", name: "مریم حسینی", avatar: "م‌ح", phone: "۰۹۱۸۲۳۴۵۶۷۸", joinedDate: "۱۴۰۳/۰۵/۲۰", status: "active" },
      { id: "m5", name: "سارا نیکنام", avatar: "س‌ن", phone: "۰۹۳۳۵۵۵۶۶۷۷", joinedDate: "۱۴۰۳/۰۶/۰۲", status: "active" },
    ],
  },
  {
    id: "cls-3",
    name: "کراس‌فیت",
    category: "کراس‌فیت",
    coach: "بهنام سعیدی",
    coachShort: "بهنام",
    day: "شنبه",
    time: "۱۷:۰۰",
    endTime: "۱۸:۳۰",
    enrolled: 16,
    capacity: 16,
    theme: "amber",
    room: "سالن اختصاصی کراس‌فیت",
    level: "پیشرفته",
    description: "تمرینات با شدت بسیار بالا (HIIT)، ژیمناستیک قدرتی و پاورلیفتینگ ترکیبی.",
    members: [
      { id: "m6", name: "حسین رضوانی", avatar: "ح‌ر", phone: "۰۹۱۲۹۹۹۸۸۷۷", joinedDate: "۱۴۰۳/۰۵/۱۵", status: "active" },
      { id: "m7", name: "مهرداد نادری", avatar: "م‌ن", phone: "۰۹۳۶۷۷۷۸۸۹۹", joinedDate: "۱۴۰۳/۰۶/۰۸", status: "active" },
    ],
  },
  {
    id: "cls-4",
    name: "فیتنس",
    category: "فیتنس",
    coach: "نگار اسدی",
    coachShort: "نگار",
    day: "یکشنبه",
    time: "۱۰:۰۰",
    endTime: "۱۱:۳۰",
    enrolled: 10,
    capacity: 18,
    theme: "cyan",
    room: "استودیو فیتنس و چربی‌سوزی",
    level: "متوسط",
    description: "چربی‌سوزی با ریتم و موزیک همراه با وزنه سبک و کش مقاومتی.",
    members: [
      { id: "m8", name: "زهرا موسوی", avatar: "ز‌م", phone: "۰۹۱۹۴۴۴۳۳۲۲", joinedDate: "۱۴۰۳/۰۶/۰۴", status: "active" },
    ],
  },
  {
    id: "cls-5",
    name: "بدنسازی",
    category: "بدنسازی",
    coach: "آرش رضایی",
    coachShort: "آرش",
    day: "یکشنبه",
    time: "۱۹:۳۰",
    endTime: "۲۱:۰۰",
    enrolled: 19,
    capacity: 20,
    theme: "emerald",
    room: "سالن اصلی بدنسازی",
    level: "پیشرفته",
    description: "تمرین تخصصی حجم‌دهی و تکنیک‌های پیشرفته بدنسازی سنگین.",
    members: [],
  },
  {
    id: "cls-6",
    name: "بدنسازی",
    category: "بدنسازی",
    coach: "آرش رضایی",
    coachShort: "آرش",
    day: "دوشنبه",
    time: "۰۸:۰۰",
    endTime: "۰۹:۳۰",
    enrolled: 15,
    capacity: 20,
    theme: "emerald",
    room: "سالن اصلی بدنسازی",
    level: "همه سطوح",
    description: "تمرین صبحگاهی بالاتنه و سرشانه با سیستم سوپرست.",
    members: [],
  },
  {
    id: "cls-7",
    name: "کراس‌فیت",
    category: "کراس‌فیت",
    coach: "بهنام سعیدی",
    coachShort: "بهنام",
    day: "دوشنبه",
    time: "۱۷:۰۰",
    endTime: "۱۸:۳۰",
    enrolled: 13,
    capacity: 16,
    theme: "amber",
    room: "سالن اختصاصی کراس‌فیت",
    level: "پیشرفته",
    description: "تکنیک‌های وزنه‌برداری سرعتی و تمرینات استقامتی تایمردار.",
    members: [],
  },
  {
    id: "cls-8",
    name: "یوگا",
    category: "یوگا",
    coach: "سپیده کاظمی",
    coachShort: "سپیده",
    day: "سه‌شنبه",
    time: "۱۰:۰۰",
    endTime: "۱۱:۳۰",
    enrolled: 9,
    capacity: 15,
    theme: "cyan",
    room: "استودیو ذهن و آرامش",
    level: "همه سطوح",
    description: "وینیاسا فلو و هماهنگی تنفس و تعادل مفاصل.",
    members: [],
  },
  {
    id: "cls-9",
    name: "بدنسازی",
    category: "بدنسازی",
    coach: "آرش رضایی",
    coachShort: "آرش",
    day: "سه‌شنبه",
    time: "۱۹:۳۰",
    endTime: "۲۱:۰۰",
    enrolled: 20,
    capacity: 20,
    theme: "emerald",
    room: "سالن اصلی بدنسازی",
    level: "پیشرفته",
    description: "تمرین ویژه پا و عضلات همسترینگ با اسکوات و پرس سنگین.",
    members: [],
  },
  {
    id: "cls-10",
    name: "بدنسازی",
    category: "بدنسازی",
    coach: "آرش رضایی",
    coachShort: "آرش",
    day: "چهارشنبه",
    time: "۰۸:۰۰",
    endTime: "۰۹:۳۰",
    enrolled: 20,
    capacity: 20,
    theme: "emerald",
    room: "سالن اصلی بدنسازی",
    level: "همه سطوح",
    description: "تمرین فول‌بادی و آماده‌سازی قدرتی هفتگی.",
    members: [],
  },
  {
    id: "cls-11",
    name: "TRX",
    category: "TRX",
    coach: "کاوه مرادی",
    coachShort: "کاوه",
    day: "چهارشنبه",
    time: "۱۷:۰۰",
    endTime: "۱۸:۳۰",
    enrolled: 8,
    capacity: 12,
    theme: "amber",
    room: "استودیو بند معلق TRX",
    level: "متوسط",
    description: "تمرینات تعلیقی با بند TRX جهت تقویت عضلات عمقی شکم و میان‌تنه (Core).",
    members: [],
  },
  {
    id: "cls-12",
    name: "فیتنس",
    category: "فیتنس",
    coach: "نگار اسدی",
    coachShort: "نگار",
    day: "پنجشنبه",
    time: "۱۰:۰۰",
    endTime: "۱۱:۳۰",
    enrolled: 14,
    capacity: 18,
    theme: "cyan",
    room: "استودیو فیتنس و چربی‌سوزی",
    level: "همه سطوح",
    description: "تمرینات شاد و ریتمیک هوازی پایانی هفته.",
    members: [],
  },
  {
    id: "cls-13",
    name: "فیتنس",
    category: "فیتنس",
    coach: "نگار اسدی",
    coachShort: "نگار",
    day: "پنجشنبه",
    time: "۱۹:۳۰",
    endTime: "۲۱:۰۰",
    enrolled: 11,
    capacity: 18,
    theme: "cyan",
    room: "استودیو فیتنس و چربی‌سوزی",
    level: "متوسط",
    description: "تمرینات مقاومتی سبک با کش و دمبل همراه با ریکاوری کششی.",
    members: [],
  },
];
