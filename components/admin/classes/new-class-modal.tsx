"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ClassSession, DayOfWeek, TimeSlot, ClassTheme } from "./types";
import { X } from "lucide-react";

interface NewClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: Omit<ClassSession, "id">, editId?: string) => void;
  editClass?: ClassSession | null;
  defaultDay?: DayOfWeek;
  defaultTime?: TimeSlot;
}

const COACHES = [
  { name: "آرش رضایی", short: "آرش" },
  { name: "سپیده کاظمی", short: "سپیده" },
  { name: "نگار اسدی", short: "نگار" },
  { name: "بهنام سعیدی", short: "بهنام" },
  { name: "کاوه مرادی", short: "کاوه" },
  { name: "سینا رادمنش", short: "سینا" },
  { name: "مریم توکلی", short: "مریم" },
];

const DAYS: DayOfWeek[] = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
];

const CATEGORIES = [
  "بدنسازی",
  "یوگا",
  "فیتنس",
  "کراس‌فیت",
  "TRX",
  "پیلاتس",
  "اسپینینگ",
];

export function NewClassModal({
  isOpen,
  onClose,
  onSave,
  editClass,
  defaultDay = "شنبه",
  defaultTime = "۰۸:۰۰",
}: NewClassModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("بدنسازی");
  const [coach, setCoach] = useState(COACHES[0].name);
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [time, setTime] = useState<TimeSlot>(defaultTime);
  const [endTime, setEndTime] = useState("۰۹:۳۰");
  const [capacity, setCapacity] = useState(20);
  const [enrolled, setEnrolled] = useState(0);
  const [room, setRoom] = useState("سالن اصلی بدنسازی");
  const [level, setLevel] = useState<ClassSession["level"]>("همه سطوح");
  const [theme, setTheme] = useState<ClassTheme>("emerald");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editClass) {
      setName(editClass.name);
      setCategory(editClass.category);
      setCoach(editClass.coach);
      setDay(editClass.day);
      setTime(editClass.time);
      setEndTime(editClass.endTime || "۰۹:۳۰");
      setCapacity(editClass.capacity);
      setEnrolled(editClass.enrolled);
      setRoom(editClass.room);
      setLevel(editClass.level);
      setTheme(editClass.theme);
      setDescription(editClass.description || "");
    } else {
      setName("");
      setCategory("بدنسازی");
      setCoach(COACHES[0].name);
      setDay(defaultDay);
      setTime(defaultTime);
      setEndTime("۰۹:۳۰");
      setCapacity(20);
      setEnrolled(0);
      setRoom("سالن اصلی بدنسازی");
      setLevel("همه سطوح");
      setTheme("emerald");
      setDescription("");
    }
  }, [editClass, defaultDay, defaultTime, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("لطفاً نام کلاس را وارد کنید.");
      return;
    }

    const matchedCoach = COACHES.find((c) => c.name === coach);
    const coachShort = matchedCoach ? matchedCoach.short : coach.split(" ")[0];

    onSave(
      {
        name,
        category,
        coach,
        coachShort,
        day,
        time,
        endTime,
        capacity: Number(capacity) || 20,
        enrolled: Number(enrolled) || 0,
        room,
        level,
        theme,
        description,
      },
      editClass?.id,
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-[16px]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[580px] overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-bg/60 p-[20px_24px]">
          <div>
            <h3 className="text-[18px] font-black text-ink">
              {editClass ? "ویرایش کلاس" : "تعریف کلاس جدید"}
            </h3>
            <p className="mt-[2px] text-[12.5px] text-ink-faint">
              تنظیم مشخصات جلسه، مربی، زمان‌بندی و ظرفیت سالن
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-ink-faint transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[72vh] space-y-[18px] overflow-y-auto p-[24px]">
            {/* Class Name & Category */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  عنوان کلاس <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بدنسازی پیشرفته"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  رشته / دسته‌بندی
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategory(val);
                    if (!name) setName(val);
                    if (val === "یوگا" || val === "فیتنس") setTheme("cyan");
                    else if (val === "کراس‌فیت" || val === "TRX") setTheme("amber");
                    else setTheme("emerald");
                  }}
                  className="select-input w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Coach & Room */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  مربی کلاس
                </label>
                <select
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  className="select-input w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                >
                  {COACHES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  سالن برگزاری
                </label>
                <input
                  type="text"
                  placeholder="مثال: سالن اصلی بدنسازی"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>
            </div>

            {/* Day & Time Slot */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-3">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  روز برگزاری
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as DayOfWeek)}
                  className="select-input w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  ساعت شروع
                </label>
                <input
                  type="text"
                  placeholder="۰۸:۰۰"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  ساعت پایان
                </label>
                <input
                  type="text"
                  placeholder="۰۹:۳۰"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>
            </div>

            {/* Capacity & Enrolled & Level */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-3">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  حداکثر ظرفیت (نفر)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  ثبت‌نامی فعلی
                </label>
                <input
                  type="number"
                  min="0"
                  max={capacity}
                  value={enrolled}
                  onChange={(e) => setEnrolled(Number(e.target.value))}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  سطح دوره
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as ClassSession["level"])}
                  className="select-input w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                >
                  <option value="همه سطوح">همه سطوح</option>
                  <option value="مبتدی">مبتدی</option>
                  <option value="متوسط">متوسط</option>
                  <option value="پیشرفته">پیشرفته</option>
                </select>
              </div>
            </div>

            {/* Theme Badge Picker */}
            <div>
              <label className="mb-[8px] block text-[12.5px] font-bold text-ink">
                رنگ کارت در تقویم
              </label>
              <div className="flex flex-wrap gap-[10px]">
                <button
                  type="button"
                  onClick={() => setTheme("emerald")}
                  className={cn(
                    "flex items-center gap-[8px] rounded-[10px] border p-[8px_14px] text-[12.5px] font-bold transition-all",
                    theme === "emerald"
                      ? "border-primary bg-tint text-primary-dark ring-2 ring-primary/40"
                      : "border-border bg-surface text-ink-soft hover:bg-bg",
                  )}
                >
                  <span className="h-[12px] w-[12px] rounded-full bg-primary-dark" />
                  زمردی (بدنسازی)
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("cyan")}
                  className={cn(
                    "flex items-center gap-[8px] rounded-[10px] border p-[8px_14px] text-[12.5px] font-bold transition-all",
                    theme === "cyan"
                      ? "border-[#22D3EE] bg-[rgba(34,211,238,0.15)] text-[#0891B2] ring-2 ring-[#22D3EE]/40"
                      : "border-border bg-surface text-ink-soft hover:bg-bg",
                  )}
                >
                  <span className="h-[12px] w-[12px] rounded-full bg-[#0891B2]" />
                  فیروزه‌ای (یوگا / فیتنس)
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("amber")}
                  className={cn(
                    "flex items-center gap-[8px] rounded-[10px] border p-[8px_14px] text-[12.5px] font-bold transition-all",
                    theme === "amber"
                      ? "border-[#F59E0B] bg-[#FFFBEB] text-[#B45309] ring-2 ring-[#F59E0B]/40"
                      : "border-border bg-surface text-ink-soft hover:bg-bg",
                  )}
                >
                  <span className="h-[12px] w-[12px] rounded-full bg-[#F59E0B]" />
                  کهربایی (کراس‌فیت / TRX)
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                توضیحات و اهداف دوره
              </label>
              <textarea
                rows={2}
                placeholder="توضیحات کوتاه در مورد تمرینات و لوازم مورد نیاز..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-[10px] border-t border-border bg-bg/50 p-[16px_24px]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-border bg-surface px-[16px] py-[9px] text-[13px] font-bold text-ink-soft transition-colors hover:bg-bg hover:text-ink"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-[6px] rounded-[10px] bg-ink px-[20px] py-[9px] text-[13.5px] font-bold text-white transition-all hover:bg-primary-dark"
            >
              {editClass ? "ذخیره تغییرات" : "ثبت و افزودن به تقویم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
