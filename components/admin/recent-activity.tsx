"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  variant: "emerald" | "cyan" | "amber";
  icon: React.ReactNode;
  content: React.ReactNode;
  time: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    variant: "emerald",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
    content: (
      <>
        <b>پریا احمدی</b> عضویت طلایی خرید کرد.
      </>
    ),
    time: "۵ دقیقه پیش",
  },
  {
    id: "act-2",
    variant: "cyan",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    content: (
      <>
        <b>۱۲ نفر</b> برای کلاس کراس‌فیت صبح ثبت‌نام کردند.
      </>
    ),
    time: "۲۲ دقیقه پیش",
  },
  {
    id: "act-3",
    variant: "emerald",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    content: (
      <>
        پرداخت <b>۲٬۴۰۰٬۰۰۰ تومان</b> با موفقیت تسویه شد.
      </>
    ),
    time: "۱ ساعت پیش",
  },
  {
    id: "act-4",
    variant: "amber",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    content: (
      <>
        عضویت <b>۸ نفر</b> تا پایان هفته منقضی می‌شود.
      </>
    ),
    time: "۳ ساعت پیش",
  },
  {
    id: "act-5",
    variant: "emerald",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    content: (
      <>
        <b>رضا کریمی</b> حضور خود را در باشگاه ثبت کرد.
      </>
    ),
    time: "دیروز · ۲۱:۱۴",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">فعالیت‌های اخیر</h3>
        </div>
        <Link
          href="/admin/activities"
          className="rounded-full bg-tint px-[11px] py-[5px] text-[11.5px] font-bold text-primary-dark"
        >
          همه
        </Link>
      </div>

      <div className="px-[22px] pt-[8px] pb-[22px]">
        {ACTIVITIES.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex gap-[13px] py-[14px]",
              index < ACTIVITIES.length - 1 && "border-b border-border",
              index === ACTIVITIES.length - 1 && "pb-0",
            )}
          >
            <span
              className={cn(
                "flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px]",
                item.variant === "emerald" && "bg-tint text-primary-dark",
                item.variant === "cyan" && "bg-[#22D3EE]/12 text-[#0891B2]",
                item.variant === "amber" && "bg-[#FFFBEB] text-[#B45309]",
              )}
            >
              {item.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-medium leading-[1.6] text-ink">
                {item.content}
              </div>
              <div className="mt-[3px] text-[11.5px] text-ink-faint">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
