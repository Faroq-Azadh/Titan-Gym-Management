"use client";

import { useState } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  attendanceRate: number;
  status: "active" | "expiring" | "expired";
  statusText: string;
}

const INITIAL_STUDENTS: StudentRow[] = [
  {
    id: "s-1",
    name: "سارا محمدی",
    email: "sara.m@example.com",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    program: "برنامه‌ی حجم — هفته‌ی ۳",
    attendanceRate: 98,
    status: "active",
    statusText: "فعال",
  },
  {
    id: "s-2",
    name: "امیر صادقی",
    email: "amir.s@example.com",
    phone: "۰۹۱۸۲۳۴۵۶۷۸",
    program: "برنامه‌ی قدرت — هفته‌ی ۵",
    attendanceRate: 94,
    status: "active",
    statusText: "فعال",
  },
  {
    id: "s-3",
    name: "رضا کاظمی",
    email: "reza.k@example.com",
    phone: "۰۹۳۵۱۲۳۴۵۶۷",
    program: "برنامه‌ی چربی‌سوزی — هفته‌ی ۱",
    attendanceRate: 89,
    status: "expiring",
    statusText: "در شرف انقضا",
  },
  {
    id: "s-4",
    name: "مینا تهرانی",
    email: "mina.t@example.com",
    phone: "۰۹۱۹۸۷۶۵۴۳۲",
    program: "برنامه‌ی شروع — هفته‌ی ۲",
    attendanceRate: 82,
    status: "active",
    statusText: "فعال",
  },
  {
    id: "s-5",
    name: "نیما اکبری",
    email: "nima.a@example.com",
    phone: "۰۹۳۶۷۸۹۰۱۲۳",
    program: "برنامه‌ی عمومی",
    attendanceRate: 64,
    status: "expired",
    statusText: "منقضی شده",
  },
  {
    id: "s-6",
    name: "کیان مرادی",
    email: "kian.m@example.com",
    phone: "۰۹۱۲۵۶۷۸۹۰۱",
    program: "برنامه‌ی آمادگی جسمانی",
    attendanceRate: 90,
    status: "active",
    statusText: "فعال",
  },
];

export default function CoachStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expiring" | "expired">("all");

  const filtered = INITIAL_STUDENTS.filter((st) => {
    const matchesSearch =
      st.name.includes(search) || st.program.includes(search) || st.phone.includes(search);
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    return st.status === filter;
  });

  return (
    <div className="app flex min-h-screen">
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main flex flex-1 flex-col min-w-0">
        <CoachTopbar
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          searchPlaceholder="جستجوی شاگرد…"
          onSearchChange={setSearch}
        />

        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink">
                شاگردان من
              </h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">
                لیست شاگردان فعال، نرخ حضور و برنامه‌های تخصیص‌یافته
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/coach/programs" className="btn btn-primary btn-sm">
                تخصیص برنامه جدید
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div className="seg flex gap-[4px] bg-bg p-[4px] rounded-[10px]">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(filter === "all" ? "active" : "")}
              >
                همه ({toPersianDigits(INITIAL_STUDENTS.length)})
              </button>
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={cn(filter === "active" ? "active" : "")}
              >
                فعال
              </button>
              <button
                type="button"
                onClick={() => setFilter("expiring")}
                className={cn(filter === "expiring" ? "active" : "")}
              >
                در شرف انقضا
              </button>
              <button
                type="button"
                onClick={() => setFilter("expired")}
                className={cn(filter === "expired" ? "active" : "")}
              >
                منقضی
              </button>
            </div>

            <div className="text-[13px] text-ink-faint font-medium">
              نمایش {toPersianDigits(filtered.length)} شاگرد
            </div>
          </div>

          {/* Table Card */}
          <div className="card bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg/50">
                    <th className="text-right text-[12px] font-bold text-ink-faint py-3.5 px-5">نام شاگرد</th>
                    <th className="text-right text-[12px] font-bold text-ink-faint py-3.5 px-5">برنامه تمرینی</th>
                    <th className="text-right text-[12px] font-bold text-ink-faint py-3.5 px-5">شماره تماس</th>
                    <th className="text-right text-[12px] font-bold text-ink-faint py-3.5 px-5">نرخ حضور</th>
                    <th className="text-right text-[12px] font-bold text-ink-faint py-3.5 px-5">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-border last:border-b-0 hover:bg-bg/40 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-cyan text-[13px] font-bold text-ink">
                            {student.name.slice(0, 2)}
                          </span>
                          <div>
                            <div className="text-[13.5px] font-bold text-ink">{student.name}</div>
                            <div className="text-[12px] text-ink-faint">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-[13.5px] text-ink font-medium">
                        {student.program}
                      </td>
                      <td className="py-4 px-5 text-[13px] text-ink-soft">
                        {toPersianDigits(student.phone)}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-bg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan to-primary"
                              style={{ width: `${student.attendanceRate}%` }}
                            />
                          </div>
                          <span className="text-[12.5px] font-bold text-ink">
                            ٪{toPersianDigits(student.attendanceRate)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            "status-badge inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full",
                            student.status === "active" && "active bg-tint text-primary-dark",
                            student.status === "expiring" && "expiring bg-[#FFFBEB] text-[#B45309]",
                            student.status === "expired" && "expired bg-[#FFF1F2] text-[#9F1239]"
                          )}
                        >
                          <span
                            className={cn(
                              "d h-1.5 w-1.5 rounded-full",
                              student.status === "active" && "bg-primary",
                              student.status === "expiring" && "bg-[#F59E0B]",
                              student.status === "expired" && "bg-[#F43F5E]"
                            )}
                          />
                          <span>{student.statusText}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
