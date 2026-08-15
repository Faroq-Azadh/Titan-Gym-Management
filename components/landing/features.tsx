import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function LandingFeatures() {
  const featureList = [
    {
      icon: Calendar,
      title: "رزرو و زمان‌بندی کلاس‌ها",
      desc: "تقویم هوشمند برای مربیان و اعضا، با جلوگیری خودکار از تداخل و ظرفیت محدود کلاس‌ها.",
    },
    {
      icon: Users,
      title: "مدیریت اعضا و عضویت‌ها",
      desc: "پروفایل کامل هر ورزشکار، تاریخچه حضور، نوع عضویت و یادآوری تمدید خودکار.",
    },
    {
      icon: CreditCard,
      title: "پرداخت و صدور فاکتور",
      desc: "پرداخت آنلاین، اقساط، و صدور فاکتور خودکار برای هر تراکنش بدون دخالت دستی.",
    },
    {
      icon: CheckCircle,
      title: "ابزار اختصاصی مربیان",
      desc: "برنامه تمرینی، پیگیری پیشرفت ورزشکار و ارتباط مستقیم در یک اپ مربی‌محور.",
    },
    {
      icon: BarChart3,
      title: "تحلیل و گزارش‌گیری",
      desc: "داشبورد زنده درآمد، نرخ ریزش، تراکم کلاس‌ها و عملکرد هر شعبه به‌صورت جداگانه.",
    },
    {
      icon: Smartphone,
      title: "اپ موبایل برای اعضا",
      desc: "رزرو کلاس، مشاهده برنامه تمرینی و پرداخت، همه از موبایل عضو.",
    },
  ];

  return (
    <section
      id="features"
      className="border-y border-border bg-surface py-20 min-[640px]:py-[110px]"
    >
      <div className="mx-auto max-w-[1240px] px-5 min-[640px]:px-8">
        <ScrollReveal className="mx-auto mb-16 max-w-[640px] text-center">
          <span className="mb-3.5 inline-block text-[13px] font-bold tracking-wide text-primary-dark">
            امکانات اصلی
          </span>
          <h2 className="mb-4 text-[28px] font-extrabold leading-[1.3] text-ink min-[640px]:text-[36px] min-[981px]:text-[42px]">
            هر ابزاری که برای اداره باشگاه لازم دارید
          </h2>
          <p className="text-[16px] leading-[1.8] text-ink-soft">
            از لحظه ثبت‌نام عضو جدید تا تحلیل عملکرد ماهانه، همه در یک پلتفرم.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 min-[981px]:grid-cols-3">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={idx} delay={(idx % 3) * 0.1}>
                <div className="group rounded-[16px] border border-border bg-surface p-7 transition-all duration-250 hover:-translate-y-1 hover:border-[#D8F5E8] hover:shadow-md">
                  <div className="mb-5 flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-tint">
                    <Icon className="h-[22px] w-[22px] stroke-primary-dark" />
                  </div>
                  <h3 className="mb-[10px] text-[17px] font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.75] text-ink-soft">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
