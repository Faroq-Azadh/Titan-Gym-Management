"use client";

import { cn } from "@/lib/utils";

interface ClassItem {
  id: string;
  timeHour: string;
  timePeriod: string;
  name: string;
  coach: string;
  percentage: number;
  capacityText: string;
  isFull?: boolean;
}

const TODAY_CLASSES: ClassItem[] = [
  {
    id: "class-1",
    timeHour: "۰۸:۰۰",
    timePeriod: "صبح",
    name: "کراس‌فیت",
    coach: "مربی: سینا رادمنش",
    percentage: 75,
    capacityText: "۱۸ از ۲۴ نفر",
  },
  {
    id: "class-2",
    timeHour: "۱۰:۳۰",
    timePeriod: "صبح",
    name: "یوگا و کشش",
    coach: "مربی: نگار اسدی",
    percentage: 50,
    capacityText: "۱۰ از ۲۰ نفر",
  },
  {
    id: "class-3",
    timeHour: "۱۷:۰۰",
    timePeriod: "عصر",
    name: "بدنسازی پیشرفته",
    coach: "مربی: کاوه مرادی",
    percentage: 100,
    capacityText: "تکمیل · ۳۰ از ۳۰ نفر",
    isFull: true,
  },
  {
    id: "class-4",
    timeHour: "۱۹:۳۰",
    timePeriod: "شب",
    name: "پیلاتس",
    coach: "مربی: مریم توکلی",
    percentage: 40,
    capacityText: "۸ از ۲۰ نفر",
  },
];

export function TodayClasses() {
  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">کلاس‌های امروز</h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">۶ جلسه فعال</div>
        </div>
        <span className="rounded-full bg-tint px-[11px] py-[5px] text-[11.5px] font-bold text-primary-dark">
          زنده
        </span>
      </div>

      <div className="px-[22px] pt-[6px] pb-[22px]">
        {TODAY_CLASSES.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-[14px] py-[14px]",
              index < TODAY_CLASSES.length - 1 && "border-b border-border",
              index === TODAY_CLASSES.length - 1 && "pb-0",
            )}
          >
            <div className="w-[58px] shrink-0 rounded-[10px] bg-bg px-[4px] py-[8px] text-center">
              <div className="text-[15px] font-extrabold text-ink">{item.timeHour}</div>
              <div className="text-[11px] text-ink-faint">{item.timePeriod}</div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-ink">{item.name}</div>
              <div className="mt-[2px] text-[12.5px] text-ink-faint">{item.coach}</div>
              <div className="mt-[7px]">
                <div className="h-[6px] overflow-hidden rounded-full bg-bg">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      item.isFull
                        ? "bg-gradient-to-r from-[#F59E0B] to-[#EF4444]"
                        : "bg-gradient-to-r from-primary to-cyan",
                    )}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="mt-[5px] text-[11.5px] font-semibold text-ink-faint">
                  {item.capacityText}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
