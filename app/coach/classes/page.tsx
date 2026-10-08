"use client";

import { useState } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";
import { toPersianDigits } from "@/lib/persian-digits";

export default function CoachClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const classesList = [
    { id: "1", title: "کلاس کراس‌فیت پیشرفته", time: "۰۸:۰۰ - ۰۹:۳۰", day: "شنبه، دوشنبه، چهارشنبه", enrolled: 18, capacity: 20 },
    { id: "2", title: "بدنسازی و تناسب اندام", time: "۱۰:۳۰ - ۱۲:۰۰", day: "روزهای فرد", enrolled: 15, capacity: 15 },
    { id: "3", title: "تمرینات قدرتی و پاورلیفتینگ", time: "۱۷:۰۰ - ۱۸:۳۰", day: "همه روزه", enrolled: 12, capacity: 16 },
    { id: "4", title: "آمادگی جسمانی و چربی‌سوزی", time: "۱۹:۰۰ - ۲۰:۳۰", day: "شنبه، سه‌شنبه", enrolled: 22, capacity: 25 },
  ];

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">برنامه و کلاس‌ها</h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">برنامه زمانی هفتگی کلاس‌های تحت نظر شما</div>
            </div>
            <Link href="/coach" className="btn btn-outline btn-sm">بازگشت به داشبورد</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
            {classesList.map((item) => (
              <div key={item.id} className="card bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="pill text-[11.5px] font-bold text-primary-dark bg-tint px-[11px] py-[5px] rounded-full">
                    {item.day}
                  </span>
                  <span className="text-[13px] font-bold text-ink-faint">
                    {toPersianDigits(item.time)}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-ink mb-2">{item.title}</h3>
                <div className="flex items-center justify-between text-[13px] text-ink-soft border-t border-border pt-3 mt-3">
                  <span>ظرفیت تکمیل‌شده:</span>
                  <span className="font-bold text-ink">{toPersianDigits(item.enrolled)} از {toPersianDigits(item.capacity)} نفر</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
