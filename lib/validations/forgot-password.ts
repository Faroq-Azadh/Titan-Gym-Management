import { z } from "zod";
import { normalizeDigits } from "@/lib/persian-digits";

export const forgotPasswordPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره موبایل را وارد کنید.")
    .refine((val) => /^09\d{9}$/.test(normalizeDigits(val)), {
      message: "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.",
    }),
});

export const forgotPasswordOtpSchema = z.object({
  code: z
    .string()
    .min(1, "کد تأیید را وارد کنید.")
    .refine((val) => normalizeDigits(val).length === 6, {
      message: "کد ۶ رقمی را کامل وارد کنید.",
    }),
});

export const forgotPasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(1, "رمز عبور جدید را وارد کنید.")
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.")
      .refine((val) => !/^\d+$/.test(val), {
        message: "رمز عبور نمی‌تواند فقط عدد باشد.",
      }),
    passwordConfirm: z.string().min(1, "تکرار رمز عبور را وارد کنید."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "رمز عبور و تکرار آن یکسان نیست.",
    path: ["passwordConfirm"],
  });

export type ForgotPasswordPhoneFormValues = z.infer<
  typeof forgotPasswordPhoneSchema
>;
export type ForgotPasswordOtpFormValues = z.infer<
  typeof forgotPasswordOtpSchema
>;
export type ForgotPasswordResetFormValues = z.infer<
  typeof forgotPasswordResetSchema
>;
