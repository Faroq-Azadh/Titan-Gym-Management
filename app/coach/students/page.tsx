"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CoachSidebar } from "@/components/coach/coach-sidebar";
import { CoachTopbar } from "@/components/coach/coach-topbar";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";
import { X, Check, Eye } from "lucide-react";

interface StudentItem {
  id: string;
  name: string;
  program: string;
  status: "active" | "expiring" | "expired";
  attendanceRate: number;
  lastSession: string;
  dueDate: string;
  phone?: string;
  avatarColor: string;
}

const AVATAR_COLORS = [
  "#16E0A0",
  "#22D3EE",
  "#6366F1",
  "#F59E0B",
  "#EC4899",
  "#0EA5E9",
  "#10B981",
  "#8B5CF6",
];

const INITIAL_STUDENTS: StudentItem[] = [
  {
    id: "1024",
    name: "سارا محمدی",
    program: "حجم — هفته ۳",
    status: "active",
    attendanceRate: 98,
    lastSession: "امروز",
    dueDate: "۱۵ مرداد",
    phone: "۰۹۱۲۳۴۵۶۷۸۱",
    avatarColor: AVATAR_COLORS[0],
  },
  {
    id: "1025",
    name: "امیر صادقی",
    program: "قدرت — هفته ۵",
    status: "active",
    attendanceRate: 94,
    lastSession: "دیروز",
    dueDate: "۲ شهریور",
    phone: "۰۹۱۸۲۳۴۵۶۷۲",
    avatarColor: AVATAR_COLORS[1],
  },
  {
    id: "1026",
    name: "رضا کاظمی",
    program: "چربی‌سوزی — هفته ۱",
    status: "expiring",
    attendanceRate: 89,
    lastSession: "امروز",
    dueDate: "۲ تیر",
    phone: "۰۹۳۵۱۲۳۴۵۶۳",
    avatarColor: AVATAR_COLORS[2],
  },
  {
    id: "1027",
    name: "مینا تهرانی",
    program: "شروع — هفته ۲",
    status: "active",
    attendanceRate: 82,
    lastSession: "۲ روز پیش",
    dueDate: "۲۰ مرداد",
    phone: "۰۹۱۹۸۷۶۵۴۳۴",
    avatarColor: AVATAR_COLORS[3],
  },
  {
    id: "1028",
    name: "نیما اکبری",
    program: "حجم — هفته ۴",
    status: "expired",
    attendanceRate: 54,
    lastSession: "۵ روز پیش",
    dueDate: "۲۵ خرداد",
    phone: "۰۹۳۶۷۸۹۰۱۲۵",
    avatarColor: AVATAR_COLORS[4],
  },
  {
    id: "1029",
    name: "کیان مرادی",
    program: "شروع — هفته ۱",
    status: "active",
    attendanceRate: 76,
    lastSession: "دیروز",
    dueDate: "۱۰ شهریور",
    phone: "۰۹۱۲۵۶۷۸۹۰۶",
    avatarColor: AVATAR_COLORS[5],
  },
  {
    id: "1030",
    name: "هانیه رضایی",
    program: "چربی‌سوزی — هفته ۶",
    status: "expiring",
    attendanceRate: 91,
    lastSession: "امروز",
    dueDate: "۵ تیر",
    phone: "۰۹۳۰۴۵۶۷۸۹۷",
    avatarColor: AVATAR_COLORS[6],
  },
  {
    id: "1031",
    name: "بهراد یوسفی",
    program: "قدرت — هفته ۲",
    status: "active",
    attendanceRate: 88,
    lastSession: "۳ روز پیش",
    dueDate: "۱۸ مرداد",
    phone: "۰۹۱۱۱۱۲۳۴۵۸",
    avatarColor: AVATAR_COLORS[7],
  },
];

const STATUS_MAP = {
  active: { cls: "active", label: "فعال" },
  expiring: { cls: "expiring", label: "رو به اتمام" },
  expired: { cls: "expired", label: "منقضی" },
};

export default function CoachStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState<StudentItem[]>(INITIAL_STUDENTS);
  const [filter, setFilter] = useState<"all" | "active" | "expiring" | "expired">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals / Details
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentProgram, setNewStudentProgram] = useState("حجم — هفته ۱");
  const [newStudentDueDate, setNewStudentDueDate] = useState("۳۰ روز آینده");
  const [isAddSuccess, setIsAddSuccess] = useState(false);

  // Stats
  const totalStudentsCount = 38;
  const activeCount = 31;
  const expiringCount = 5;
  const expiredCount = 2;

  // Filtered rows
  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const matchFilter = filter === "all" || item.status === filter;
      const matchSearch =
        searchQuery === "" ||
        item.name.includes(searchQuery) ||
        item.program.includes(searchQuery) ||
        item.id.includes(searchQuery);
      return matchFilter && matchSearch;
    });
  }, [students, filter, searchQuery]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] || "") + (parts[1][0] || "");
    }
    return name.slice(0, 2);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newId = String(1032 + students.length);
    const newStudent: StudentItem = {
      id: newId,
      name: newStudentName.trim(),
      program: newStudentProgram,
      status: "active",
      attendanceRate: 100,
      lastSession: "امروز",
      dueDate: newStudentDueDate,
      avatarColor: AVATAR_COLORS[students.length % AVATAR_COLORS.length],
    };

    setStudents([newStudent, ...students]);
    setIsAddSuccess(true);
    setTimeout(() => {
      setIsAddSuccess(false);
      setIsAddModalOpen(false);
      setNewStudentName("");
    }, 1200);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(
        ["نام,شناسه,برنامه,وضعیت,نرخ حضور,سررسید", ...filteredStudents.map((s) => `${s.name},#${s.id},${s.program},${s.status},${s.attendanceRate}%,${s.dueDate}`)].join("\n")
      );
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `students-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app flex min-h-screen">
      {/* Sidebar Navigation */}
      <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main flex flex-1 flex-col min-w-0">
        {/* Topbar: Exactly like dashboard part */}
        <CoachTopbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          searchPlaceholder="جستجو…"
        />

        {/* Content */}
        <main className="content flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="page-head flex flex-wrap items-end justify-between gap-[16px] mb-[24px]">
            <div>
              <h1 className="text-[22px] min-[640px]:text-[26px] font-extrabold text-ink tracking-[-0.01em]">
                شاگردان من
              </h1>
              <div className="sub text-[14px] text-ink-faint mt-[5px]">
                مدیریت، جستجو و پیگیری شاگردان
              </div>
            </div>

            <div className="page-head-actions flex items-center gap-[10px]">
              <button
                type="button"
                onClick={handleExport}
                className="btn btn-outline btn-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[17px] w-[17px]"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>خروجی</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[17px] w-[17px]"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>افزودن شاگرد</span>
              </button>
            </div>
          </div>

          {/* KPI cards Grid */}
          <div className="kpi-grid grid grid-cols-1 gap-[18px] min-[641px]:grid-cols-2 min-[1101px]:grid-cols-4 mb-[18px]">
            {/* Card 1: کل شاگردان */}
            <div className="card kpi p-[20px] flex flex-col gap-[14px] bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="kpi-top flex items-center justify-between">
                <span className="kpi-ico flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[22px] w-[22px]"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  </svg>
                </span>
              </div>
              <div className="v text-[28px] font-extrabold leading-none text-ink">
                {toPersianDigits(totalStudentsCount)}
              </div>
              <div className="l text-[13.5px] font-medium text-ink-soft">
                کل شاگردان
              </div>
            </div>

            {/* Card 2: فعال */}
            <div className="card kpi p-[20px] flex flex-col gap-[14px] bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="kpi-top flex items-center justify-between">
                <span className="kpi-ico flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-tint text-primary-dark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[22px] w-[22px]"
                  >
                    <path d="m9 12 2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </span>
              </div>
              <div className="v text-[28px] font-extrabold leading-none text-ink">
                {toPersianDigits(activeCount)}
              </div>
              <div className="l text-[13.5px] font-medium text-ink-soft">
                فعال
              </div>
            </div>

            {/* Card 3: رو به اتمام */}
            <div className="card kpi p-[20px] flex flex-col gap-[14px] bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="kpi-top flex items-center justify-between">
                <span
                  className="kpi-ico flex h-[44px] w-[44px] items-center justify-center rounded-[12px] text-[#D97706]"
                  style={{ background: "#FFFBEB" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[22px] w-[22px]"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>
              </div>
              <div className="v text-[28px] font-extrabold leading-none text-ink">
                {toPersianDigits(expiringCount)}
              </div>
              <div className="l text-[13.5px] font-medium text-ink-soft">
                رو به اتمام
              </div>
            </div>

            {/* Card 4: منقضی */}
            <div className="card kpi p-[20px] flex flex-col gap-[14px] bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="kpi-top flex items-center justify-between">
                <span
                  className="kpi-ico flex h-[44px] w-[44px] items-center justify-center rounded-[12px] text-[#E11D48]"
                  style={{ background: "#FFF1F2" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[22px] w-[22px]"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6M9 9l6 6" />
                  </svg>
                </span>
              </div>
              <div className="v text-[28px] font-extrabold leading-none text-ink">
                {toPersianDigits(expiredCount)}
              </div>
              <div className="l text-[13.5px] font-medium text-ink-soft">
                منقضی
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar flex items-center gap-[12px] mb-[18px] flex-wrap">
            <div className="tabs-inline flex gap-[4px] bg-bg p-[4px] rounded-[10px] flex-wrap" id="statusTabs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn("tab", filter === "all" && "active")}
              >
                همه
              </button>
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={cn("tab", filter === "active" && "active")}
              >
                فعال
              </button>
              <button
                type="button"
                onClick={() => setFilter("expiring")}
                className={cn("tab", filter === "expiring" && "active")}
              >
                رو به اتمام
              </button>
              <button
                type="button"
                onClick={() => setFilter("expired")}
                className={cn("tab", filter === "expired" && "active")}
              >
                منقضی
              </button>
            </div>

            <div className="filter-search flex items-center gap-[10px] bg-surface border border-border rounded-[12px] p-[9px_14px] min-w-[240px] flex-1 max-w-[360px]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-[17px] w-[17px] text-ink-faint shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                id="stuSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام شاگرد…"
                className="w-full border-none bg-transparent text-[14px] text-ink outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[12px] text-ink-faint hover:text-ink"
                  aria-label="پاک کردن"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Students List Card */}
          <div className="card bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="card-head flex items-center justify-between p-[20px_22px] border-b border-border">
              <div>
                <h3 className="text-[16px] font-extrabold text-ink">فهرست شاگردان</h3>
                <div className="hint text-[12.5px] text-ink-faint mt-[3px]" id="rowInfo">
                  نمایش {toPersianDigits(filteredStudents.length)} شاگرد از {toPersianDigits(totalStudentsCount)}
                </div>
              </div>
            </div>

            <div className="table-wrap overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-right text-[12px] font-bold text-ink-faint p-[0_22px_14px] border-b border-border whitespace-nowrap">
                      شاگرد
                    </th>
                    <th className="text-right text-[12px] font-bold text-ink-faint p-[0_22px_14px] border-b border-border whitespace-nowrap">
                      برنامه
                    </th>
                    <th className="text-right text-[12px] font-bold text-ink-faint p-[0_22px_14px] border-b border-border whitespace-nowrap">
                      وضعیت
                    </th>
                    <th className="text-right text-[12px] font-bold text-ink-faint p-[0_22px_14px] border-b border-border whitespace-nowrap">
                      نرخ حضور
                    </th>
                    <th className="text-right text-[12px] font-bold text-ink-faint p-[0_22px_14px] border-b border-border whitespace-nowrap">
                      آخرین جلسه
                    </th>
                    <th className="text-right text-[12px] font-bold text-ink-faint p-[0_22px_14px] border-b border-border whitespace-nowrap">
                      سررسید عضویت
                    </th>
                    <th className="text-right text-[12px] font-bold text-ink-faint p-[0_22px_14px] border-b border-border whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody id="stuBody">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((stu) => {
                      const stat = STATUS_MAP[stu.status];
                      return (
                        <tr
                          key={stu.id}
                          className="border-b border-border last:border-b-0 hover:bg-bg transition-colors duration-150"
                        >
                          <td className="p-[15px_22px] text-[13.5px] text-ink-soft whitespace-nowrap">
                            <div className="member-cell flex items-center gap-[11px]">
                              <span
                                className="av w-[36px] h-[36px] rounded-[10px] shrink-0 flex items-center justify-center font-bold text-[13px] text-white"
                                style={{ background: stu.avatarColor }}
                              >
                                {getInitials(stu.name)}
                              </span>
                              <div>
                                <div className="nm text-[13.5px] font-bold text-ink">{stu.name}</div>
                                <div className="em text-[12px] text-ink-faint">
                                  شناسه #{toPersianDigits(stu.id)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-[15px_22px] text-[13.5px] text-ink-soft whitespace-nowrap">
                            {stu.program}
                          </td>
                          <td className="p-[15px_22px] text-[13.5px] text-ink-soft whitespace-nowrap">
                            <span className={cn("status", stat.cls)}>
                              <span className="d"></span>
                              {stat.label}
                            </span>
                          </td>
                          <td className="p-[15px_22px] text-[13.5px] text-ink-soft whitespace-nowrap">
                            ٪{toPersianDigits(stu.attendanceRate)}
                          </td>
                          <td className="p-[15px_22px] text-[13.5px] text-ink-soft whitespace-nowrap">
                            {stu.lastSession}
                          </td>
                          <td className="p-[15px_22px] text-[13.5px] text-ink-soft whitespace-nowrap">
                            {stu.dueDate}
                          </td>
                          <td className="p-[15px_22px] text-[13.5px] text-ink-soft whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(stu)}
                              className="row-action text-ink-faint w-[32px] h-[32px] rounded-[8px] inline-flex items-center justify-center transition-all duration-150 hover:bg-tint hover:text-primary-dark"
                              aria-label="مشاهده"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="empty-row">
                      <td
                        colSpan={7}
                        className="text-center text-ink-faint p-[40px] text-[14px]"
                      >
                        شاگردی با این فیلتر پیدا نشد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pager */}
            <div className="pager flex items-center gap-[6px] justify-center p-[18px]">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                قبلی
              </button>
              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(currentPage === pageNum && "active")}
                >
                  {toPersianDigits(pageNum)}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === 5}
                onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
              >
                بعدی
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-[4px] transition-opacity"
            onClick={() => setSelectedStudent(null)}
          />
          <div className="relative z-10 w-full max-w-[440px] rounded-[20px] border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[12px] font-bold text-white text-[15px]"
                  style={{ background: selectedStudent.avatarColor }}
                >
                  {getInitials(selectedStudent.name)}
                </span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink">{selectedStudent.name}</h3>
                  <p className="text-[12px] text-ink-faint">شناسه #{toPersianDigits(selectedStudent.id)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint hover:bg-bg hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 py-2 text-[13.5px]">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-ink-faint">برنامه تمرینی:</span>
                <span className="font-bold text-ink">{selectedStudent.program}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-ink-faint">نرخ حضور:</span>
                <span className="font-bold text-primary-dark">٪{toPersianDigits(selectedStudent.attendanceRate)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-ink-faint">آخرین جلسه:</span>
                <span className="font-semibold text-ink">{selectedStudent.lastSession}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-ink-faint">سررسید عضویت:</span>
                <span className="font-semibold text-ink">{selectedStudent.dueDate}</span>
              </div>
              {selectedStudent.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-faint">شماره تماس:</span>
                  <span className="font-semibold text-ink">{toPersianDigits(selectedStudent.phone)}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-border flex items-center justify-end gap-2">
              <Link
                href="/coach/programs"
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedStudent(null)}
              >
                تغییر برنامه
              </Link>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="btn btn-primary btn-sm"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-[4px] transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[460px] rounded-[20px] border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-tint text-primary-dark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[17px] font-extrabold text-ink">افزودن شاگرد جدید</h3>
                  <p className="text-[12px] text-ink-faint">اختصاص شاگرد به ردیف‌های آموزشی شما</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint hover:bg-bg hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isAddSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tint text-primary-dark">
                  <Check className="h-6 w-6 stroke-[3]" />
                </span>
                <h4 className="text-[16px] font-extrabold text-ink">شاگرد با موفقیت افزوده شد</h4>
              </div>
            ) : (
              <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-ink">
                    نام و نام خانوادگی <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="مثال: پارسا کاظمی"
                    className="w-full rounded-[12px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-ink">برنامه تمرینی اولیه</label>
                  <input
                    type="text"
                    value={newStudentProgram}
                    onChange={(e) => setNewStudentProgram(e.target.value)}
                    placeholder="مثال: حجم — هفته ۱"
                    className="w-full rounded-[12px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-ink">سررسید عضویت</label>
                  <input
                    type="text"
                    value={newStudentDueDate}
                    onChange={(e) => setNewStudentDueDate(e.target.value)}
                    placeholder="۳۰ روز آینده"
                    className="w-full rounded-[12px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                  />
                </div>

                <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn btn-outline btn-sm"
                  >
                    انصراف
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    ثبت شاگرد
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
