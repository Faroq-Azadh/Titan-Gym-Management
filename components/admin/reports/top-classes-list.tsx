"use client";

import { toPersianDigits } from "@/lib/persian-digits";

export function TopClassesList() {
  const classes = [
    { rank: "۱", name: "کراس‌فیت", percent: 92 },
    { rank: "۲", name: "بدنسازی", percent: 85 },
    { rank: "۳", name: "یوگا", percent: 64 },
    { rank: "۴", name: "پیلاتس", percent: 51 },
    { rank: "۵", name: "TRX", percent: 43 },
  ];

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] print-avoid-break">
      <div className="flex items-center justify-between border-b border-border p-[20px_22px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">
            پرطرفدارترین کلاس‌ها
          </h3>
        </div>
        <span className="rounded-full bg-tint px-[11px] py-[5px] text-[11.5px] font-bold text-primary-dark">
          این ماه
        </span>
      </div>

      <div className="p-[22px]">
        <div className="flex flex-col gap-[16px]">
          {classes.map((cls, index) => (
            <div key={index} className="flex flex-col">
              <div className="mb-[7px] flex items-center justify-between">
                <span className="flex items-center gap-[9px] text-[13.5px] font-bold text-ink">
                  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-tint text-[12px] font-extrabold text-primary-dark">
                    {cls.rank}
                  </span>
                  {cls.name}
                </span>
                <span className="text-[12.5px] font-bold text-ink-soft">
                  {toPersianDigits(cls.percent)}٪
                </span>
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
