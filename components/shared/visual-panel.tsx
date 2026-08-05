import { Logo } from "@/components/ui/logo";
import { StatsCard } from "@/components/shared/stats-card";
import {
  TrustRow,
  loginTrustItems,
  registerTrustItems,
} from "@/components/shared/trust-row";

interface Step {
  num: string;
  title: string;
  description: string;
}

const registerSteps: Step[] = [
  {
    num: "۱",
    title: "فرم را پر کنید",
    description: "اطلاعات باشگاه، حساب مدیر و رمز عبور خودتان.",
  },
  {
    num: "۲",
    title: "باشگاه بلافاصله ساخته می‌شود",
    description: "بدون بررسی دستی و بدون معطلی — همان لحظه فعال است.",
  },
  {
    num: "۳",
    title: "مستقیم وارد پنل مدیریت شوید",
    description: "مربیان و اعضا را خودتان اضافه کنید و کار را شروع کنید.",
  },
];

interface VisualPanelProps {
  variant: "login" | "register";
}

export function VisualPanel({ variant }: VisualPanelProps) {
  const trustItems =
    variant === "login" ? loginTrustItems : registerTrustItems;

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 min-[981px]:flex">
      <div
        className="pointer-events-none absolute -left-40 -top-40 z-0 h-[520px] w-[520px]"
        style={{
          background:
            "radial-gradient(circle, rgba(22,224,160,0.22), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[140px] -right-[100px] z-0 h-[420px] w-[420px]"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.14), transparent 70%)",
        }}
      />

      <div className="relative z-[1]">
        <Logo href={variant === "register" ? "/" : undefined} />
      </div>

      <div
        className={`relative z-[1] ${variant === "login" ? "max-w-[420px]" : "max-w-[440px]"}`}
      >
        {variant === "login" ? (
          <>
            <h2 className="mb-4 text-[30px] font-extrabold leading-[1.5] text-white">
              مدیریت باشگاه، ساده و دقیق
            </h2>
            <p className="mb-7 text-[15px] leading-[1.8] text-[#CBD5E1]">
              به پلتفرمی وارد شوید که عضویت، رزرو، پرداخت و عملکرد باشگاه‌تان را
              در یک داشبورد زنده نشان می‌دهد.
            </p>
            <StatsCard />
          </>
        ) : (
          <>
            <h2 className="mb-4 text-[30px] font-extrabold leading-[1.5] text-white">
              باشگاه خود را روی تیتان راه‌اندازی کنید
            </h2>
            <p className="mb-[30px] text-[15px] leading-[1.8] text-[#CBD5E1]">
              فرم زیر را پر کنید تا باشگاه و حساب مدیر شما همین حالا ساخته شود. بدون
              بررسی دستی، مستقیم وارد پنل مدیریت می‌شوید و مربیان و اعضا را
              خودتان اضافه می‌کنید.
            </p>
            <div className="flex flex-col gap-4">
              {registerSteps.map((step) => (
                <div key={step.num} className="flex items-start gap-3.5">
                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-primary/15 text-[15px] font-extrabold text-primary">
                    {step.num}
                  </span>
                  <div>
                    <div className="text-[14.5px] font-bold text-white">
                      {step.title}
                    </div>
                    <div className="mt-[3px] text-[13px] leading-[1.7] text-[#94A3B8]">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative z-[1]">
        <TrustRow items={trustItems} />
      </div>
    </div>
  );
}
