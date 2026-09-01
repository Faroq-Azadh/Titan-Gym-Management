"use client";

import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/persian-digits";

export function PeakHoursChart() {
  const data = [
    { hour: "8", height: "30%", muted: true },
    { hour: "10", height: "45%", muted: true },
    { hour: "12", height: "60%", muted: false },
    { hour: "14", height: "40%", muted: true },
    { hour: "17", height: "78%", muted: false },
    { hour: "19", height: "100%", muted: false },
    { hour: "21", height: "68%", muted: false },
  ];

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] print-avoid-break">
      <div className="border-b border-border p-[20px_22px]">
        <h3 className="text-[16px] font-extrabold text-ink">ساعات اوج مراجعه</h3>
        <div className="mt-[3px] text-[12.5px] text-ink-faint">
          میانگین هفته
        </div>
      </div>

      <div className="p-[22px]">
        <div className="flex h-[180px] items-end justify-between gap-[10px] pt-[10px]">
          {data.map((col, index) => (
            <div
              key={index}
              className="flex h-full flex-1 flex-col items-center justify-end gap-[8px]"
            >
              <div
                style={{ height: col.height }}
                className={cn(
                  "w-full max-w-[30px] rounded-t-[8px] transition-all duration-200 hover:opacity-85",
                  col.muted
                    ? "bg-tint"
                    : "bg-gradient-to-b from-primary to-[#22D3EE]",
                )}
              />
              <span className="text-[11px] font-semibold text-ink-faint">
                {toPersianDigits(col.hour)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
