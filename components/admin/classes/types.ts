export type DayOfWeek =
  | "شنبه"
  | "یکشنبه"
  | "دوشنبه"
  | "سه‌شنبه"
  | "چهارشنبه"
  | "پنجشنبه"
  | "جمعه";

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
  coachId?: string | null;
  day: DayOfWeek;
  time: TimeSlot;
  endTime?: string;
  durationMinutes?: number;
  enrolled: number;
  capacity: number;
  isActive?: boolean;
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
    members: [],
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
    enrolled: 0,
    capacity: 15,
    theme: "cyan",
    room: "استودیو ذهن و آرامش",
    level: "مبتدی",
    description: "تمرینات آسانا، افزایش انعطاف‌پذیری و تمرکز تنفس در فضایی آرام‌بخش.",
    members: [],
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
    enrolled: 0,
    capacity: 16,
    theme: "amber",
    room: "سالن اختصاصی کراس‌فیت",
    level: "پیشرفته",
    description: "تمرینات با شدت بسیار بالا (HIIT)، ژیمناستیک قدرتی و پاورلیفتینگ ترکیبی.",
    members: [],
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
    enrolled: 0,
    capacity: 18,
    theme: "cyan",
    room: "استودیو فیتنس و چربی‌سوزی",
    level: "متوسط",
    description: "چربی‌سوزی با ریتم و موزیک همراه با وزنه سبک و کش مقاومتی.",
    members: [],
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
