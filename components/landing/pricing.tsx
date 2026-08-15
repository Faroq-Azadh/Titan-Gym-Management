import Link from "next/link";
import { Check } from "lucide-react";

export function LandingPricing() {
  const plans = [
    {
      name: "رایگان",
      price: "۰",
      period: "تومان / ۴۵ روز",
      desc: "برای باشگاه‌های کوچک که می‌خواهند تیتان را بدون هزینه امتحان کنند",
      btnText: "شروع رایگان",
      btnClass:
        "border-[1.5px] border-border bg-surface text-ink hover:border-primary hover:bg-tint",
      cardClass: "bg-tint border-[#C6F1E1]",
      featured: false,
      isFree: true,
      features: [
        "تا ۵۰ عضو",
        "تا ۳ مربی",
        "مدیریت اعضا و رزرو کلاس",
        "بدون نیاز به کارت بانکی",
      ],
    },
    {
      name: "پایه",
      price: "۱.۲",
      period: "میلیون تومان / ماه",
      desc: "برای باشگاه‌های تک‌شعبه‌ای با تا ۲۰۰ عضو",
      btnText: "انتخاب پلن پایه",
      btnClass:
        "border-[1.5px] border-border bg-surface text-ink hover:border-primary hover:bg-tint",
      cardClass: "bg-surface border-border",
      featured: false,
      isFree: false,
      features: [
        "مدیریت اعضا و عضویت",
        "رزرو کلاس آنلاین",
        "پرداخت آنلاین پایه",
        "پشتیبانی ایمیلی",
      ],
    },
    {
      name: "حرفه‌ای",
      price: "۲.۹",
      period: "میلیون تومان / ماه",
      desc: "برای باشگاه‌های چندشعبه‌ای تا ۱۰۰۰ عضو",
      btnText: "انتخاب پلن حرفه‌ای",
      btnClass: "bg-ink text-white hover:bg-primary-dark hover:shadow-emerald",
      cardClass: "bg-surface border-primary shadow-emerald relative min-[981px]:-translate-y-3",
      featured: true,
      isFree: false,
      features: [
        "همه امکانات پلن پایه",
        "داشبورد تحلیلی پیشرفته",
        "مدیریت چند شعبه",
        "اپ اختصاصی مربیان",
        "پشتیبانی اولویت‌دار",
      ],
    },
    {
      name: "سازمانی",
      price: "سفارشی",
      period: "",
      desc: "برای زنجیره‌های باشگاه با نیازهای خاص",
      btnText: "تماس با فروش",
      btnClass:
        "border-[1.5px] border-border bg-surface text-ink hover:border-primary hover:bg-tint",
      cardClass: "bg-surface border-border",
      featured: false,
      isFree: false,
      features: [
        "همه امکانات پلن حرفه‌ای",
        "یکپارچه‌سازی اختصاصی",
        "مدیر حساب اختصاصی",
        "قرارداد سطح خدمات",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="border-y border-border bg-surface py-20 min-[640px]:py-[110px]"
    >
      <div className="mx-auto max-w-[1240px] px-5 min-[640px]:px-8">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <span className="mb-3.5 inline-block text-[13px] font-bold tracking-wide text-primary-dark">
            تعرفه‌ها
          </span>
          <h2 className="mb-4 text-[28px] font-extrabold leading-[1.3] text-ink min-[640px]:text-[36px] min-[981px]:text-[42px]">
            تعرفه‌ای متناسب با اندازه باشگاه‌تان
          </h2>
          <p className="text-[16px] leading-[1.8] text-ink-soft">
            با پلن رایگان شروع کنید و هر زمان خواستید ارتقا دهید. بدون قرارداد
            بلندمدت.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 min-[981px]:grid-cols-4">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-[20px] border-[1.5px] p-6 transition-all duration-200 min-[640px]:p-8 ${p.cardClass}`}
            >
              {p.featured && (
                <span className="absolute -top-3.5 right-7 rounded-full bg-ink px-3.5 py-1 text-[12px] font-bold text-white">
                  محبوب‌ترین
                </span>
              )}
              <div className="mb-3 text-[15px] font-bold text-ink-soft">
                {p.name}
              </div>
              <div className="mb-1.5 flex items-baseline gap-1.5">
                <span
                  className={`font-black text-ink ${
                    p.isFree ? "text-[34px]" : "text-[34px]"
                  }`}
                >
                  {p.price}
                </span>
                {p.period && (
                  <span className="text-[14px] text-ink-faint">{p.period}</span>
                )}
              </div>

              <div className="mb-6 min-h-[44px] text-[13px] leading-[1.75] text-ink-faint">
                {p.desc}
              </div>

              <Link
                href="/register-gym"
                className={`mb-6 flex w-full items-center justify-center gap-2 rounded-[12px] py-3 text-[15px] font-bold transition-all ${p.btnClass}`}
              >
                {p.btnText}
              </Link>

              <ul className="flex flex-col gap-3">
                {p.features.map((feat, fIdx) => (
                  <li
                    key={fIdx}
                    className="flex items-start gap-2.5 text-[13.5px] font-medium leading-[1.7] text-ink-soft"
                  >
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 stroke-primary-dark stroke-[3]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
