"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddCoach } from "@/lib/hooks/queries/use-coaches";
import { logActivity } from "@/lib/activities-store";
import { normalizeDigits } from "@/lib/persian-digits";
import {
  saveLocalCoachOverridesBatch,
  saveLocalCoachOverride,
  saveLocalTeamMember,
  normalizePersianName,
  getPhoneLookupKeys,
  COACHES_UPDATED_EVENT,
} from "@/lib/coaches-store";
import {
  X,
  Camera,
  User as UserIcon,
  Briefcase,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKING_DAYS_OPTIONS = [
  { key: "sat", label: "شنبه" },
  { key: "sun", label: "۱‌شنبه" },
  { key: "mon", label: "۲‌شنبه" },
  { key: "tue", label: "۳‌شنبه" },
  { key: "wed", label: "۴‌شنبه" },
  { key: "thu", label: "۵‌شنبه" },
  { key: "fri", label: "جمعه" },
];

const PRESET_ROLES = [
  "پذیرش / رسپشن",
  "امور اداری",
  "حسابدار / مالی",
  "مدیریت داخلی",
  "پشتیبانی و خدمات",
  "سایر (تعریف عنوان دستی)",
];

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const queryClient = useQueryClient();
  const addCoachMutation = useAddCoach();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    avatar: "",
    selectedRole: "پذیرش / رسپشن",
    customRole: "",
    gender: "male" as "male" | "female" | "",
    birth_date: "",
    address: "",
    work_shift: "full_time" as "full_time" | "morning" | "evening" | "morning_evening",
    start_date: new Date().toISOString().slice(0, 10),
    working_days: ["sat", "sun", "mon", "tue", "wed", "thu"] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!isOpen) return null;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 320;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  const handleWorkingDayToggle = (dayKey: string) => {
    setFormData((prev) => {
      const exists = prev.working_days.includes(dayKey);
      return {
        ...prev,
        working_days: exists
          ? prev.working_days.filter((d) => d !== dayKey)
          : [...prev.working_days, dayKey],
      };
    });
  };

  const effectiveRole =
    formData.selectedRole === "سایر (تعریف عنوان دستی)"
      ? formData.customRole.trim() || "کارمند"
      : formData.selectedRole;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setSubmitError("نام و نام خانوادگی کارمند الزامی است.");
      return;
    }

    const rawPhone = normalizeDigits(formData.phone.trim()).replace(/\D/g, "");
    if (!rawPhone || rawPhone.length < 10) {
      setSubmitError("شماره همراه معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹).");
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeFullName = `${formData.first_name.trim()} ${formData.last_name.trim()}`;
      const normName = normalizePersianName(employeeFullName);
      const phoneKeys = getPhoneLookupKeys(rawPhone);
      const avatarData = formData.avatar?.trim() || undefined;

      const newOverride = {
        name: employeeFullName,
        role: effectiveRole,
        type: "staff" as const, // Marked definitively as staff/employee
        status: "active" as const,
        avatar: avatarData,
        phone: rawPhone,
        email: formData.email.trim() || undefined,
      };

      const batchToSave: Record<string, any> = {
        [`name_${employeeFullName}`]: newOverride,
        [`normname_${normName}`]: newOverride,
      };
      for (const pk of phoneKeys) {
        batchToSave[`phone_${pk}`] = newOverride;
      }

      // 1. Save local override immediately
      saveLocalCoachOverridesBatch(batchToSave);

      // 2. Submit to Django backend using position: "reception" (the Django spec representation for staff/employees)
      const created = await addCoachMutation.mutateAsync({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: rawPhone,
        specialties: [effectiveRole],
        position: "reception", // In Django OpenAPI: 'reception' is the staff/admin position
        gender: formData.gender || undefined,
        birth_date: formData.birth_date || undefined,
        email: formData.email.trim() || undefined,
        avatar: avatarData,
        address: formData.address.trim() || undefined,
        work_shift: formData.work_shift || undefined,
        start_date: formData.start_date || new Date().toISOString().slice(0, 10),
        working_days: formData.working_days.length > 0 ? formData.working_days : undefined,
        send_invite: false,
        instant_activation: true,
      });

      const createdId = (created as any)?.id || (created as any)?.data?.id;
      const effectiveId = createdId ? String(createdId) : `staff-${Date.now()}`;

      // Save full local team member object so it renders in team list immediately
      saveLocalTeamMember({
        id: effectiveId,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        full_name: employeeFullName,
        name: employeeFullName,
        phone: rawPhone,
        email: formData.email.trim() || undefined,
        position: "reception",
        role: effectiveRole,
        type: "staff",
        specialties: [effectiveRole],
        avatar: avatarData,
        is_active: true,
        work_shift: formData.work_shift,
        working_days: formData.working_days,
        start_date: formData.start_date,
        address: formData.address.trim() || undefined,
      });

      saveLocalCoachOverride(effectiveId, newOverride);

      // 3. Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
      await queryClient.refetchQueries({ queryKey: ["coaches"] });
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });

      // 4. Log recent activity
      logActivity({
        type: "COACH",
        text: `ثبت کارمند جدید: ${employeeFullName} (${effectiveRole})`,
      });

      window.dispatchEvent(new Event(COACHES_UPDATED_EVENT));

      // Reset & close
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        avatar: "",
        selectedRole: "پذیرش / رسپشن",
        customRole: "",
        gender: "male",
        birth_date: "",
        address: "",
        work_shift: "full_time",
        start_date: new Date().toISOString().slice(0, 10),
        working_days: ["sat", "sun", "mon", "tue", "wed", "thu"],
      });
      onClose();
    } catch (err: any) {
      console.error("Failed to add employee:", err);
      let msg = "خطا در ثبت کارمند در سامانه.";
      if (err?.response?.data) {
        const d = err.response.data;
        if (typeof d === "string") msg = d;
        else if (d.detail) msg = d.detail;
        else msg = JSON.stringify(d);
      } else if (err?.message) {
        msg = err.message;
      }
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[4px] animate-in fade-in duration-200">
      <div className="w-full max-w-[580px] max-h-[92vh] overflow-y-auto rounded-[16px] border border-border bg-surface p-[22px] shadow-[0_20px_60px_rgba(15,23,42,0.15)] sm:p-[26px]">
        {/* Modal Header */}
        <div className="mb-[18px] flex items-center justify-between border-b border-border pb-[14px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-tint text-primary-dark">
                <Briefcase className="h-4 w-4" />
              </span>
              <h3 className="text-[17px] font-extrabold text-ink sm:text-[19px]">
                افزودن کارمند جدید
              </h3>
            </div>
            <p className="mt-1 text-[12.5px] text-ink-soft">
              ثبت مشخصات و دسترسی پرسنل و کادر اداری در سامانه
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition hover:bg-bg hover:text-ink cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="mb-[16px] flex items-start gap-2.5 rounded-[12px] border border-rose-200 bg-rose-50 p-[12px] text-[13px] text-rose-700 animate-in fade-in duration-150">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
          {/* Profile Picture Upload Section */}
          <div className="flex items-center gap-[16px] rounded-[14px] border border-dashed border-border bg-bg/50 p-[14px] transition-colors hover:border-primary/50">
            <div className="relative group shrink-0">
              <div className="relative flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-[18px] border-2 border-border bg-surface shadow-xs">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="تصویر پرسنلی"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-ink-faint">
                    <UserIcon className="h-[28px] w-[28px]" />
                  </div>
                )}
              </div>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, avatar: "" }))}
                  className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm hover:bg-rose-700 cursor-pointer"
                  title="حذف تصویر"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-ink">تصویر پرسنلی کارمند</div>
              <p className="mt-0.5 text-[11.5px] text-ink-soft">
                فرمت JPG یا PNG، فشرده‌سازی خودکار و بهینه‌شده
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-border bg-surface px-3 py-1.5 text-[12px] font-bold text-ink shadow-2xs hover:border-primary hover:bg-tint hover:text-primary-dark transition-all">
                  <Camera className="h-3.5 w-3.5" />
                  <span>{formData.avatar ? "تغییر تصویر" : "آپلود تصویر"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const dataUrl = await compressImage(file);
                        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
                      } catch { }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                نام <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: علی"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
              />
            </div>
            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                نام خانوادگی <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: محمدی"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                شماره همراه <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="09123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] pr-[36px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                ایمیل (اختیاری)
              </label>
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  placeholder="employee@gym.ir"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] pr-[36px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Role / Position */}
          <div>
            <label className="mb-[6px] block text-[13px] font-bold text-ink">
              سمت / جایگاه شغلی <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRESET_ROLES.map((role) => {
                const isSelected = formData.selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedRole: role })}
                    className={cn(
                      "rounded-[10px] border px-3 py-2 text-center text-[12.5px] font-bold transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-tint text-primary-dark shadow-2xs"
                        : "border-border bg-surface text-ink-soft hover:bg-bg hover:text-ink"
                    )}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            {formData.selectedRole === "سایر (تعریف عنوان دستی)" && (
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="عنوان دقیق سمت شغلی را بنویسید (مثال: کارشناس روابط عمومی)…"
                  value={formData.customRole}
                  onChange={(e) => setFormData({ ...formData, customRole: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
              </div>
            )}
          </div>

          {/* Shift & Gender */}
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                شیفت کاری
              </label>
              <select
                value={formData.work_shift}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    work_shift: e.target.value as any,
                  })
                }
                className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
              >
                <option value="full_time">تمام‌وقت (کامل)</option>
                <option value="morning">شیفت صبح</option>
                <option value="evening">شیفت عصر</option>
                <option value="morning_evening">دو شیفت (صبح و عصر)</option>
              </select>
            </div>

            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                جنسیت
              </label>
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "male" })}
                  className={cn(
                    "flex-1 rounded-[10px] border py-[9px] text-[13px] font-bold transition-all cursor-pointer",
                    formData.gender === "male"
                      ? "border-primary bg-tint text-primary-dark"
                      : "border-border bg-surface text-ink-soft hover:bg-bg"
                  )}
                >
                  مرد
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "female" })}
                  className={cn(
                    "flex-1 rounded-[10px] border py-[9px] text-[13px] font-bold transition-all cursor-pointer",
                    formData.gender === "female"
                      ? "border-primary bg-tint text-primary-dark"
                      : "border-border bg-surface text-ink-soft hover:bg-bg"
                  )}
                >
                  زن
                </button>
              </div>
            </div>
          </div>

          {/* Working Days */}
          <div>
            <label className="mb-[6px] block text-[13px] font-bold text-ink">
              روزهای کاری
            </label>
            <div className="flex flex-wrap gap-1.5">
              {WORKING_DAYS_OPTIONS.map((d) => {
                const active = formData.working_days.includes(d.key);
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => handleWorkingDayToggle(d.key)}
                    className={cn(
                      "rounded-[8px] border px-2.5 py-1.5 text-[12px] font-bold transition-all cursor-pointer",
                      active
                        ? "border-primary bg-tint text-primary-dark"
                        : "border-border bg-surface text-ink-faint hover:bg-bg"
                    )}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Date & Address */}
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                تاریخ شروع همکاری
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
              />
            </div>
            <div>
              <label className="mb-[6px] block text-[13px] font-bold text-ink">
                آدرس محل سکونت (اختیاری)
              </label>
              <input
                type="text"
                placeholder="خیابان، پلاک…"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-[10px] flex items-center justify-end gap-[10px] border-t border-border pt-[14px]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-[10px] border border-border px-[18px] py-[9px] text-[13.5px] font-semibold text-ink hover:bg-bg transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-[22px] py-[9px] text-[13.5px] font-bold text-white shadow-emerald transition-all duration-200 hover:-translate-y-[1px] hover:brightness-105 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال ثبت…</span>
                </>
              ) : (
                <span>ثبت کارمند</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
