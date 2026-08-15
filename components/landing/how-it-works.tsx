export function LandingHowItWorks() {
  const steps = [
    {
      num: "۱",
      title: "ثبت‌نام باشگاه",
      desc: "اطلاعات باشگاه، شعبه‌ها و مربیان را در چند دقیقه وارد کنید.",
    },
    {
      num: "۲",
      title: "افزودن اعضا",
      desc: "لیست اعضای فعلی را وارد یا از فایل اکسل وارد کنید.",
    },
    {
      num: "۳",
      title: "تنظیم کلاس‌ها",
      desc: "برنامه هفتگی کلاس‌ها و مربیان را در تقویم تعریف کنید.",
    },
    {
      num: "۴",
      title: "شروع فعالیت",
      desc: "اعضا از همان روز رزرو، پرداخت و پیگیری را شروع می‌کنند.",
    },
  ];

  return (
    <section id="how" className="py-20 min-[640px]:py-[110px]">
      <div className="mx-auto max-w-[1240px] px-5 min-[640px]:px-8">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <span className="mb-3.5 inline-block text-[13px] font-bold tracking-wide text-primary-dark">
            نحوه شروع کار
          </span>
          <h2 className="mb-4 text-[28px] font-extrabold leading-[1.3] text-ink min-[640px]:text-[36px] min-[981px]:text-[42px]">
            در کمتر از یک روز، باشگاه‌تان آنلاین می‌شود
          </h2>
          <p className="text-[16px] leading-[1.8] text-ink-soft">
            چهار قدم ساده تا راه‌اندازی کامل، بدون نیاز به دانش فنی.
          </p>
        </div>

        <div className="relative">
          {/* Dashed background line for desktop */}
          <div className="absolute top-9 left-0 right-0 hidden h-[2px] border-t-2 border-dashed border-border min-[981px]:block" />

          <div className="relative z-10 grid grid-cols-1 gap-6 min-[640px]:grid-cols-2 min-[981px]:grid-cols-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-start">
                <div
                  className={`mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] bg-surface text-[22px] font-extrabold ${
                    idx % 2 === 0
                      ? "border-primary text-primary-dark"
                      : "border-border text-ink"
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="mb-[10px] text-[16px] font-bold text-ink">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-ink-soft">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
