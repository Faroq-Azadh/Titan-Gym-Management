export interface PlanItem {
  id: string;
  name: string;
  hint: string;
  price: string;
  priceRaw?: number;
  priceUnit: string;
  duration: string;
  features: string[];
  activeMembers: number;
  status: "active" | "inactive";
  featured?: boolean;
  ribbonText?: string;
  description?: string;
}

export const INITIAL_PLANS: PlanItem[] = [
  {
    id: "plan-monthly",
    name: "ماهانه",
    hint: "دسترسی پایه",
    price: "۹۸۰",
    priceRaw: 980000,
    priceUnit: "هزار تومان / ماه",
    duration: "۱ ماه",
    features: [
      "دسترسی به سالن بدنسازی",
      "۲ کلاس گروهی در هفته",
      "کمد اختصاصی",
    ],
    activeMembers: 438,
    status: "active",
    featured: false,
    description: "مناسب برای ورزشکارانی که به دنبال شروع تمرین و دسترسی استاندارد به سالن بدنسازی هستند.",
  },
  {
    id: "plan-3months",
    name: "۳ ماهه",
    hint: "پرطرفدارترین",
    price: "۲٬۵۰۰",
    priceRaw: 2500000,
    priceUnit: "هزار تومان / ۳ ماه",
    duration: "۳ ماه",
    features: [
      "تمام مزایای ماهانه",
      "کلاس‌های نامحدود",
      "۱ جلسه مشاوره‌ی تغذیه",
    ],
    activeMembers: 521,
    status: "active",
    featured: true,
    ribbonText: "محبوب",
    description: "بهترین انتخاب برای استمرار در تمرین با تخفیف دوره‌ای و کلاس‌های نامحدود باشگاه.",
  },
  {
    id: "plan-6months",
    name: "۶ ماهه",
    hint: "صرفه‌جویی بالا",
    price: "۴٬۶۰۰",
    priceRaw: 4600000,
    priceUnit: "هزار تومان / ۶ ماه",
    duration: "۶ ماه",
    features: [
      "تمام مزایای ۳ ماهه",
      "۲ جلسه مشاوره‌ی تغذیه",
      "امکان فریز اشتراک تا ۳۰ روز",
    ],
    activeMembers: 198,
    status: "active",
    featured: false,
    description: "طراحی شده برای اهداف میان‌مدت با امکان فریز عضویت در روزهای سفر یا استراحت.",
  },
  {
    id: "plan-vip",
    name: "VIP سالانه",
    hint: "کامل‌ترین پلن",
    price: "۸٬۹۰۰",
    priceRaw: 8900000,
    priceUnit: "هزار تومان / سال",
    duration: "۱۲ ماه",
    features: [
      "تمام مزایای ۳ ماهه",
      "مربی اختصاصی",
      "برنامه‌ی تمرین و تغذیه",
    ],
    activeMembers: 289,
    status: "active",
    featured: false,
    description: "پکیج کامل VIP با مربی خصوصی، ارزیابی ترکیب بدنی و برنامه‌ریزی جامع تغذیه و تمرین.",
  },
  {
    id: "plan-student",
    name: "دانشجویی",
    hint: "تخفیف ویژه",
    price: "۷۵۰",
    priceRaw: 750000,
    priceUnit: "هزار تومان / ماه",
    duration: "۱ ماه",
    features: [
      "دسترسی در ساعات خلوت (۱۰ تا ۱۶)",
      "استفاده از تمام دستگاه‌ها",
      "کمد موقت روزانه",
    ],
    activeMembers: 0,
    status: "inactive",
    featured: false,
    description: "تعرفه حمایتی ویژه دانشجویان و محصلان با ارائه کارت دانشجویی معتبر.",
  },
];
