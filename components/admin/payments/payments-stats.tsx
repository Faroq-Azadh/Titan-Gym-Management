"use client";

import { toPersianDigits } from "@/lib/persian-digits";

interface PaymentsStatsProps {
  monthlyRevenue?: string;
  successfulCount?: number;
  pendingCount?: number;
  failedCount?: number;
}

export function PaymentsStats({
  monthlyRevenue = "۲۴۸ م",
  successfulCount = 1394,
  pendingCount = 27,
  failedCount = 18,
}: PaymentsStatsProps) {
  return (
    <section className="mb-[22px] grid grid-cols-1 gap-[18px] min-[640px]:grid-cols-2 min-[1100px]:grid-cols-4">
      {/* 1. Monthly Revenue */}
      <div className="flex items-center gap-[14px] rounded-[16px] border border-border bg-surface p-[18px_20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-tint text-primary-dark">
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
        <div>
          <div className="text-[24px] font-extrabold leading-[1.1] text-ink">
            {toPersianDigits(monthlyRevenue)}
          </div>
          <div className="mt-[3px] text-[13px] font-medium text-ink-soft">
            درآمد این ماه (تومان)
          </div>
        </div>
      </div>

      {/* 2. Successful Transactions */}
      <div className="flex items-center gap-[14px] rounded-[16px] border border-border bg-surface p-[18px_20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-tint text-primary-dark">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[22px] w-[22px]"
          >
            <path d="m9 12 2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </span>
        <div>
          <div className="text-[24px] font-extrabold leading-[1.1] text-ink">
            {toPersianDigits(successfulCount.toLocaleString())}
          </div>
          <div className="mt-[3px] text-[13px] font-medium text-ink-soft">
            تراکنش موفق
          </div>
        </div>
      </div>

      {/* 3. Pending Settlement */}
      <div className="flex items-center gap-[14px] rounded-[16px] border border-border bg-surface p-[18px_20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-[#FFFBEB] text-[#B45309]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[22px] w-[22px]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </span>
        <div>
          <div className="text-[24px] font-extrabold leading-[1.1] text-ink">
            {toPersianDigits(pendingCount)}
          </div>
          <div className="mt-[3px] text-[13px] font-medium text-ink-soft">
            در انتظار تسویه
          </div>
        </div>
      </div>

      {/* 4. Failed / Refunded */}
      <div className="flex items-center gap-[14px] rounded-[16px] border border-border bg-surface p-[18px_20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-[#FFF1F2] text-[#9F1239]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[22px] w-[22px]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6M9 9l6 6" />
          </svg>
        </span>
        <div>
          <div className="text-[24px] font-extrabold leading-[1.1] text-ink">
            {toPersianDigits(failedCount)}
          </div>
          <div className="mt-[3px] text-[13px] font-medium text-ink-soft">
            ناموفق / بازگشت
          </div>
        </div>
      </div>
    </section>
  );
}
