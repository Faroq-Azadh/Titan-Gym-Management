export function AboutStats() {
  const stats = [
    { num: "۵۰۰", symbol: "+", label: "باشگاه فعال" },
    { num: "۵۰", symbol: "هزار+", label: "ورزشکار ثبت‌شده" },
    { num: "۹۹.۹", symbol: "٪", label: "پایداری سرویس" },
    { num: "۴۵", symbol: " روز", label: "استفاده‌ی رایگان" },
  ];

  return (
    <section className="border-y border-border bg-surface py-14">
      <div className="mx-auto max-w-[1240px] px-5 min-[640px]:px-8">
        <div className="grid grid-cols-2 gap-7 min-[981px]:grid-cols-4 min-[981px]:gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="px-2 text-center">
              <div className="mb-2 text-[28px] font-black leading-tight text-ink min-[640px]:text-[34px] min-[981px]:text-[40px]">
                {s.num}
                <span className="text-primary-dark">{s.symbol}</span>
              </div>
              <div className="text-[13.5px] font-semibold leading-[1.7] text-ink-faint">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
