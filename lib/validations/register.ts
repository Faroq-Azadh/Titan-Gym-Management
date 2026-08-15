import { z } from "zod";
import { normalizeDigits } from "@/lib/persian-digits";

export const gymTypeOptions = [
  { value: "fitness", label: "باشگاه بدنسازی و فیتنس" },
  { value: "crossfit", label: "کراس‌فیت" },
  { value: "martial_arts", label: "ورزش‌های رزمی" },
  { value: "aquatic", label: "استخر و آبی" },
  { value: "multipurpose", label: "مجموعه‌ی چندمنظوره" },
  { value: "other", label: "سایر" },
] as const;

export const planOptions = [
  { value: "free", label: "رایگان — ۴۵ روز" },
  { value: "basic", label: "پایه — ۱.۲ میلیون تومان / ماه" },
  { value: "pro", label: "حرفه‌ای — ۲.۹ میلیون تومان / ماه" },
  { value: "enterprise", label: "سازمانی — قیمت‌گذاری سفارشی" },
] as const;

export type PlanId = (typeof planOptions)[number]["value"];

export const planIds = planOptions.map((option) => option.value) as PlanId[];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const registerGymSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "نام و نام خانوادگی مدیر را وارد کنید.")
      .refine((value) => value.replace(/\s+/g, " ").split(" ").length >= 2, {
        message: "نام و نام خانوادگی را کامل وارد کنید.",
      }),
    gymName: z.string().trim().min(1, "نام باشگاه را وارد کنید."),
    phone: z
      .string()
      .trim()
      .min(1, "شماره موبایل را وارد کنید.")
      .refine((value) => /^09\d{9}$/.test(normalizeDigits(value)), {
        message: "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.",
      }),
    email: z
      .string()
      .trim()
      .min(1, "ایمیل را وارد کنید.")
      .regex(emailPattern, "فرمت ایمیل معتبر نیست."),
    city: z.string().trim().min(1, "شهر را وارد کنید."),
    gymType: z.string(),
    password: z
      .string()
      .min(1, "رمز عبور را وارد کنید.")
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.")
      .refine((value) => !/^\d+$/.test(value), {
        message: "رمز عبور نمی‌تواند فقط عدد باشد.",
      }),
    passwordConfirm: z.string().min(1, "تکرار رمز عبور را وارد کنید."),
    plan: z
      .string()
      .min(1, "یک پلن انتخاب کنید.")
      .refine((value) => planIds.includes(value as PlanId), {
        message: "یک پلن انتخاب کنید.",
      }),
    terms: z.boolean().refine((value) => value === true, {
      message: "برای ادامه باید قوانین استفاده و حریم خصوصی را بپذیرید.",
    }),
  })
  .superRefine((values, ctx) => {
    if (values.passwordConfirm && values.passwordConfirm !== values.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirm"],
        message: "رمز عبور و تکرار آن یکسان نیست.",
      });
    }
  });

export type RegisterGymFormValues = z.infer<typeof registerGymSchema>;
