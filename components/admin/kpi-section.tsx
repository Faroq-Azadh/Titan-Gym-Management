"use client";

import { cn } from "@/lib/utils";

interface KpiItem {
  id: string;
  icon: React.ReactNode;
  trend: {
    value: string;
    isUp: boolean;
  };
  value: string;
  label: string;
}

const KPI_DATA: KpiItem[] = [
  {
    id: "active-members",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[22px] w-[22px]"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
    trend: { value: "۸٪", isUp: true },
    value: "۱٬۲۴۸",
    label: "اعضای فعال",
  },
  {
    id: "monthly-revenue",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[22px] w-[22px]"
      >
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    trend: { value: "۱۲٪", isUp: true },
    value: "۲۴۸ م",
    label: "درآمد این ماه (تومان)",
  },
  {
    id: "today-bookings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[22px] w-[22px]"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
      </svg>
    ),
    trend: { value: "۵٪", isUp: true },
    value: "۳۲۶",
    label: "رزرو امروز",
  },
  {
    id: "retention-rate",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[22px] w-[22px]"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
    trend: { value: "۲٪", isUp: false },
    value: "۹۴٪",
    label: "نرخ تمدید عضویت",
  },
];

export function KpiSection() {
  return (
    <section className="mb-[18px] grid grid-cols-1 gap-[18px] min-[640px]:grid-cols-2 min-[1101px]:grid-cols-4">
      {KPI_DATA.map((kpi) => (
        <div
          key={kpi.id}
          className="flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
              {kpi.icon}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-[4px] rounded-full px-[9px] py-[4px] text-[12.5px] font-bold",
                kpi.trend.isUp
                  ? "bg-tint text-primary-dark"
                  : "bg-[#FFF1F2] text-[#E11D48]",
              )}
            >
              {kpi.trend.isUp ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="h-[13px] w-[13px]"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="h-[13px] w-[13px]"
                >
                  <path d="M17 7 7 17M15 17H7V9" />
                </svg>
              )}
              <span>{kpi.trend.value}</span>
            </span>
          </div>
          <div className="text-[28px] font-extrabold leading-none text-ink">
            {kpi.value}
          </div>
          <div className="text-[13.5px] font-medium text-ink-soft">
            {kpi.label}
          </div>
        </div>
      ))}
    </section>
  );
}
