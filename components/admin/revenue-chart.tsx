"use client";

import { useState } from "react";
import { useOwnerDashboard } from "@/lib/hooks/queries/use-owner-dashboard";
import { cn } from "@/lib/utils";

type ChartPeriod = "week" | "month" | "year";

export function RevenueChart() {
  const [period, setPeriod] = useState<ChartPeriod>("week");
  const { data: dashboard, isLoading } = useOwnerDashboard();

  const DEFAULT_WEEKLY = [
    { day: "شنبه", checkins: 0 },
    { day: "یکشنبه", checkins: 0 },
    { day: "دوشنبه", checkins: 0 },
    { day: "سه‌شنبه", checkins: 0 },
    { day: "چهارشنبه", checkins: 0 },
    { day: "پنج‌شنبه", checkins: 0 },
    { day: "جمعه", checkins: 0 },
  ];

  const weeklyData =
    dashboard?.weekly_attendance && dashboard.weekly_attendance.length > 0
      ? dashboard.weekly_attendance
      : DEFAULT_WEEKLY;

  const monthLabels = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر"];
  const yearLabels = ["۱۴۰۲", "۱۴۰۳", "۱۴۰۴"];

  const currentLabels =
    period === "week"
      ? weeklyData.map((d) => d.day)
      : period === "month"
        ? monthLabels
        : yearLabels;

  // Compute SVG points dynamically
  const values =
    period === "week"
      ? weeklyData.map((d) => d.checkins)
      : period === "month"
        ? [0, 0, 0, 0, 0, 0, 0]
        : [0, 0, 0];

  const maxVal = Math.max(...values, 10);
  const width = 720;
  const height = 230;
  const paddingY = 40;
  const usableHeight = height - paddingY * 2;

  const points = values.map((val, idx) => {
    const x = values.length > 1 ? (idx / (values.length - 1)) * width : width / 2;
    const y = height - paddingY - (val / maxVal) * usableHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M${pt.x} ${pt.y}` : `${acc} L${pt.x} ${pt.y}`;
  }, "");

  const areaD = points.length > 0
    ? `${pathD} L${points[points.length - 1].x} ${height} L${points[0].x} ${height} Z`
    : "";

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">
            {period === "week" ? "تردد و حضور هفتگی" : "روند درآمد"}
          </h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">
            {period === "month"
              ? "۷ ماه گذشته · تومان"
              : period === "week"
                ? "۷ روز گذشته · تعداد ورود"
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
            {period === "week" ? "ورود اعضا" : "درآمد"}
          </span>
          <span className="flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-soft">
            <span className="h-[11px] w-[11px] rounded-[4px] bg-cyan" />
            عضویت جدید
          </span>
        </div>

        <div className="relative h-[230px] w-full">
          {isLoading && !dashboard ? (
            <div className="flex h-full w-full animate-pulse items-center justify-center rounded-[12px] bg-bg/40">
              <span className="text-sm text-ink-faint">در حال بارگذاری نمودار…</span>
            </div>
          ) : (
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
              <line x1="0" y1="40" x2="720" y2="40" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="0" y1="100" x2="720" y2="100" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="0" y1="160" x2="720" y2="160" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="4 6" />

              {/* Area + line */}
              {areaD && <path d={areaD} fill="url(#fillG)" />}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#0FBF87"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Dots */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === points.length - 1 ? 5 : 4}
                  fill="#fff"
                  stroke="#0FBF87"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
          )}
        </div>

        <div className="mt-[8px] flex justify-between text-[11.5px] font-semibold text-ink-faint">
          {currentLabels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

