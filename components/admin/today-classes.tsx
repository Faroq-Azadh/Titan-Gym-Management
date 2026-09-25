"use client";

import { useOwnerDashboard } from "@/lib/hooks/queries/use-owner-dashboard";
import type { TodaysClass } from "@/lib/api/services/gyms.service";
import { cn } from "@/lib/utils";

interface TodayClassesProps {
  classes?: TodaysClass[];
  isLoading?: boolean;
}

export function TodayClasses({ classes: propClasses, isLoading: propLoading }: TodayClassesProps) {
  const { data: dashboard, isLoading: queryLoading } = useOwnerDashboard();
  const classes = propClasses ?? dashboard?.todays_classes;
  const isLoading = propLoading ?? queryLoading;

  const toPersianDigits = (str: string | number) => {
    return String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return { hour: "۰۰:۰۰", period: "روز" };
    const parts = timeStr.split(":");
    const hourNum = parseInt(parts[0], 10) || 0;
    const minute = parts[1] || "00";
    const hourFormatted = `${toPersianDigits(parts[0].padStart(2, "0"))}:${toPersianDigits(minute)}`;
    let period = "صبح";
    if (hourNum >= 12 && hourNum < 17) period = "عصر";
    else if (hourNum >= 17) period = "شب";
    return { hour: hourFormatted, period };
  };

  if (isLoading && !classes) {
    return (
      <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] p-[22px]">
        <div className="flex items-center justify-between border-b border-border pb-[16px]">
          <div className="h-[20px] w-[110px] animate-pulse rounded bg-bg" />
          <div className="h-[20px] w-[50px] animate-pulse rounded-full bg-bg" />
        </div>
        <div className="flex flex-col gap-[14px] pt-[16px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex h-[60px] animate-pulse items-center gap-[14px] rounded bg-bg/50" />
          ))}
        </div>
      </div>
    );
  }

  const items = classes && classes.length > 0 ? classes : [];

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">کلاس‌های امروز</h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">
            {toPersianDigits(items.length)} جلسه فعال
          </div>
        </div>
        <span className="rounded-full bg-tint px-[11px] py-[5px] text-[11.5px] font-bold text-primary-dark">
          زنده
        </span>
      </div>

      <div className="px-[22px] pt-[6px] pb-[22px]">
        {items.length === 0 ? (
          <div className="py-8 text-center text-[13.5px] text-ink-faint">
            هیچ کلاسی برای امروز ثبت نشده است.
          </div>
        ) : (
          items.map((item, index) => {
            const timeInfo = formatTime(item.start_time);
            const percentage = item.capacity > 0 ? Math.min(100, Math.round((item.booked / item.capacity) * 100)) : 0;
            const isFull = item.booked >= item.capacity && item.capacity > 0;
            const capacityText = isFull
              ? `تکمیل · ${toPersianDigits(item.booked)} از ${toPersianDigits(item.capacity)} نفر`
              : `${toPersianDigits(item.booked)} از ${toPersianDigits(item.capacity)} نفر`;

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-[14px] py-[14px]",
                  index < items.length - 1 && "border-b border-border",
                  index === items.length - 1 && "pb-0",
                )}
              >
                <div className="w-[58px] shrink-0 rounded-[10px] bg-bg px-[4px] py-[8px] text-center">
                  <div className="text-[15px] font-extrabold text-ink">{timeInfo.hour}</div>
                  <div className="text-[11px] text-ink-faint">{timeInfo.period}</div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold text-ink">{item.title}</div>
                  <div className="mt-[2px] text-[12.5px] text-ink-faint">مربی: {item.coach_name}</div>
                  <div className="mt-[7px]">
                    <div className="h-[6px] overflow-hidden rounded-full bg-bg">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          isFull
                            ? "bg-gradient-to-r from-[#F59E0B] to-[#EF4444]"
                            : "bg-gradient-to-r from-primary to-cyan",
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="mt-[5px] text-[11.5px] font-semibold text-ink-faint">
                      {capacityText}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

