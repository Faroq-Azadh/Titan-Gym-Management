"use client";

import { useState } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";
import { toPersianDigits } from "@/lib/persian-digits";

export default function CoachAttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkins = [
    { id: "1", name: "سارا محمدی", time: "۰۸:۱۵", status: "حاضر", type: "جلسه خصوصی" },
    { id: "2", name: "رضا کاظمی", time: "۱۰:۰۵", status: "حاضر", type: "تمرین آزاد" },
    { id: "3", name: "امیر صادقی", time: "۱۹:۳۵", status: "حاضر", type: "تمرین قدرتی" },
    { id: "4", name: "کیان مرادی", time: "۲۰:۱۰", status: "حاضر", type: "جلسه مشاوره" },
  ];

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">حضور و غیاب</h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">ثبت و پیگیری ورود و خروج شاگردان</div>
            </div>
            <Link href="/coach" className="btn btn-outline btn-sm">داشبورد</Link>
          </div>

          <div className="card bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h3 className="text-[16px] font-bold text-ink mb-4">ورودهای ثبت‌شده‌ی امروز</h3>
            <div className="flex flex-col divide-y divide-border">
              {checkins.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-tint text-primary-dark font-bold text-[13px]">
                      {item.name.slice(0, 2)}
                    </span>
                    <div>
                      <div className="text-[14px] font-bold text-ink">{item.name}</div>
                      <div className="text-[12px] text-ink-faint">{item.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-semibold text-ink-soft">{toPersianDigits(item.time)}</span>
                    <span className="status-badge active bg-tint text-primary-dark px-3 py-1 rounded-full text-[12px] font-bold">
                      <span className="d h-1.5 w-1.5 rounded-full bg-primary" />
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
