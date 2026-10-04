"use client";

import { useMemo } from "react";
import { useClasses } from "@/lib/hooks/queries/use-classes";
import { getClassRoster } from "@/components/admin/classes/roster-store";
import { INITIAL_CLASSES } from "@/components/admin/classes/types";
import { toPersianDigits } from "@/lib/persian-digits";

interface TopClassItem {
  rank: string;
  name: string;
  coach: string;
  enrolled: number;
  capacity: number;
  percent: number;
}

export function TopClassesList() {
  const { data: backendClasses } = useClasses();

  const topClasses: TopClassItem[] = useMemo(() => {
    const rawList: any[] = Array.isArray(backendClasses)
      ? backendClasses
      : Array.isArray((backendClasses as any)?.results)
        ? (backendClasses as any).results
        : Array.isArray((backendClasses as any)?.classes)
          ? (backendClasses as any).classes
          : INITIAL_CLASSES;

    const listWithStats = rawList.map((cls) => {
      const name = cls.title || cls.name || "کلاس ورزشی";
      const coach = cls.coach_name || cls.coach || "";
      const capacity = cls.capacity || 20;
      const roster = getClassRoster(String(cls.id));
      const enrolled = roster.length > 0 ? roster.length : (cls.booked ?? cls.enrolled ?? 12);
      const percent = capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0;

      return {
        name,
        coach,
        enrolled,
        capacity,
        percent,
      };
    });

    // Sort by percent desc, then enrolled desc
    listWithStats.sort((a, b) => b.percent - a.percent || b.enrolled - a.enrolled);

    // Take top 5
    const persianRanks = ["۱", "۲", "۳", "۴", "۵"];
    return listWithStats.slice(0, 5).map((item, idx) => ({
      ...item,
      rank: persianRanks[idx] || String(idx + 1),
    }));
  }, [backendClasses]);

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] print-avoid-break">
      <div className="flex items-center justify-between border-b border-border p-[20px_22px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">
            پرطرفدارترین کلاس‌ها
          </h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">
            بر اساس درصد تکمیل ظرفیت و اعضا
          </div>
        </div>
        <span className="rounded-full bg-tint px-[11px] py-[5px] text-[11.5px] font-bold text-primary-dark">
          زنده
        </span>
      </div>

      <div className="p-[22px]">
        <div className="flex flex-col gap-[16px]">
          {topClasses.map((cls, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-[7px] flex items-center justify-between">
                <div className="flex items-center gap-[9px] min-w-0">
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-tint text-[12px] font-extrabold text-primary-dark">
                    {cls.rank}
                  </span>
                  <div className="min-w-0 truncate">
                    <span className="text-[13.5px] font-bold text-ink truncate block">
                      {cls.name}
                    </span>
                    {cls.coach && (
                      <span className="text-[11px] text-ink-faint block truncate">
                        مربی: {cls.coach}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-[6px] shrink-0">
                  <span className="text-[11.5px] font-medium text-ink-faint">
                    ({toPersianDigits(cls.enrolled)}/{toPersianDigits(cls.capacity)})
                  </span>
                  <span className="text-[12.5px] font-bold text-ink-soft">
                    {toPersianDigits(cls.percent)}٪
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-[7px] overflow-hidden rounded-full bg-bg">
                <div
                  style={{ width: `${cls.percent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-[#22D3EE] transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
