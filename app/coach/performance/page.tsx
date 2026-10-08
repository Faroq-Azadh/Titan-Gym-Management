"use client";

import { useState } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";
import { toPersianDigits } from "@/lib/persian-digits";

export default function CoachPerformancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">گزارش عملکرد</h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">تحلیل آماری جلسات، پیشرفت شاگردان و شاخص‌های کیفی</div>
            </div>
            <Link href="/coach" className="btn btn-outline btn-sm">داشبورد</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mb-[18px]">
            <div className="card bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <div className="text-[13px] text-ink-faint font-bold mb-1">جلسات برگزار شده این ماه</div>
              <div className="text-[28px] font-extrabold text-ink">{toPersianDigits(96)}</div>
              <div className="text-[12px] text-primary-dark font-semibold mt-2">↑ ۸ جلسه بیشتر از ماه قبل</div>
            </div>
            <div className="card bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <div className="text-[13px] text-ink-faint font-bold mb-1">رضایت شاگردان</div>
              <div className="text-[28px] font-extrabold text-ink">۴.۹ / ۵</div>
              <div className="text-[12px] text-primary-dark font-semibold mt-2">بر اساس ۳۲ نظر ثبت‌شده</div>
            </div>
            <div className="card bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <div className="text-[13px] text-ink-faint font-bold mb-1">نرخ پایبندی به رژیم و تمرین</div>
              <div className="text-[28px] font-extrabold text-ink">٪۸۸</div>
              <div className="text-[12px] text-primary-dark font-semibold mt-2">عالی — بالاتر از میانگین باشگاه</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
