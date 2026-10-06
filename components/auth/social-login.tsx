"use client";

import Link from "next/link";

export function SocialLogin() {
  return null;
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
