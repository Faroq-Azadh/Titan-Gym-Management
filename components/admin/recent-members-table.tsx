"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  avatarText: string;
  avatarGradient: string;
  plan: string;
  expiryDate: string;
  status: "active" | "expiring" | "expired";
  statusText: string;
}

const MEMBERS_DATA: MemberRecord[] = [
  {
    id: "m-1",
    name: "پریا احمدی",
    email: "paria@mail.com",
    avatarText: "پا",
    avatarGradient: "linear-gradient(135deg, #16E0A0, #22D3EE)",
    plan: "طلایی",
    expiryDate: "۱۴۰۴/۰۹/۱۲",
    status: "active",
    statusText: "فعال",
  },
  {
    id: "m-2",
    name: "رضا کریمی",
    email: "reza.k@mail.com",
    avatarText: "رک",
    avatarGradient: "linear-gradient(135deg, #6366F1, #22D3EE)",
    plan: "نقره‌ای",
    expiryDate: "۱۴۰۴/۰۷/۰۳",
    status: "expiring",
    statusText: "رو به اتمام",
  },
  {
    id: "m-3",
    name: "مهسا نوری",
    email: "mahsa.n@mail.com",
    avatarText: "من",
    avatarGradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    plan: "طلایی",
    expiryDate: "۱۴۰۵/۰۱/۲۰",
    status: "active",
    statusText: "فعال",
  },
  {
    id: "m-4",
    name: "آرش محمدی",
    email: "arash.m@mail.com",
    avatarText: "آم",
    avatarGradient: "linear-gradient(135deg, #0EA5E9, #16E0A0)",
    plan: "برنزی",
    expiryDate: "۱۴۰۴/۰۶/۱۵",
    status: "expired",
    statusText: "منقضی",
  },
  {
    id: "m-5",
    name: "سارا طاهری",
    email: "sara.t@mail.com",
    avatarText: "سط",
    avatarGradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    plan: "طلایی",
    expiryDate: "۱۴۰۴/۱۱/۰۸",
    status: "active",
    statusText: "فعال",
  },
];

export function RecentMembersTable() {
  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">اعضای اخیر</h3>
          <div className="mt-[3px] text-[12.5px] text-ink-faint">
            آخرین عضویت‌ها و وضعیت
          </div>
        </div>
        <Link
          href="/admin/members"
          className="inline-flex items-center justify-center gap-[8px] whitespace-nowrap rounded-[10px] border-[1.5px] border-border bg-surface px-[14px] py-[8px] text-[13px] font-semibold text-ink transition-all duration-200 hover:border-primary hover:bg-tint"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                عضو
              </th>
              <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                پلن
              </th>
              <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                تاریخ انقضا
              </th>
              <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                وضعیت
              </th>
              <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint" />
            </tr>
          </thead>
          <tbody>
            {MEMBERS_DATA.map((member, index) => (
              <tr
                key={member.id}
                className={cn(
                  "transition-colors duration-150 hover:bg-bg",
                  index < MEMBERS_DATA.length - 1 && "border-b border-border",
                )}
              >
                <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                  <div className="flex items-center gap-[11px]">
                    <span
                      className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] text-[13px] font-bold text-white"
                      style={{ background: member.avatarGradient }}
                    >
                      {member.avatarText}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-bold text-ink">
                        {member.name}
                      </div>
                      <div className="text-[12px] text-ink-faint">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                  {member.plan}
                </td>

                <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                  {member.expiryDate}
                </td>

                <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                  <span
                    className={cn(
                      "inline-flex items-center gap-[6px] rounded-full px-[11px] py-[5px] text-[12px] font-bold",
                      member.status === "active" && "bg-tint text-primary-dark",
                      member.status === "expiring" && "bg-[#FFFBEB] text-[#B45309]",
                      member.status === "expired" && "bg-[#FFF1F2] text-[#9F1239]",
                    )}
                  >
                    <span
                      className={cn(
                        "h-[6px] w-[6px] rounded-full",
                        member.status === "active" && "bg-primary",
                        member.status === "expiring" && "bg-[#F59E0B]",
                        member.status === "expired" && "bg-[#F43F5E]",
                      )}
                    />
                    {member.statusText}
                  </span>
                </td>

                <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                  <button
                    type="button"
                    className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-ink-faint transition-colors duration-150 hover:bg-tint hover:text-primary-dark"
                    aria-label="عملیات بیشتر"
                  >
                    <MoreVertical className="h-[18px] w-[18px] stroke-[2]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
