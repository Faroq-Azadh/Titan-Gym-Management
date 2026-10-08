"use client";

import { useState } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";

export default function CoachMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messages = [
    { id: "1", sender: "مینا تهرانی", preview: "استاد سلام، توی حرکت اسکوات احساس درد زانو دارم، چکار کنم؟", time: "۲ ساعت پیش", unread: true },
    { id: "2", sender: "رضا کاظمی", preview: "سلام، فردا سانس بعدازظهر می‌تونم بیام؟", time: "۵ ساعت پیش", unread: true },
    { id: "3", sender: "سارا محمدی", preview: "وزن جدیدم رو ثبت کردم، کی برنامه رو آپدیت می‌کنید؟", time: "دیروز", unread: false },
    { id: "4", sender: "امیر صادقی", preview: "تمرین امروز عالی بود، خسته نباشید.", time: "دیروز", unread: false },
  ];

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">پیام‌ها و ارتباط</h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">گفتگوهای مستقیم با شاگردان و اطلاعیه‌ها</div>
            </div>
            <Link href="/coach" className="btn btn-outline btn-sm">داشبورد</Link>
          </div>

          <div className="card bg-surface border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h3 className="text-[16px] font-bold text-ink mb-4">صندوق پیام‌ها</h3>
            <div className="flex flex-col divide-y divide-border">
              {messages.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-4 cursor-pointer hover:bg-bg/40 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan font-bold text-ink text-[13.5px]">
                      {m.sender.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-ink">{m.sender}</span>
                        {m.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-[13px] text-ink-soft truncate mt-0.5">{m.preview}</p>
                    </div>
                  </div>
                  <span className="text-[12px] text-ink-faint shrink-0 mr-4">{m.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
