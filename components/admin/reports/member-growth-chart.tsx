"use client";

export function MemberGrowthChart() {
  const data = [
    { label: "فرو", height: "42%" },
    { label: "ارد", height: "55%" },
    { label: "خرد", height: "48%" },
    { label: "تیر", height: "70%" },
    { label: "مرد", height: "64%" },
    { label: "شهر", height: "85%" },
    { label: "مهر", height: "100%" },
  ];

  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] print-avoid-break">
      <div className="border-b border-border p-[20px_22px]">
        <h3 className="text-[16px] font-extrabold text-ink">رشد اعضا</h3>
        <div className="mt-[3px] text-[12.5px] text-ink-faint">
          عضویت جدید در ماه
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
                className="w-full max-w-[30px] rounded-t-[8px] bg-gradient-to-b from-primary to-[#22D3EE] transition-all duration-200 hover:opacity-85"
              />
              <span className="text-[11px] font-semibold text-ink-faint">
                {col.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
