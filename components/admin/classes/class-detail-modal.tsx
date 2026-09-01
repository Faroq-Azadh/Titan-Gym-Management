"use client";

import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/persian-digits";
import { ClassSession } from "./types";
import { X, Clock, MapPin, User, Users, Calendar, Trash2, Edit2, Plus } from "lucide-react";
import { useState } from "react";

interface ClassDetailModalProps {
  cls: ClassSession | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (cls: ClassSession) => void;
  onDelete: (id: string) => void;
}

export function ClassDetailModal({
  cls,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ClassDetailModalProps) {
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);

  if (!isOpen || !cls) return null;

  const percent = Math.round((cls.enrolled / cls.capacity) * 100);
  const isFull = cls.enrolled >= cls.capacity;

  const members = cls.members && cls.members.length > 0 ? cls.members : [
    { id: "m10", name: "امیرحسین کاظمی", avatar: "ا‌ک", phone: "۰۹۱۲۳۴۵۶۷۸۹", joinedDate: "۱۴۰۳/۰۶/۰۱", status: "active" as const },
    { id: "m11", name: "پرهام رستمی", avatar: "پ‌ر", phone: "۰۹۱۹۸۷۶۵۴۳۲", joinedDate: "۱۴۰۳/۰۶/۰۴", status: "active" as const },
    { id: "m12", name: "سینا کریمی", avatar: "س‌ک", phone: "۰۹۳۵۱۱۱۴۴۵۵", joinedDate: "۱۴۰۳/۰۶/۱۰", status: "active" as const },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-[16px]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-bg/60 p-[20px_24px]">
          <div className="flex items-center gap-[10px]">
            <span
              className={cn(
                "rounded-[8px] px-[10px] py-[4px] text-[12px] font-black",
                cls.theme === "amber"
                  ? "bg-[#FFFBEB] text-[#B45309]"
                  : cls.theme === "cyan"
                    ? "bg-[rgba(34,211,238,0.15)] text-[#0891B2]"
                    : "bg-tint text-primary-dark",
              )}
            >
              {cls.category}
            </span>
            <h3 className="text-[18px] font-black text-ink">{cls.name}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-ink-faint transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-[24px]">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-[12px] min-[480px]:grid-cols-3">
            <div className="rounded-[12px] bg-bg p-[12px]">
              <div className="flex items-center gap-[6px] text-[11px] font-bold text-ink-faint">
                <Calendar className="h-[14px] w-[14px]" />
                <span>روز برگزاری</span>
              </div>
              <div className="mt-[4px] text-[13.5px] font-extrabold text-ink">
                {cls.day}
              </div>
            </div>

            <div className="rounded-[12px] bg-bg p-[12px]">
              <div className="flex items-center gap-[6px] text-[11px] font-bold text-ink-faint">
                <Clock className="h-[14px] w-[14px]" />
                <span>ساعت جلسه</span>
              </div>
              <div className="mt-[4px] text-[13.5px] font-extrabold text-ink">
                {toPersianDigits(cls.time)} {cls.endTime ? `تا ${toPersianDigits(cls.endTime)}` : ""}
              </div>
            </div>

            <div className="rounded-[12px] bg-bg p-[12px] min-[480px]:col-span-1 col-span-2">
              <div className="flex items-center gap-[6px] text-[11px] font-bold text-ink-faint">
                <User className="h-[14px] w-[14px]" />
                <span>مربی مسئول</span>
              </div>
              <div className="mt-[4px] text-[13.5px] font-extrabold text-ink">
                {cls.coach}
              </div>
            </div>
          </div>

          {/* Location & Level */}
          <div className="mt-[16px] flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-border p-[14px]">
            <div className="flex items-center gap-[8px] text-[13px] text-ink-soft">
              <MapPin className="h-[16px] w-[16px] text-primary-dark shrink-0" />
              <span>محل برگزاری: <strong className="text-ink">{cls.room}</strong></span>
            </div>
            <div className="text-[12px] font-bold text-ink-faint">
              سطح دوره: <span className="text-ink">{cls.level}</span>
            </div>
          </div>

          {/* Description */}
          {cls.description && (
            <div className="mt-[16px]">
              <div className="text-[12px] font-bold text-ink-faint">توضیحات کلاس:</div>
              <p className="mt-[4px] text-[13px] leading-[1.7] text-ink-soft">
                {cls.description}
              </p>
            </div>
          )}

          {/* Capacity Section */}
          <div className="mt-[20px] rounded-[14px] bg-bg p-[16px]">
            <div className="flex items-center justify-between text-[13px] font-bold">
              <span className="text-ink">وضعیت ظرفیت سالن:</span>
              <span
                className={
                  isFull
                    ? "text-[#DC2626]"
                    : percent >= 80
                      ? "text-[#D97706]"
                      : "text-primary-dark"
                }
              >
                {toPersianDigits(cls.enrolled)} از {toPersianDigits(cls.capacity)} نفر ({toPersianDigits(percent)}٪ تکمیل)
              </span>
            </div>
            <div className="mt-[8px] h-[8px] overflow-hidden rounded-full bg-border">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isFull
                    ? "bg-[#DC2626]"
                    : percent >= 80
                      ? "bg-[#F59E0B]"
                      : "bg-primary-dark",
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Enrolled Members Preview */}
          <div className="mt-[24px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <Users className="h-[16px] w-[16px] text-primary-dark" />
                <h4 className="text-[14px] font-extrabold text-ink">
                  اعضای ثبت‌نام شده ({toPersianDigits(cls.enrolled)} نفر)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingMember(!isAddingMember)}
                className="inline-flex items-center gap-[4px] text-[12px] font-bold text-primary-dark hover:underline"
              >
                <Plus className="h-[14px] w-[14px]" />
                افزودن عضو
              </button>
            </div>

            {isAddingMember && (
              <div className="mt-[12px] rounded-[12px] border border-primary/40 bg-tint/30 p-[12px]">
                <div className="grid grid-cols-1 gap-[8px] min-[420px]:grid-cols-2">
                  <input
                    type="text"
                    placeholder="نام و نام‌خانوادگی عضو"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="rounded-[8px] border border-border bg-surface px-[10px] py-[6px] text-[12px] text-ink focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="شماره تماس"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="rounded-[8px] border border-border bg-surface px-[10px] py-[6px] text-[12px] text-ink focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="mt-[8px] flex justify-end gap-[6px]">
                  <button
                    type="button"
                    onClick={() => setIsAddingMember(false)}
                    className="rounded-[6px] px-[10px] py-[4px] text-[11px] font-bold text-ink-faint hover:text-ink"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (newMemberName) {
                        alert(`عضو جدید «${newMemberName}» با موفقیت به کلاس اضافه شد.`);
                        setNewMemberName("");
                        setNewMemberPhone("");
                        setIsAddingMember(false);
                      }
                    }}
                    className="rounded-[6px] bg-primary-dark px-[12px] py-[4px] text-[11.5px] font-bold text-white shadow-xs hover:bg-ink"
                  >
                    تأیید افزودن
                  </button>
                </div>
              </div>
            )}

            <div className="mt-[12px] divide-y divide-border rounded-[12px] border border-border bg-surface">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-[10px_14px]"
                >
                  <div className="flex items-center gap-[10px]">
                    <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-tint text-[11px] font-extrabold text-primary-dark">
                      {member.avatar}
                    </span>
                    <div>
                      <div className="text-[13px] font-bold text-ink">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-ink-faint">
                        {toPersianDigits(member.phone)}
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-tint px-[8px] py-[2px] text-[10.5px] font-bold text-primary-dark">
                    فعال
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border bg-bg/50 p-[16px_24px]">
          <button
            type="button"
            onClick={() => {
              if (confirm(`آیا از حذف کلاس "${cls.name}" مطمئن هستید؟`)) {
                onDelete(cls.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-[6px] rounded-[10px] px-[12px] py-[8px] text-[12.5px] font-bold text-[#DC2626] transition-colors hover:bg-[#FEF2F2]"
          >
            <Trash2 className="h-[14px] w-[14px]" />
            حذف کلاس
          </button>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(cls);
              }}
              className="inline-flex items-center gap-[6px] rounded-[10px] border border-border bg-surface px-[14px] py-[8px] text-[13px] font-bold text-ink transition-colors hover:border-primary hover:bg-tint"
            >
              <Edit2 className="h-[14px] w-[14px]" />
              ویرایش
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] bg-ink px-[16px] py-[8px] text-[13px] font-bold text-white transition-colors hover:bg-primary-dark"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
