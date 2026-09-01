"use client";

import { toPersianDigits } from "@/lib/persian-digits";

export function ReportsKpi() {
  return (
    <section className="mb-[18px] grid grid-cols-1 gap-[18px] min-[540px]:grid-cols-2 min-[900px]:grid-cols-4 print-kpi-grid">
      {/* 1. Total Revenue */}
      <div className="flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] print-avoid-break">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[22px] w-[22px]"
            >
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-[4px] rounded-full bg-tint px-[9px] py-[4px] text-[12.5px] font-bold text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="h-[13px] w-[13px]"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
            {toPersianDigits("۱۲٪")}
          </span>
        </div>
        <div className="text-[28px] font-black leading-none text-ink">
          {toPersianDigits("۲۴۸ م")}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          درآمد کل (تومان)
        </div>
      </div>

      {/* 2. New Members */}
      <div className="flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] print-avoid-break">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[22px] w-[22px]"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-[4px] rounded-full bg-tint px-[9px] py-[4px] text-[12.5px] font-bold text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="h-[13px] w-[13px]"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
            {toPersianDigits("۸٪")}
          </span>
        </div>
        <div className="text-[28px] font-black leading-none text-ink">
          {toPersianDigits("۱۴۲")}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          اعضای جدید
        </div>
      </div>

      {/* 3. Average Daily Attendance */}
      <div className="flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] print-avoid-break">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[22px] w-[22px]"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-[4px] rounded-full bg-tint px-[9px] py-[4px] text-[12.5px] font-bold text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="h-[13px] w-[13px]"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
            {toPersianDigits("۵٪")}
          </span>
        </div>
        <div className="text-[28px] font-black leading-none text-ink">
          {toPersianDigits("۳۱۸")}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          میانگین حضور روزانه
        </div>
      </div>

      {/* 4. Churn Rate */}
      <div className="flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] print-avoid-break">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[22px] w-[22px]"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-[4px] rounded-full bg-[#FFF1F2] px-[9px] py-[4px] text-[12.5px] font-bold text-[#E11D48]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="h-[13px] w-[13px]"
            >
              <path d="M17 7 7 17M15 17H7V9" />
            </svg>
            {toPersianDigits("۱٫۲٪")}
          </span>
        </div>
        <div className="text-[28px] font-black leading-none text-ink">
          {toPersianDigits("۶٪")}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          نرخ ریزش اعضا
        </div>
      </div>
    </section>
  );
}
