"use client";

import Link from "next/link";
import { useCoachDashboard } from "@/lib/hooks/queries/use-coach-dashboard";
import { toPersianDigits } from "@/lib/persian-digits";

export function CoachTopStudents() {
  const { data: dashboard } = useCoachDashboard();
  const students = dashboard?.top_students ?? [];

  return (
    <div className="card bg-surface border border-border rounded-[16px] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      {/* Card Head */}
      <div className="p-[20px_22px] border-b border-border">
        <h3 className="text-[16px] font-extrabold text-ink">برترین شاگردان ماه</h3>
        <div className="text-[12.5px] text-ink-faint mt-[3px]">
          بر اساس نرخ حضور و پیشرفت
        </div>
      </div>

      {/* Card Body */}
      <div className="p-[22px]">
        <div className="top-list flex flex-col gap-[16px]">
          {students.map((student) => (
            <div key={student.id} className="top-row">
              {/* Row Header */}
              <div className="top-head flex items-center justify-between mb-[7px]">
                <div className="head-l flex items-center gap-[9px]">
                  <span className="rank flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-tint text-[12px] font-extrabold text-primary-dark">
                    {toPersianDigits(student.rank)}
                  </span>
                  <Link
                    href="/coach/students"
                    className="nm text-[13px] font-bold text-ink hover:text-primary-dark transition-colors"
                  >
                    {student.name}
                  </Link>
                </div>
                <span className="val text-[12.5px] font-bold text-ink-soft">
                  ٪{toPersianDigits(student.rate)}
                </span>
              </div>

              {/* Horizontal Gradient Progress Bar */}
              <div className="hbar h-[7px] rounded-full bg-bg overflow-hidden">
                <div
                  className="hbar-fill h-full rounded-full bg-gradient-to-r from-cyan to-primary transition-all duration-500"
                  style={{ width: `${student.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
