"use client";

import { useState } from "react";
import { NotificationSettingItem } from "./types";
import { Check } from "lucide-react";

const INITIAL_NOTIFICATIONS: NotificationSettingItem[] = [
  {
    id: "notif-1",
    title: "یادآوری تمدید عضویت",
    description: "پیامک ۳ روز پیش از سررسید",
    enabled: true,
  },
  {
    id: "notif-2",
    title: "خوش‌آمدگویی عضو جدید",
    description: "پیامک خودکار هنگام ثبت‌نام",
    enabled: true,
  },
  {
    id: "notif-3",
    title: "یادآوری کلاس",
    description: "اعلان ۱ ساعت پیش از کلاس رزروشده",
    enabled: false,
  },
  {
    id: "notif-4",
    title: "گزارش روزانه‌ی مدیر",
    description: "خلاصه‌ی درآمد و حضور در پایان روز",
    enabled: true,
  },
];

export function NotificationsTab() {
  const [notifications, setNotifications] = useState<NotificationSettingItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-[24px_22px]">
      <div className="text-[15px] font-extrabold text-ink">اعلان‌ها</div>
      <div className="mb-[20px] text-[13px] text-ink-faint">
        تنظیم پیامک و اعلان‌های خودکار
      </div>

      <form onSubmit={handleSave}>
        <div className="divide-y divide-border">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-[14px] py-[16px]"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-ink">{item.title}</div>
                <div className="mt-[2px] text-[12.5px] text-ink-faint">
                  {item.description}
                </div>
              </div>

              {/* iOS style toggle switch */}
              <label className="relative inline-block h-[26px] w-[46px] shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle(item.id)}
                  className="peer sr-only"
                />
                <span className="block h-full w-full rounded-full bg-border transition-colors duration-200 peer-checked:bg-primary" />
                <span className="absolute top-[3px] right-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-xs transition-transform duration-200 peer-checked:-translate-x-[20px]" />
              </label>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="mt-[18px] flex items-center justify-end gap-[10px]">
          {saved && (
            <span className="ml-auto inline-flex items-center gap-[6px] text-[12.5px] font-bold text-primary-dark">
              <Check className="h-[15px] w-[15px]" />
              تنظیمات اعلان‌ها ذخیره شد
            </span>
          )}
          <button
            type="submit"
            className="rounded-[10px] bg-ink px-[20px] py-[8px] text-[13px] font-bold text-white transition-all hover:bg-primary-dark hover:shadow-[0_20px_50px_rgba(22,224,160,0.25)]"
          >
            ذخیره‌ی تنظیمات
          </button>
        </div>
      </form>
    </div>
  );
}
