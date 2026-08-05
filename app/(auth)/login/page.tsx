"use client";

import { useState } from "react";
import { VisualPanel } from "@/components/shared/visual-panel";
import { MobileLogo } from "@/components/ui/logo";
import { Card, CardBody, CardHead } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { MethodSwitch, type LoginMethod } from "@/components/auth/method-switch";
import { LoginForm } from "@/components/auth/login-form";
import { OtpForm } from "@/components/auth/otp-form";
import {
  GymRegistrationLink,
  RoleNote,
  SocialLogin,
} from "@/components/auth/social-login";
import { MotionFade } from "@/components/shared/motion-fade";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [method, setMethod] = useState<LoginMethod>("password");

  const handleLogin = () => {
    // Prepared for future API integration
  };

  return (
    <div className="grid min-h-screen grid-cols-1 min-[981px]:grid-cols-2">
      <VisualPanel variant="login" />

      <div className="flex items-start justify-center px-5 pt-12 pb-8 min-[981px]:items-center min-[981px]:px-8 min-[981px]:py-12">
        <div className="w-full max-w-[420px]">
          <MobileLogo />

          <MotionFade>
          <Card>
            <CardBody>
              <CardHead
                title="خوش آمدید"
                description="برای ورود به حساب خود، شماره موبایل/ایمیل و رمز عبور را وارد کنید"
              />

              <MethodSwitch activeMethod={method} onMethodChange={setMethod} />

              <div className={cn(method === "password" ? "block" : "hidden")}>
                <LoginForm onSubmit={handleLogin} />
              </div>

              <div className={cn(method === "otp" ? "block" : "hidden")}>
                <OtpForm onVerify={handleLogin} />
              </div>

              <Divider />
              <SocialLogin />
              <RoleNote />
              <GymRegistrationLink />
            </CardBody>
          </Card>
          </MotionFade>
        </div>
      </div>
    </div>
  );
}
