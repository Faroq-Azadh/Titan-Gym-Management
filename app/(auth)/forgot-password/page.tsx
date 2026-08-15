import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { VisualPanel } from "@/components/shared/visual-panel";
import { MobileLogo } from "@/components/ui/logo";
import { Card, CardBody } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { MotionFade } from "@/components/shared/motion-fade";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 min-[981px]:grid-cols-2">
      <VisualPanel variant="forgot-password" />

      <div className="flex items-start justify-center px-5 pt-12 pb-8 min-[981px]:items-center min-[981px]:px-8 min-[981px]:py-12">
        <div className="w-full max-w-[420px]">
          <MobileLogo />

          <Link
            href="/login"
            className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-ink-soft transition-colors hover:text-primary-dark"
          >
            <ChevronRight className="h-4 w-4" />
            بازگشت به صفحه‌ی ورود
          </Link>

          <MotionFade>
            <Card>
              <CardBody>
                <ForgotPasswordForm />
              </CardBody>
            </Card>
          </MotionFade>
        </div>
      </div>
    </div>
  );
}
