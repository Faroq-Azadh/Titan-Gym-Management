import { z } from "zod";
import { normalizeDigits } from "@/lib/persian-digits";

export const loginPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "شماره موبایل یا ایمیل الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
  remember: z.boolean().optional(),
});

export const loginOtpRequestSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره موبایل الزامی است")
    .refine((value) => /^09\d{9}$/.test(normalizeDigits(value)), {
      message: "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.",
    }),
});

export const loginOtpVerifySchema = z.object({
  otp: z
    .string()
    .length(5, "کد تایید باید ۵ رقم باشد"),
});

export type LoginPasswordFormValues = z.infer<typeof loginPasswordSchema>;
export type LoginOtpRequestFormValues = z.infer<typeof loginOtpRequestSchema>;
export type LoginOtpVerifyFormValues = z.infer<typeof loginOtpVerifySchema>;
