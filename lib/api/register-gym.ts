import { normalizeDigits } from "@/lib/persian-digits";
import type {
  PlanId,
  RegisterGymFormValues,
} from "@/lib/validations/register";

export const REGISTER_CONFIG = {
  endpoint:
    process.env.NEXT_PUBLIC_GYM_REGISTER_ENDPOINT ?? "/api/v1/gyms/register/",
  dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "/admin",
  loginUrl: "/login",
  redirectSeconds: 3,
  freeTrialDays: 14,
  freeMaxMembers: 50,
  freeMaxCoaches: 3,
} as const;

export const PLAN_LABELS: Record<PlanId, string> = {
  free: "رایگان",
  basic: "پایه",
  pro: "حرفه‌ای",
  enterprise: "سازمانی",
};

/** نگاشت نام فیلد بک‌اند به فیلد فرم */
export const FIELD_MAP: Record<string, keyof RegisterGymFormValues> = {
  full_name: "fullName",
  fullName: "fullName",
  name: "fullName",
  gym_name: "gymName",
  gym: "gymName",
  gym_title: "gymName",
  phone: "phone",
  phone_number: "phone",
  mobile: "phone",
  email: "email",
  username: "email",
  city: "city",
  gym_type: "gymType",
  plan: "plan",
  plan_id: "plan",
  password: "password",
  password_confirm: "passwordConfirm",
  password2: "passwordConfirm",
  confirm_password: "passwordConfirm",
};

export interface RegisterGymPayload {
  full_name: string;
  gym_name: string;
  phone: string;
  email: string;
  city: string;
  gym_type: string;
  plan: string;
  password: string;
  password_confirm: string;
  accepted_terms: boolean;
}

export interface RegisterGymResponse {
  errors?: Record<string, unknown>;
  gym?: { name?: string; gym_name?: string; plan?: string; trial_ends_at?: string };
  user?: { email?: string };
  gym_name?: string;
  email?: string;
  plan?: string;
  trial_ends_at?: string;
  plan_expires_at?: string;
  payment_required?: boolean;
  payment_url?: string;
  authenticated?: boolean;
  redirect_url?: string;
  [key: string]: unknown;
}

export function buildPayload(
  values: RegisterGymFormValues,
): RegisterGymPayload {
  return {
    full_name: values.fullName.trim().replace(/\s+/g, " "),
    gym_name: values.gymName.trim(),
    phone: normalizeDigits(values.phone),
    email: values.email.trim().toLowerCase(),
    city: values.city.trim(),
    gym_type: values.gymType,
    plan: values.plan,
    password: values.password,
    password_confirm: values.passwordConfirm,
    accepted_terms: true,
  };
}

function getCookie(name: string): string {
  const match = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)",
  );
  return match ? decodeURIComponent(match.pop() as string) : "";
}

export async function registerGym(payload: RegisterGymPayload): Promise<{
  ok: boolean;
  status: number;
  data: RegisterGymResponse;
}> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const csrf = getCookie("csrftoken");
  if (csrf) headers["X-CSRFToken"] = csrf;

  const response = await fetch(REGISTER_CONFIG.endpoint, {
    method: "POST",
    headers,
    credentials: "include", // لازم است تا کوکی‌های JWT ست شوند
    body: JSON.stringify(payload),
  });

  let data: RegisterGymResponse = {};
  try {
    data = (await response.json()) as RegisterGymResponse;
  } catch {
    data = {};
  }

  return { ok: response.ok, status: response.status, data };
}

export function flattenError(value: unknown): string {
  if (Array.isArray(value)) return value.map(flattenError).join(" ");
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map(flattenError)
      .join(" ");
  }
  return String(value);
}

export interface RegisterSuccess {
  title: string;
  lead: string;
  gymName: string;
  email: string;
  planText: string;
  redirectText: string;
  showRedirectNote: boolean;
  countdown: boolean;
  redirectTarget: string;
  primaryLabel: string;
  primaryHref: string;
  immediateRedirectMs?: number;
}

const fa = (value: number) => value.toLocaleString("fa-IR");

export function buildSuccess(
  data: RegisterGymResponse,
  payload: RegisterGymPayload,
): RegisterSuccess {
  const planLabel = (plan: string) =>
    PLAN_LABELS[plan as PlanId] ?? plan;

  if (data.payment_required && data.payment_url) {
    return {
      title: "باشگاه شما ساخته شد!",
      lead: `برای فعال‌سازی پلن ${planLabel(payload.plan)} به درگاه پرداخت منتقل می‌شوید.`,
      gymName: payload.gym_name,
      email: payload.email,
      planText: `پلن انتخابی: ${planLabel(payload.plan)} — در انتظار پرداخت`,
      redirectText: "در حال انتقال به درگاه پرداخت…",
      showRedirectNote: true,
      countdown: false,
      redirectTarget: data.payment_url,
      primaryLabel: "رفتن به درگاه پرداخت",
      primaryHref: data.payment_url,
      immediateRedirectMs: 1500,
    };
  }

  const gymName =
    data.gym?.name ?? data.gym?.gym_name ?? data.gym_name ?? payload.gym_name;
  const email = data.user?.email ?? data.email ?? payload.email;
  const plan = data.gym?.plan ?? data.plan ?? payload.plan;

  let planText = `پلن فعال: ${planLabel(plan)}`;
  const expires =
    data.trial_ends_at ?? data.plan_expires_at ?? data.gym?.trial_ends_at;
  if (expires) {
    const date = new Date(expires);
    if (!Number.isNaN(date.getTime())) {
      planText += ` — تا ${date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`;
    }
  } else if (plan === "free") {
    planText += ` — ${fa(REGISTER_CONFIG.freeTrialDays)} روز`;
  }
  if (payload.plan === "enterprise") {
    planText =
      "پلن فعال: رایگان — درخواست پلن سازمانی ثبت شد و تیم فروش با شما تماس می‌گیرد.";
  }

  const target = data.redirect_url ?? REGISTER_CONFIG.dashboardUrl;

  // اگر بک‌اند کوکی JWT ست نکرده باشد، کاربر باید دستی وارد شود
  if (data.authenticated === false) {
    return {
      title: "باشگاه شما ساخته شد!",
      lead: "باشگاه و حساب مدیر شما ساخته شد. حالا با ایمیل و رمز عبور خود وارد شوید.",
      gymName,
      email,
      planText,
      redirectText: "",
      showRedirectNote: false,
      countdown: false,
      redirectTarget: REGISTER_CONFIG.loginUrl,
      primaryLabel: "ورود به حساب",
      primaryHref: REGISTER_CONFIG.loginUrl,
    };
  }

  return {
    title: "باشگاه شما ساخته شد!",
    lead: "حساب مدیر و پنل باشگاه شما با موفقیت ایجاد شد و همین حالا فعال است.",
    gymName,
    email,
    planText,
    redirectText: "در حال انتقال به پنل مدیریت…",
    showRedirectNote: true,
    countdown: true,
    redirectTarget: target,
    primaryLabel: "ورود به پنل مدیریت",
    primaryHref: target,
  };
}

export function countdownText(secondsLeft: number): string {
  return `تا ${fa(secondsLeft)} ثانیه‌ی دیگر به پنل مدیریت منتقل می‌شوید…`;
}

export function persianNumber(value: number): string {
  return fa(value);
}
