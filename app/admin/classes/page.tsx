"use client";

import { useState, useMemo } from "react";
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/lib/hooks/queries/use-classes";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ClassesKpi } from "@/components/admin/classes/classes-kpi";
import { ClassesTimetable } from "@/components/admin/classes/classes-timetable";
import { ClassesDayView } from "@/components/admin/classes/classes-day-view";
import { ClassesListView } from "@/components/admin/classes/classes-list-view";
import { ClassDetailModal } from "@/components/admin/classes/class-detail-modal";
import { NewClassModal } from "@/components/admin/classes/new-class-modal";
import {
  ClassSession,
  INITIAL_CLASSES,
  DayOfWeek,
  TimeSlot,
} from "@/components/admin/classes/types";
import { cn } from "@/lib/utils";

type ViewMode = "month" | "week" | "day";

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: "شنبه",
  1: "یکشنبه",
  2: "دوشنبه",
  3: "سه‌شنبه",
  4: "چهارشنبه",
  5: "پنجشنبه",
  6: "شنبه",
};

const DAYS_REV_MAP: Record<string, number> = {
  "شنبه": 0,
  "یکشنبه": 1,
  "دوشنبه": 2,
  "سه‌شنبه": 3,
  "چهارشنبه": 4,
  "پنجشنبه": 5,
};

export default function AdminClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null);
  const [defaultSlot, setDefaultSlot] = useState<{
    day: DayOfWeek;
    time: TimeSlot;
  }>({ day: "شنبه", time: "۰۸:۰۰" });

  const { data: backendClasses } = useClasses();
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();

  const classes: ClassSession[] = useMemo(() => {
    const list: any[] = Array.isArray(backendClasses)
      ? backendClasses
      : Array.isArray((backendClasses as any)?.results)
        ? (backendClasses as any).results
        : Array.isArray((backendClasses as any)?.classes)
          ? (backendClasses as any).classes
          : [];

    return list.map((c) => {
      const day = DAYS_MAP[c.day_of_week] || "شنبه";
      const time = (c.start_time ? c.start_time.slice(0, 5) : "۰۸:۰۰") as TimeSlot;
      const coachName = c.coach_name || "مربی باشگاه";
      return {
        id: String(c.id),
        name: c.title,
        category: "بدنسازی",
        coach: coachName,
        coachShort: coachName.split(" ")[0] || "مربی",
        day,
        time,
        capacity: c.capacity || 20,
        enrolled: c.booked || 0,
        theme: "emerald" as const,
        room: "سالن اصلی",
        level: "همه سطوح" as const,
      };
    });
  }, [backendClasses]);

  // KPIs Calculations
  const activeClassesCount = classes.length;
  const uniqueCoaches = new Set(classes.map((c) => c.coach)).size;
  const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
  const totalEnrolled = classes.reduce((sum, c) => sum + c.enrolled, 0);
  const avgCapacityPercent =
    totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
  const fullClassesCount = classes.filter((c) => c.enrolled >= c.capacity).length;

  const handleSaveClass = async (
    classData: Omit<ClassSession, "id">,
    editId?: string,
  ) => {
    const day_of_week = DAYS_REV_MAP[classData.day] ?? 0;
    const startTime = classData.time.includes(":") ? classData.time : "08:00";

    try {
      if (editId) {
        await updateClassMutation.mutateAsync({
          id: editId,
          payload: {
            title: classData.name,
            day_of_week,
            start_time: startTime,
            duration_minutes: 60,
            capacity: classData.capacity,
          },
        });
        if (selectedClass?.id === editId) {
          setSelectedClass({ ...classData, id: editId });
        }
      } else {
        await createClassMutation.mutateAsync({
          title: classData.name,
          day_of_week,
          start_time: startTime,
          duration_minutes: 60,
          capacity: classData.capacity,
        });
      }
    } catch {
      // Handled
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (typeof window !== "undefined" && window.confirm("آیا از حذف این کلاس اطمینان دارید؟")) {
      try {
        await deleteClassMutation.mutateAsync(id);
      } catch {
        // Handled
      }
      if (selectedClass?.id === id) {
        setSelectedClass(null);
      }
    }
  };

  const handleAddAtSlot = (day: DayOfWeek, time: TimeSlot) => {
    setEditingClass(null);
    setDefaultSlot({ day, time });
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar Header */}
        <AdminTopbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          searchPlaceholder="جستجو در کلاس‌ها، مربیان…"
        />

        {/* Page Content */}
        <main className="flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px]">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink min-[640px]:text-[26px]">
                کلاس‌ها و تقویم
              </h1>
              <div className="mt-[5px] text-[14px] text-ink-faint">
                برنامه‌ی هفتگی کلاس‌های گروهی باشگاه
              </div>
            </div>

            <div className="flex items-center gap-[10px]">
              {/* Segmented control: ماه / هفته / روز */}
              <div className="inline-flex rounded-[10px] border border-border bg-bg p-[3px]">
                <button
                  type="button"
                  onClick={() => setViewMode("month")}
                  className={cn(
                    "rounded-[7px] px-[14px] py-[6px] text-[13px] font-bold transition-all duration-150",
                    viewMode === "month"
                      ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  ماه
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("week")}
                  className={cn(
                    "rounded-[7px] px-[14px] py-[6px] text-[13px] font-bold transition-all duration-150",
                    viewMode === "week"
                      ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  هفته
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("day")}
                  className={cn(
                    "rounded-[7px] px-[14px] py-[6px] text-[13px] font-bold transition-all duration-150",
                    viewMode === "day"
                      ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  روز
                </button>
              </div>

              {/* Add class button */}
              <button
                type="button"
                onClick={() => {
                  setEditingClass(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-[8px] rounded-[10px] bg-ink px-[14px] py-[8px] text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-primary-dark hover:shadow-[0_20px_50px_rgba(22,224,160,0.25)] active:translate-y-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[16px] w-[16px]"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>کلاس جدید</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <ClassesKpi
            activeClassesCount={activeClassesCount}
            activeCoachesCount={uniqueCoaches}
            avgCapacityPercent={avgCapacityPercent}
            fullClassesCount={fullClassesCount}
          />

          {/* Active View: Week Timetable, Day View, or List/Month View */}
          {viewMode === "week" && (
            <ClassesTimetable
              classes={classes}
              onSelectClass={(cls) => setSelectedClass(cls)}
              onAddClassAtSlot={handleAddAtSlot}
            />
          )}

          {viewMode === "day" && (
            <ClassesDayView
              classes={classes}
              onSelectClass={(cls) => setSelectedClass(cls)}
              onAddNewClass={() => {
                setEditingClass(null);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {viewMode === "month" && (
            <ClassesListView
              classes={classes}
              onSelectClass={(cls) => setSelectedClass(cls)}
              onEditClass={(cls) => {
                setEditingClass(cls);
                setIsAddModalOpen(true);
              }}
              onDeleteClass={handleDeleteClass}
            />
          )}
        </main>
      </div>

      {/* Class Detail Modal */}
      <ClassDetailModal
        cls={selectedClass}
        isOpen={Boolean(selectedClass)}
        onClose={() => setSelectedClass(null)}
        onEdit={(cls) => {
          setEditingClass(cls);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteClass}
      />

      {/* New / Edit Class Modal */}
      <NewClassModal
        isOpen={isAddModalOpen}
        editClass={editingClass}
        defaultDay={defaultSlot.day}
        defaultTime={defaultSlot.time}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingClass(null);
        }}
        onSave={handleSaveClass}
      />
    </div>
  );
}
