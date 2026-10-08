"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";
import { toPersianDigits } from "@/lib/persian-digits";

export default function CoachProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const coachName = user?.full_name?.trim() || "آرش رستمی";
  const initials = coachName.slice(0, 2);

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Header */}
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">پروفایل مربی</h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">اطلاعات فردی، تخصص‌ها و گواهی‌نامه‌های ورزشی</div>
            </div>
            <Link href="/coach" className="btn btn-outline btn-sm">بازگشت به داشبورد</Link>
          </div>

          {/* Profile Card */}
          <div className="card bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] mb-6">
            <div className="flex items-center gap-5 flex-wrap">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-primary to-cyan text-[28px] font-extrabold text-ink shadow-[0_8px_24px_rgba(22,224,160,0.25)]">
                {initials}
              </span>
              <div>
                <h2 className="text-[20px] font-extrabold text-ink">{coachName}</h2>
                <div className="text-[13.5px] text-ink-faint mt-1 flex items-center gap-2">
                  <span>مربی ارشد بدنسازی و فیتنس</span>
                  <span>•</span>
                  <span>مدرک بین‌المللی IFBB</span>
                </div>
              </div>

              <div className="mr-auto flex gap-3 flex-wrap">
                <div className="bg-bg rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                  <div className="text-[18px] font-extrabold text-ink">{toPersianDigits(38)}</div>
                  <div className="text-[11px] text-ink-faint">شاگردان</div>
                </div>
                <div className="bg-bg rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                  <div className="text-[18px] font-extrabold text-ink">{toPersianDigits(6)} سال</div>
                  <div className="text-[11px] text-ink-faint">سابقه</div>
                </div>
                <div className="bg-bg rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                  <div className="text-[18px] font-extrabold text-ink">۴.۹ ★</div>
                  <div className="text-[11px] text-ink-faint">امتیاز</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
            <div className="card bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <h3 className="text-[16px] font-bold text-ink mb-4">تخصص‌ها و حوزه‌های تمرین</h3>
              <div className="flex flex-wrap gap-2">
                <span className="pill text-[12px] font-bold text-primary-dark bg-tint px-3 py-1.5 rounded-full">بدنسازی و هایپرتروفی</span>
                <span className="pill text-[12px] font-bold text-primary-dark bg-tint px-3 py-1.5 rounded-full">برنامه‌ریزی چربی‌سوزی</span>
                <span className="pill text-[12px] font-bold text-primary-dark bg-tint px-3 py-1.5 rounded-full">تمرینات قدرتی و پاورلیفتینگ</span>
                <span className="pill text-[12px] font-bold text-primary-dark bg-tint px-3 py-1.5 rounded-full">طراحی رژیم مکمل</span>
              </div>
            </div>

            <div className="card bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <h3 className="text-[16px] font-bold text-ink mb-4">بیوگرافی و درباره مربی</h3>
              <p className="text-[13.5px] text-ink-soft leading-[1.8]">
                مربی رسمی فدراسیون بدنسازی با بیش از ۶ سال سابقه در مربیگری تخصصی و آماده‌سازی ورزشکاران برای اهداف حجم، کات و ارتقای آمادگی جسمانی. تمرکز اصلی بر اجرای صحیح حرکات و پیشگیری از آسیب‌دیدگی‌های مفصلی.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
