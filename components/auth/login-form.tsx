"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import {
  loginPasswordSchema,
  type LoginPasswordFormValues,
} from "@/lib/validations/login";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSubmit?: (values: LoginPasswordFormValues) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPasswordFormValues>({
    resolver: zodResolver(loginPasswordSchema),
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  });

  const handleFormSubmit = (values: LoginPasswordFormValues) => {
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="mb-4">
        <label
          htmlFor="login-id"
          className="mb-2 block text-[13.5px] font-semibold text-ink"
        >
          شماره موبایل یا ایمیل
        </label>
        <FormInput
          id="login-id"
          type="text"
          placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹ یا name@email.com"
          autoComplete="username"
          error={!!errors.identifier}
          icon={<Mail strokeWidth={2} />}
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.identifier.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="login-pass"
          className="mb-2 block text-[13.5px] font-semibold text-ink"
        >
          رمز عبور
        </label>
        <FormInput
          id="login-pass"
          type={showPassword ? "text" : "password"}
          placeholder="رمز عبور خود را وارد کنید"
          autoComplete="current-password"
          error={!!errors.password}
          icon={<Lock strokeWidth={2} />}
          toggle={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            >
              {showPassword ? (
                <EyeOff strokeWidth={2} />
              ) : (
                <Eye strokeWidth={2} />
              )}
            </button>
          }
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-[22px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="h-[17px] w-[17px] rounded accent-primary"
            {...register("remember")}
          />
          <label htmlFor="remember" className="text-[13.5px] text-ink-soft">
            مرا به خاطر بسپار
          </label>
        </div>
        <Link
          href="/forgot-password"
          className={cn(
            "text-[13.5px] font-semibold text-primary-dark hover:underline",
          )}
        >
          فراموشی رمز عبور؟
        </Link>
      </div>

      <Button type="submit">ورود به پنل</Button>
    </form>
  );
}
