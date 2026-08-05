"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VisualPanel } from "@/components/shared/visual-panel";
import { MobileLogo } from "@/components/ui/logo";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/register/register-form";
import { SuccessCard } from "@/components/register/success-card";
import { MotionFade } from "@/components/shared/motion-fade";
import type { RegisterSuccess } from "@/lib/api/register-gym";

export default function RegisterGymPage() {
  const [success, setSuccess] = useState<RegisterSuccess | null>(null);

  const handleSuccess = (result: RegisterSuccess) => {
    setSuccess(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 min-[981px]:grid-cols-[1fr_1.1fr]">
      <VisualPanel variant="register" />

      <div className="flex items-start justify-center overflow-y-auto px-[18px] pt-7 pb-10 min-[981px]:px-10 min-[981px]:py-12">
        <div className="w-full max-w-[560px]">
          <MobileLogo className="mb-7" />

          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-ink-soft transition-colors duration-[180ms] ease-in-out hover:text-primary-dark"
          >
            <ChevronLeft className="h-4 w-4 scale-x-[-1]" strokeWidth={2.5} />
            بازگشت به صفحه‌ی اصلی
          </Link>

          {!success ? (
            <MotionFade>
            <Card variant="form" className="max-[520px]:px-[18px] max-[520px]:py-[22px]">
              <div className="mb-6">
                <h1 className="mb-2 text-2xl font-extrabold text-ink">
                  ساخت حساب باشگاه
                </h1>
                <p className="text-sm leading-[1.7] text-ink-faint">
                  فرم را پر کنید تا باشگاه و حساب مدیر شما همین حالا ساخته شود.
                  با پلن رایگان شروع کنید؛ هر زمان خواستید ارتقا دهید.
                </p>
              </div>

              <RegisterForm onSuccess={handleSuccess} />

              <p className="mt-[22px] text-center text-sm text-ink-soft">
                قبلاً باشگاه‌تان را ثبت کرده‌اید؟{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary-dark hover:underline"
                >
                  وارد شوید
                </Link>
              </p>
            </Card>
            </MotionFade>
          ) : (
            <MotionFade>
              <SuccessCard success={success} />
            </MotionFade>
          )}
        </div>
      </div>
    </div>
  );
}
