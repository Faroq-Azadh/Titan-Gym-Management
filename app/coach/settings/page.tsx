"use client";

import { useState } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";

export default function CoachSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifySessions, setNotifySessions] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">تنظیمات حساب مربی</h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">تنظیم اعلانات، برنامه کاری و دسترسی‌ها</div>
            </div>
            <Link href="/coach" className="btn btn-outline btn-sm">داشبورد</Link>
          </div>

          <div className="card bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] max-w-2xl">
            <h3 className="text-[16px] font-bold text-ink mb-4">تنظیمات اعلانات</h3>
            <div className="flex flex-col divide-y divide-border">
              <div className="flex items-center justify-between py-4">
                <div>
                  <div className="text-[14px] font-bold text-ink">یادآوری جلسات تمرینی</div>
                  <div className="text-[12.5px] text-ink-faint">ارسال اعلان پیش از شروع هر جلسه شاگرد</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifySessions}
                  onChange={(e) => setNotifySessions(e.target.checked)}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <div className="text-[14px] font-bold text-ink">پیام‌های جدید شاگردان</div>
                  <div className="text-[12.5px] text-ink-faint">اعلان پیام‌های ارسالی در پنل ارتباطی</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMessages}
                  onChange={(e) => setNotifyMessages(e.target.checked)}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
