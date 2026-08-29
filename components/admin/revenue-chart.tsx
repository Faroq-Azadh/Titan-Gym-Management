"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ChartPeriod = "week" | "month" | "year";

export function RevenueChart() {
  const [period, setPeriod] = useState<ChartPeriod>("month");

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">روند درآمد</h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">
            {period === "month"
              ? "۷ ماه گذشته · تومان"
              : period === "week"
                ? "۷ روز گذشته · تومان"
                : "۳ سال گذشته · تومان"}
          </div>
        </div>
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

      <div className="p-[22px]">
        <div className="mb-[6px] flex gap-[20px]">
          <span className="flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-soft">
            <span className="h-[11px] w-[11px] rounded-[4px] bg-primary" />
            درآمد
          </span>
          <span className="flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-soft">
            <span className="h-[11px] w-[11px] rounded-[4px] bg-cyan" />
            عضویت جدید
          </span>
        </div>

        <div className="relative h-[230px] w-full">
          <svg
            viewBox="0 0 720 230"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="fillG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16E0A0" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#16E0A0" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
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

            {/* Area + line (revenue) */}
            <path
              d="M0 170 L120 140 L240 150 L360 95 L480 110 L600 60 L720 75 L720 230 L0 230 Z"
              fill="url(#fillG)"
            />
            <path
              d="M0 170 L120 140 L240 150 L360 95 L480 110 L600 60 L720 75"
              fill="none"
              stroke="#0FBF87"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Secondary line (new members) */}
            <path
              d="M0 200 L120 185 L240 175 L360 160 L480 168 L600 140 L720 130"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 5"
            />

            {/* Dots */}
            <circle
              cx="600"
              cy="60"
              r="5"
              fill="#fff"
              stroke="#0FBF87"
              strokeWidth="3"
            />
            <circle cx="720" cy="75" r="5" fill="#0FBF87" />
          </svg>
        </div>

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
