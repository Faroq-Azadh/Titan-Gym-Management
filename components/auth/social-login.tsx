"use client";

import Link from "next/link";

export function SocialLogin() {
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-border py-3 text-[13.5px] font-semibold text-ink-soft transition-all duration-200 ease-in-out hover:border-ink-faint hover:bg-bg"
        aria-label="ورود با گوگل"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
          <path
            fill="#EA4335"
            d="M12 11v2.4h6.7c-.3 1.6-2.1 4.7-6.7 4.7-4 0-7.3-3.3-7.3-7.4S8 3.3 12 3.3c2.3 0 3.8.9 4.7 1.8l2.5-2.4C17.6 1.2 15.1 0 12 0 5.4 0 0 5.4 0 12s5.4 12 12 12c6.9 0 11.5-4.8 11.5-11.6 0-.8-.1-1.4-.2-2H12z"
          />
        </svg>
        ورود با گوگل
      </button>
    </div>
  );
}

export function RoleNote() {
  return (
    <div className="mt-5 flex items-start gap-[9px] rounded-[12px] border border-primary/30 bg-tint px-3.5 py-3">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-[17px] w-[17px] shrink-0 stroke-primary-dark"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <p className="text-[12.5px] leading-[1.7] text-ink-soft">
        مربیان و اعضا نمی‌توانند ثبت‌نام کنند؛ آن‌ها توسط مدیر باشگاه اضافه
        می‌شوند و فقط وارد می‌شوند.
      </p>
    </div>
  );
}

export function GymRegistrationLink() {
  return (
    <p className="mt-5 text-center text-sm text-ink-soft">
      می‌خواهید باشگاه‌تان را ثبت کنید؟{" "}
      <Link
        href="/register-gym"
        className="font-bold text-primary-dark hover:underline"
      >
        درخواست ثبت باشگاه
      </Link>
    </p>
  );
}
