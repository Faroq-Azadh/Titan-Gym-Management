"use client";

import React from "react";
import { useMembers } from "@/lib/hooks/queries/use-members";
import { useOwnerDashboard } from "@/lib/hooks/queries/use-owner-dashboard";
import { toPersianDigits } from "@/lib/persian-digits";

interface MembersKpiProps {
  totalCount?: number;
  activeCount?: number;
  expiringCount?: number;
  newCount?: number;
}

export function MembersKpi({
  totalCount,
  activeCount,
  expiringCount,
  newCount,
}: MembersKpiProps) {
  const { data: membersResponse } = useMembers();
  const { data: dashboard } = useOwnerDashboard();

  const members: any[] = Array.isArray(membersResponse)
    ? membersResponse
    : Array.isArray(membersResponse?.results)
      ? membersResponse.results
      : [];
  const total = totalCount ?? (membersResponse?.count ?? members.length);
  const active = activeCount ?? members.filter((m) => m.status === "active" || m.status === "فعال" || m.membership_status === "active" || m.is_active === true).length;
  const expiring = expiringCount ?? members.filter((m) => m.status === "expiring" || m.status === "رو به اتمام" || m.membership_status === "expiring").length;
  const newThisMonth = newCount ?? members.length;

  return (
    <div className="mb-[18px] grid grid-cols-1 gap-[18px] min-[640px]:grid-cols-2 min-[1101px]:grid-cols-4">
      {/* KPI 1: کل اعضا */}
      <div className="group flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
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
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
        </div>
        <div className="text-[28px] font-extrabold leading-none text-ink">
          {toPersianDigits(total)}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          کل اعضا
        </div>
      </div>

      {/* KPI 2: عضو فعال */}
      <div className="group flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[22px] w-[22px]"
            >
              <path d="m9 12 2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </span>
        </div>
        <div className="text-[28px] font-extrabold leading-none text-ink">
          {toPersianDigits(active)}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          عضو فعال
        </div>
      </div>

      {/* KPI 3: رو به اتمام */}
      <div className="group flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#FFFBEB] text-[#D97706]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[22px] w-[22px]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </span>
        </div>
        <div className="text-[28px] font-extrabold leading-none text-ink">
          {toPersianDigits(expiring)}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          رو به اتمام
        </div>
      </div>

      {/* KPI 4: عضو جدید */}
      <div className="group flex flex-col gap-[14px] rounded-[16px] border border-border bg-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[22px] w-[22px]"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </div>
        <div className="text-[28px] font-extrabold leading-none text-ink">
          {toPersianDigits(newThisMonth)}
        </div>
        <div className="text-[13.5px] font-medium text-ink-soft">
          عضو جدید
        </div>
      </div>
    </div>
  );
}
