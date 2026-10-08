"use client";

import { useState } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";
import { toPersianDigits } from "@/lib/persian-digits";

export default function CoachProgramsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const programs = [
    { id: "1", title: "برنامه‌ی حجم ۴ روزه", level: "پیشرفته", duration: "۸ هفته", assignedStudents: 14 },
    { id: "2", title: "برنامه‌ی چربی‌سوزی HIIT", level: "متوسط", duration: "۶ هفته", assignedStudents: 11 },
    { id: "3", title: "برنامه‌ی قدرت و توان عضلانی", level: "حرفه‌ای", duration: "۱۲ هفته", assignedStudents: 8 },
    { id: "4", title: "برنامه‌ی شروع و تناسب پایه", level: "مقدماتی", duration: "۴ هفته", assignedStudents: 5 },
  ];

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">برنامه‌های تمرینی</h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">طراحی، بازبینی و تخصیص روتین‌های بدنسازی و تغذیه</div>
            </div>
            <Link href="/coach" className="btn btn-outline btn-sm">داشبورد</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
            {programs.map((p) => (
              <div key={p.id} className="card bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="pill text-[11.5px] font-bold text-primary-dark bg-tint px-[11px] py-[5px] rounded-full">
                    سطح: {p.level}
                  </span>
                  <span className="text-[13px] font-bold text-ink-faint">
                    طول دوره: {p.duration}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-ink mb-2">{p.title}</h3>
                <div className="flex items-center justify-between text-[13px] text-ink-soft border-t border-border pt-3 mt-3">
                  <span>شاگردان اختصاص‌یافته:</span>
                  <span className="font-bold text-ink">{toPersianDigits(p.assignedStudents)} نفر</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
