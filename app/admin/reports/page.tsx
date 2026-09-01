"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ReportsKpi } from "@/components/admin/reports/reports-kpi";
import { RevenueChart } from "@/components/admin/reports/revenue-chart";
import { PlansDonut } from "@/components/admin/reports/plans-donut";
import { MemberGrowthChart } from "@/components/admin/reports/member-growth-chart";
import { PeakHoursChart } from "@/components/admin/reports/peak-hours-chart";
import { TopClassesList } from "@/components/admin/reports/top-classes-list";

export default function AdminReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range, setRange] = useState<"7days" | "30days" | "year">("30days");

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-bg text-ink print:bg-white">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar Header */}
        <AdminTopbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          searchPlaceholder="جستجو در گزارش‌ها و آمار…"
        />

        {/* Page Content */}
        <main className="flex-1 p-[18px] min-[640px]:p-[28px] print:p-0 print:m-0 print:w-full">
          {/* Page Head */}
          <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px] print:mb-[16px]">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink min-[640px]:text-[26px]">
                گزارش‌ها
              </h1>
              <div className="mt-[5px] text-[14px] text-ink-faint">
                تحلیل عملکرد باشگاه، درآمد و رفتار اعضا
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-[10px] print:hidden">
              {/* Range Segment Switcher */}
              <div className="flex gap-[4px] rounded-[10px] bg-surface border border-border p-[4px]">
                <button
                  type="button"
                  onClick={() => setRange("7days")}
                  className={cn(
                    "rounded-[8px] px-[12px] py-[6px] text-[12.5px] font-bold transition-all duration-180",
                    range === "7days"
                      ? "bg-bg text-ink shadow-xs"
                      : "text-ink-faint hover:text-ink",
                  )}
                >
                  ۷ روز
                </button>
                <button
                  type="button"
                  onClick={() => setRange("30days")}
                  className={cn(
                    "rounded-[8px] px-[12px] py-[6px] text-[12.5px] font-bold transition-all duration-180",
                    range === "30days"
                      ? "bg-bg text-ink shadow-xs"
                      : "text-ink-faint hover:text-ink",
                  )}
                >
                  ۳۰ روز
                </button>
                <button
                  type="button"
                  onClick={() => setRange("year")}
                  className={cn(
                    "rounded-[8px] px-[12px] py-[6px] text-[12.5px] font-bold transition-all duration-180",
                    range === "year"
                      ? "bg-bg text-ink shadow-xs"
                      : "text-ink-faint hover:text-ink",
                  )}
                >
                  امسال
                </button>
              </div>

              {/* PDF Export Button */}
              <button
                type="button"
                onClick={handlePrintPdf}
                className="inline-flex items-center justify-center gap-[8px] rounded-[10px] border-[1.5px] border-border bg-surface px-[14px] py-[8px] text-[13px] font-semibold text-ink transition-all duration-200 hover:border-primary hover:bg-tint"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>خروجی PDF</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <ReportsKpi />

          {/* Revenue Trend + Plan Distribution (Grid 2: 1.5fr / 1fr) */}
          <section className="mb-[18px] grid grid-cols-1 gap-[18px] min-[900px]:grid-cols-[1.5fr_1fr] print-grid-2">
            <RevenueChart />
            <PlansDonut />
          </section>

          {/* Member Growth + Peak Hours + Top Classes (Grid 3: 1fr / 1fr / 1fr) */}
          <section className="grid grid-cols-1 gap-[18px] min-[640px]:grid-cols-2 min-[900px]:grid-cols-3 print-grid-3">
            <MemberGrowthChart />
            <PeakHoursChart />
            <TopClassesList />
          </section>
        </main>
      </div>
    </div>
  );
}
