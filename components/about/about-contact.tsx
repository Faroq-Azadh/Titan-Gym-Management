import Link from "next/link";
import { Mail, Building2, UserPlus } from "lucide-react";

export function AboutContact() {
  const contacts = [
    {
      icon: Mail,
      title: "پشتیبانی",
      desc: "برای سؤال‌های فنی و کمک در استفاده از پنل، تیم پشتیبانی در روزهای کاری پاسخگوی شماست.",
      linkText: "ارسال پیام به پشتیبانی",
      href: "#",
    },
    {
      icon: Building2,
      title: "باشگاه‌های بزرگ",
      desc: "زنجیره‌ی باشگاه هستید یا نیاز خاصی دارید؟ درباره‌ی پلن سازمانی و یکپارچه‌سازی اختصاصی صحبت کنیم.",
      linkText: "مشاهده‌ی پلن سازمانی",
      href: "/#pricing",
    },
    {
      icon: UserPlus,
      title: "همکاری با ما",
      desc: "اگر دوست دارید روی محصولی کار کنید که هر روز دست هزاران باشگاه‌دار و ورزشکار است، خوشحال می‌شویم رزومه‌تان را ببینیم.",
      linkText: "فرصت‌های شغلی",
      href: "#",
    },
  ];

  return (
    <section className="py-20 min-[640px]:py-[110px]">
      <div className="mx-auto max-w-[1240px] px-5 min-[640px]:px-8">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <span className="mb-3.5 inline-block text-[13px] font-bold tracking-wide text-primary-dark">
            ارتباط با ما
          </span>
          <h2 className="text-[28px] font-extrabold leading-[1.3] text-ink min-[640px]:text-[36px] min-[981px]:text-[42px]">
            سؤالی دارید؟ خوشحال می‌شویم بشنویم
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 min-[981px]:grid-cols-3 min-[981px]:gap-[22px]">
          {contacts.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="rounded-[20px] border-[1.5px] border-border bg-surface p-[30px_26px] transition-all duration-200 hover:border-primary"
              >
                <div className="mb-4 flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
                  <Icon className="h-5 w-5 stroke-[2]" />
                </div>
                <h3 className="mb-2 text-[15.5px] font-extrabold text-ink">
                  {c.title}
                </h3>
                <p className="mb-3 text-[13.5px] leading-[1.85] text-ink-soft">
                  {c.desc}
                </p>
                <Link
                  href={c.href}
                  className="text-[13.5px] font-bold text-primary-dark hover:underline"
                >
                  {c.linkText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
