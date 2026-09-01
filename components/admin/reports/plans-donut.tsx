"use client";

import { toPersianDigits } from "@/lib/persian-digits";

export function PlansDonut() {
  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] print-avoid-break">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-[20px_22px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">توزیع پلن‌ها</h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">
            اعضای فعال
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-[22px]">
        <div className="flex flex-wrap items-center justify-center gap-[24px]">
          {/* Donut Circle */}
          <div className="relative h-[160px] w-[160px] shrink-0">
            <svg
              viewBox="0 0 42 42"
              className="h-full w-full -rotate-90 transform"
            >
              {/* Background Track */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="var(--bg)"
                strokeWidth="5"
              />
              {/* Gold Segment (52%) */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="5"
                strokeDasharray="52 48"
                strokeDashoffset="0"
                className="transition-all duration-500 hover:opacity-80"
              />
              {/* Silver Segment (33%) */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="5"
                strokeDasharray="33 67"
                strokeDashoffset="-52"
                className="transition-all duration-500 hover:opacity-80"
              />
              {/* Bronze Segment (15%) */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="#D97706"
                strokeWidth="5"
                strokeDasharray="15 85"
                strokeDashoffset="-85"
                className="transition-all duration-500 hover:opacity-80"
              />
            </svg>

            {/* Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-[24px] font-extrabold text-ink">
                {toPersianDigits("۱٬۰۸۶")}
              </div>
              <div className="text-[11.5px] font-semibold text-ink-faint">
                عضو فعال
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex flex-col gap-[12px] min-w-[120px]">
            <div className="flex items-center gap-[10px] text-[13px]">
              <span className="h-[10px] w-[10px] shrink-0 rounded-[3px] bg-[#F59E0B]" />
              <span className="font-semibold text-ink-soft">طلایی</span>
              <span className="mr-auto font-extrabold text-ink">
                {toPersianDigits("۵۲٪")}
              </span>
            </div>

            <div className="flex items-center gap-[10px] text-[13px]">
              <span className="h-[10px] w-[10px] shrink-0 rounded-[3px] bg-[#94A3B8]" />
              <span className="font-semibold text-ink-soft">نقره‌ای</span>
              <span className="mr-auto font-extrabold text-ink">
                {toPersianDigits("۳۳٪")}
              </span>
            </div>

            <div className="flex items-center gap-[10px] text-[13px]">
              <span className="h-[10px] w-[10px] shrink-0 rounded-[3px] bg-[#D97706]" />
              <span className="font-semibold text-ink-soft">برنزی</span>
              <span className="mr-auto font-extrabold text-ink">
                {toPersianDigits("۱۵٪")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
