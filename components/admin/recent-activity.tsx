"use client";

import Link from "next/link";
import { useOwnerDashboard } from "@/lib/hooks/queries/use-owner-dashboard";
import type { RecentActivityEvent } from "@/lib/api/services/gyms.service";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  activities?: RecentActivityEvent[];
  isLoading?: boolean;
}

function getRelativeTime(timestamp: string): string {
  if (!timestamp) return "به تازگی";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const fa = (n: number) => n.toLocaleString("fa-IR");

    if (diffMin < 1) return "همین الان";
    if (diffMin < 60) return `${fa(diffMin)} دقیقه پیش`;
    if (diffHour < 24) return `${fa(diffHour)} ساعت پیش`;
    if (diffDay === 1) return "دیروز";
    if (diffDay < 7) return `${fa(diffDay)} روز پیش`;
    return date.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
  } catch {
    return timestamp;
  }
}

function getActivityConfig(type: string) {
  const upper = (type || "").toUpperCase();
  switch (upper) {
    case "PAYMENT":
      return {
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
      };
    case "ALERT":
    case "WARNING":
      return {
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
      };
    case "CLASS":
    case "TRAINING":
      return {
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
      };
    default:
      return {
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
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ),
      };
  }
}

export function RecentActivity({ activities: propActivities, isLoading: propLoading }: RecentActivityProps) {
  const { data: dashboard, isLoading: queryLoading } = useOwnerDashboard();
  const activities = propActivities ?? dashboard?.recent_activity;
  const isLoading = propLoading ?? queryLoading;

  const items = activities && activities.length > 0 ? activities : [];

  if (isLoading && !activities) {
    return (
      <div className="rounded-[16px] border border-border bg-surface p-[22px] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-border pb-[16px]">
          <div className="h-[20px] w-[120px] animate-pulse rounded bg-bg" />
        </div>
        <div className="flex flex-col gap-[14px] pt-[16px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex h-[50px] animate-pulse items-center gap-[12px] rounded bg-bg/50" />
          ))}
        </div>
      </div>
    );
  }

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
        {items.length === 0 ? (
          <div className="py-8 text-center text-[13.5px] text-ink-faint">
            فعالیت اخیری برای نمایش وجود ندارد.
          </div>
        ) : (
          items.map((item, index) => {
            const config = getActivityConfig(item.type);
            const timeStr = getRelativeTime(item.timestamp);

            return (
              <div
                key={index}
                className={cn(
                  "flex gap-[13px] py-[14px]",
                  index < items.length - 1 && "border-b border-border",
                  index === items.length - 1 && "pb-0",
                )}
              >
                <span
                  className={cn(
                    "flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px]",
                    config.variant === "emerald" && "bg-tint text-primary-dark",
                    config.variant === "cyan" && "bg-[#22D3EE]/12 text-[#0891B2]",
                    config.variant === "amber" && "bg-[#FFFBEB] text-[#B45309]",
                  )}
                >
                  {config.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium leading-[1.6] text-ink">
                    {item.text}
                  </div>
                  <div className="mt-[3px] text-[11.5px] text-ink-faint">{timeStr}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

