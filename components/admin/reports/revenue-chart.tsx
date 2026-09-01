"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function RevenueChart() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] print-avoid-break">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-[20px_22px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">روند درآمد</h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">
            ۷ ماه گذشته · تومان
          </div>
        </div>

        {/* Time Segment Switcher */}
        <div className="flex gap-[4px] rounded-[10px] bg-bg p-[4px]">
          <button
            type="button"
            onClick={() => setPeriod("week")}
            className={cn(
              "rounded-[8px] px-[12px] py-[6px] text-[12.5px] font-bold transition-all duration-180",
              period === "week"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink",
            )}
          >
            هفته
          </button>
          <button
            type="button"
            onClick={() => setPeriod("month")}
            className={cn(
              "rounded-[8px] px-[12px] py-[6px] text-[12.5px] font-bold transition-all duration-180",
              period === "month"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink",
            )}
          >
            ماه
          </button>
          <button
            type="button"
            onClick={() => setPeriod("year")}
            className={cn(
              "rounded-[8px] px-[12px] py-[6px] text-[12.5px] font-bold transition-all duration-180",
              period === "year"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink",
            )}
          >
            سال
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="p-[22px]">
        {/* Legend */}
        <div className="mb-[10px] flex flex-wrap gap-[20px]">
          <span className="flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-soft">
            <span className="h-[11px] w-[11px] rounded-[4px] bg-primary" />
            درآمد
          </span>
          <span className="flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-soft">
            <span className="h-[11px] w-[11px] rounded-[4px] bg-[#22D3EE]" />
            عضویت جدید
          </span>
        </div>

        {/* SVG Chart Area */}
        <div className="relative h-[220px] w-full">
          <svg
            viewBox="0 0 720 220"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="fillG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16E0A0" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#16E0A0" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Dotted Lines */}
            <line
              x1="0"
              y1="40"
              x2="720"
              y2="40"
              stroke="#E7E5E4"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <line
              x1="0"
              y1="100"
              x2="720"
              y2="100"
              stroke="#E7E5E4"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <line
              x1="0"
              y1="160"
              x2="720"
              y2="160"
              stroke="#E7E5E4"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Area Fill */}
            <path
              d="M0 165 L120 138 L240 148 L360 92 L480 108 L600 58 L720 72 L720 220 L0 220 Z"
              fill="url(#fillG)"
            />

            {/* Green Revenue Line */}
            <path
              d="M0 165 L120 138 L240 148 L360 92 L480 108 L600 58 L720 72"
              fill="none"
              stroke="#0FBF87"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Cyan New Members Dashed Line */}
            <path
              d="M0 195 L120 182 L240 172 L360 158 L480 165 L600 138 L720 128"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 5"
            />

            {/* Data Points */}
            <circle
              cx="600"
              cy="58"
              r="5"
              fill="#fff"
              stroke="#0FBF87"
              strokeWidth="3"
            />
            <circle cx="720" cy="72" r="5" fill="#0FBF87" />
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="mt-[8px] flex justify-between text-[11.5px] font-semibold text-ink-faint">
          <span>فروردین</span>
          <span>اردیبهشت</span>
          <span>خرداد</span>
          <span>تیر</span>
          <span>مرداد</span>
          <span>شهریور</span>
          <span>مهر</span>
        </div>
      </div>
    </div>
  );
}
