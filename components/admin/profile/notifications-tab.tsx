"use client";

import { useState } from "react";
import { ProfileNotificationData } from "./types";
import { Check } from "lucide-react";

interface NotificationsTabProps {
  notifications: ProfileNotificationData;
  onUpdateNotifications: (updated: Partial<ProfileNotificationData>) => void;
}

export function NotificationsTab({
  notifications,
  onUpdateNotifications,
}: NotificationsTabProps) {
  const [data, setData] = useState<ProfileNotificationData>(notifications);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof ProfileNotificationData) => {
    setData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNotifications(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-[24px_22px]">
      <div className="text-[15px] font-extrabold text-ink">اعلان‌ها</div>
      <div className="mb-[20px] text-[13px] text-ink-faint">
        انتخاب کنید چه رویدادهایی به شما اطلاع داده شوند.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="divide-y divide-border">
          {/* 1. Email New Members */}
          <div className="flex items-center gap-[14px] py-[16px]">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-ink">
                ایمیل عضویت‌های جدید
              </div>
              <div className="mt-[2px] text-[12.5px] text-ink-faint">
                هنگام ثبت‌نام یا تمدید عضو
              </div>
            </div>

            <label className="relative inline-block h-[26px] w-[46px] shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={data.emailNewMembers}
                onChange={() => handleToggle("emailNewMembers")}
                className="peer sr-only"
              />
              <span className="block h-full w-full rounded-full bg-border transition-colors duration-200 peer-checked:bg-primary" />
              <span className="absolute top-[3px] right-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-xs transition-transform duration-200 peer-checked:-translate-x-[20px]" />
            </label>
          </div>

          {/* 2. Alert Failed Payment */}
          <div className="flex items-center gap-[14px] py-[16px]">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-ink">
                هشدار پرداخت ناموفق
              </div>
              <div className="mt-[2px] text-[12.5px] text-ink-faint">
                اطلاع‌رسانی فوری تراکنش‌های ناموفق
              </div>
            </div>

            <label className="relative inline-block h-[26px] w-[46px] shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={data.alertFailedPayment}
                onChange={() => handleToggle("alertFailedPayment")}
                className="peer sr-only"
              />
              <span className="block h-full w-full rounded-full bg-border transition-colors duration-200 peer-checked:bg-primary" />
              <span className="absolute top-[3px] right-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-xs transition-transform duration-200 peer-checked:-translate-x-[20px]" />
            </label>
          </div>

          {/* 3. SMS Expiry Reminder */}
          <div className="flex items-center gap-[14px] py-[16px]">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-ink">
                پیامک یادآوری انقضا
              </div>
              <div className="mt-[2px] text-[12.5px] text-ink-faint">
                ارسال پیامک به اعضای رو به اتمام
              </div>
            </div>

            <label className="relative inline-block h-[26px] w-[46px] shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={data.smsExpiryReminder}
                onChange={() => handleToggle("smsExpiryReminder")}
                className="peer sr-only"
              />
              <span className="block h-full w-full rounded-full bg-border transition-colors duration-200 peer-checked:bg-primary" />
              <span className="absolute top-[3px] right-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-xs transition-transform duration-200 peer-checked:-translate-x-[20px]" />
            </label>
          </div>

          {/* 4. Weekly Report */}
          <div className="flex items-center gap-[14px] py-[16px]">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-ink">
                گزارش هفتگی عملکرد
              </div>
              <div className="mt-[2px] text-[12.5px] text-ink-faint">
                خلاصه‌ی درآمد و حضور هر شنبه
              </div>
            </div>

            <label className="relative inline-block h-[26px] w-[46px] shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={data.weeklyReport}
                onChange={() => handleToggle("weeklyReport")}
                className="peer sr-only"
              />
              <span className="block h-full w-full rounded-full bg-border transition-colors duration-200 peer-checked:bg-primary" />
              <span className="absolute top-[3px] right-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-xs transition-transform duration-200 peer-checked:-translate-x-[20px]" />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-[22px] flex items-center justify-start gap-[10px] border-t border-border pt-[20px]">
          <button
            type="submit"
            className="rounded-[10px] bg-ink px-[18px] py-[8px] text-[13px] font-bold text-white transition-all hover:bg-primary-dark hover:shadow-[0_20px_50px_rgba(22,224,160,0.25)]"
          >
            ذخیره ترجیحات
          </button>
          {saved && (
            <span className="mr-auto inline-flex items-center gap-[6px] text-[12.5px] font-bold text-primary-dark">
              <Check className="h-[15px] w-[15px]" />
              ترجیحات اعلان‌ها ذخیره شد
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
