"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { useOtpInput } from "@/lib/hooks/use-otp-input";
import { useOtpTimer } from "@/lib/hooks/use-otp-timer";
import {
  loginOtpRequestSchema,
  loginOtpVerifySchema,
  type LoginOtpRequestFormValues,
} from "@/lib/validations/login";
import { normalizeDigits, toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

interface OtpFormProps {
  onVerify?: (otp: string) => void;
}

export function OtpForm({ onVerify }: OtpFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [target, setTarget] = useState("۰۹۱۲۳۴۵۶۷۸۹");

  const { timerLabel, canResend, startTimer, resetTimer } = useOtpTimer();
  const {
    values,
    otpValue,
    setRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    reset,
    focusInput,
  } = useOtpInput();
  const [otpError, setOtpError] = useState<string | null>(null);

  const requestForm = useForm<LoginOtpRequestFormValues>({
    resolver: zodResolver(loginOtpRequestSchema),
    defaultValues: { phone: "" },
  });

  const { ref: phoneRef, onBlur: onPhoneBlur } = requestForm.register("phone");
  const phone = requestForm.watch("phone");

  useEffect(() => {
    if (step === 2) {
      focusInput(0);
    }
  }, [step, focusInput]);

  const handleRequestOtp = (values: LoginOtpRequestFormValues) => {
    setTarget(toPersianDigits(normalizeDigits(values.phone)));
    setStep(2);
    setOtpError(null);
    reset();
    startTimer();
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtpError(null);
    reset();
  };

  const handleVerify = () => {
    const result = loginOtpVerifySchema.safeParse({ otp: otpValue });
    if (!result.success) {
      setOtpError(result.error.issues[0].message);
      focusInput(otpValue.length);
      return;
    }
    setOtpError(null);
    onVerify?.(otpValue);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtpError(null);
    reset();
    resetTimer();
  };

  if (step === 1) {
    return (
      <form onSubmit={requestForm.handleSubmit(handleRequestOtp)} noValidate>
        <div className="mb-4">
          <label
            htmlFor="login-otp-id"
            className="mb-2 block text-[13.5px] font-semibold text-ink"
          >
            شماره موبایل
          </label>
          <FormInput
            id="login-otp-id"
            type="tel"
            inputMode="numeric"
            dir="ltr"
            maxLength={11}
            className="text-right"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            autoComplete="tel"
            name="phone"
            ref={phoneRef}
            value={phone}
            onBlur={onPhoneBlur}
            onChange={(event) =>
              requestForm.setValue(
                "phone",
                normalizeDigits(event.target.value).slice(0, 11),
                { shouldValidate: !!requestForm.formState.errors.phone },
              )
            }
            error={!!requestForm.formState.errors.phone}
            icon={<Phone strokeWidth={2} />}
          />
          {requestForm.formState.errors.phone && (
            <p className="mt-1.5 text-xs text-rose-500">
              {requestForm.formState.errors.phone.message}
            </p>
          )}
          <p className="mt-1.5 text-xs text-ink-faint">
            یک کد ۵ رقمی برای شما ارسال می‌شود
          </p>
        </div>
        <Button type="submit">ارسال کد تایید</Button>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between rounded-[10px] bg-tint px-3.5 py-[11px] text-[13.5px] text-ink">
        <span>
          کد ارسال شد به <b className="font-bold">{target}</b>
        </span>
        <button
          type="button"
          className="text-[12.5px] font-bold text-primary-dark"
          onClick={handleBackToStep1}
        >
          تغییر
        </button>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-[13.5px] font-semibold text-ink">
          کد تایید را وارد کنید
        </label>
        <div className="mb-2 flex items-center justify-center gap-2 sm:gap-2.5" dir="ltr">
          {values.map((value, index) => (
            <input
              key={index}
              ref={setRef(index)}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={value}
              aria-label={`رقم ${index + 1} کد تایید`}
              aria-invalid={!!otpError}
              className={cn(
                "h-11 w-11 sm:h-12 sm:w-12 rounded-[12px] border-[1.5px] border-border bg-surface text-center text-lg font-bold text-ink outline-none transition-all duration-200 ease-in-out focus:border-primary focus:shadow-[0_0_0_4px_var(--tint)]",
                otpError && "border-rose-500",
              )}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event.key)}
              onPaste={(event) => {
                event.preventDefault();
                handlePaste(index, event.clipboardData.getData("text"));
              }}
            />
          ))}
        </div>
        {otpError && <p className="mt-1.5 text-xs text-rose-500">{otpError}</p>}
      </div>

      <div className="mb-[22px] mt-2.5 flex items-center justify-between">
        <span className="text-[13px] text-ink-faint">{timerLabel}</span>
        <button
          type="button"
          className={cn(
            "text-[13px] font-bold text-primary-dark",
            !canResend && "cursor-default text-ink-faint",
          )}
          onClick={handleResend}
          disabled={!canResend}
        >
          ارسال مجدد کد
        </button>
      </div>

      <Button type="button" onClick={handleVerify}>
        تایید و ورود
      </Button>
    </div>
  );
}
