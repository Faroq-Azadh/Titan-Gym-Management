"use client";

import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/persian-digits";
import { PlanItem } from "./types";
import { Trash2 } from "lucide-react";

interface PlansTableProps {
  plans: PlanItem[];
  onEditPlan: (plan: PlanItem) => void;
  onDeletePlan: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function PlansTable({
  plans,
  onEditPlan,
  onDeletePlan,
  onToggleStatus,
}: PlansTableProps) {
  return (
    <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      {/* Table Head */}
      <div className="flex items-center justify-between border-b border-border p-[20px_22px]">
        <div>
          <h3 className="text-[16px] font-extrabold text-ink">همه‌ی پلن‌ها</h3>
          <div className="mt-[2px] text-[12.5px] text-ink-faint">
            جزئیات و وضعیت تعرفه‌ها
          </div>
        </div>

        <span className="rounded-full bg-bg px-[10px] py-[4px] text-[12px] font-bold text-ink-faint border border-border">
          {toPersianDigits(plans.length)} پلن
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-border text-[12px] font-bold text-ink-faint">
              <th className="p-[14px_20px]">پلن</th>
              <th className="p-[14px_20px]">قیمت</th>
              <th className="p-[14px_20px]">مدت</th>
              <th className="p-[14px_20px]">اعضای فعال</th>
              <th className="p-[14px_20px]">وضعیت</th>
              <th className="p-[14px_20px] text-left">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-[36px] text-center text-ink-faint">
                  هیچ پلنی یافت نشد.
                </td>
              </tr>
            ) : (
              plans.map((plan) => {
                const isActive = plan.status === "active";

                return (
                  <tr
                    key={plan.id}
                    className="border-b border-border/70 transition-colors hover:bg-bg/50"
                  >
                    {/* Plan Name */}
                    <td className="p-[16px_20px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-semibold text-ink text-[13.5px]">{plan.name}</span>
                        {plan.featured && (
                          <span className="rounded-full bg-tint px-[6px] py-[1px] text-[10px] font-bold text-primary-dark">
                            ویژه
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-[16px_20px] text-[14px] text-ink">
                      {toPersianDigits(plan.price)} هزار تومان
                    </td>

                    {/* Duration */}
                    <td className="p-[16px_20px] text-[14px] text-ink">
                      {toPersianDigits(plan.duration)}
                    </td>

                    {/* Active Members */}
                    <td className="p-[16px_20px] text-[14px] text-ink">
                      {toPersianDigits(plan.activeMembers)}
                    </td>

                    {/* Status badge */}
                    <td className="p-[16px_20px]">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(plan.id)}
                        className={cn(
                          "inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] text-[12px] font-bold transition-all",
                          isActive
                            ? "bg-tint text-primary-dark hover:opacity-80"
                            : "bg-[#FEF2F2] text-[#DC2626] hover:opacity-80",
                        )}
                        title="برای تغییر وضعیت کلیک کنید"
                      >
                        <span
                          className={cn(
                            "h-[6px] w-[6px] rounded-full",
                            isActive ? "bg-primary-dark" : "bg-[#DC2626]",
                          )}
                        />
                        <span>{isActive ? "فعال" : "غیرفعال"}</span>
                      </button>
                    </td>

                    {/* Row actions */}
                    <td className="p-[16px_20px] text-left">
                      <div className="flex items-center justify-end gap-[6px]">
                        <button
                          type="button"
                          onClick={() => onEditPlan(plan)}
                          className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-ink-soft transition-colors hover:bg-bg hover:text-ink"
                          aria-label="ویرایش پلن"
                          title="ویرایش"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-[16px] w-[16px]"
                          >
                            <path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`آیا از حذف پلن «${plan.name}» اطمینان دارید؟`)) {
                              onDeletePlan(plan.id);
                            }
                          }}
                          className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-ink-faint transition-colors hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          aria-label="حذف پلن"
                          title="حذف"
                        >
                          <Trash2 className="h-[15px] w-[15px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
