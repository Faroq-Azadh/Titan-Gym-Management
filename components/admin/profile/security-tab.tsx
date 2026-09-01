"use client";

import { useState } from "react";
import { ProfileSecurityData } from "./types";
import { Check } from "lucide-react";

interface SecurityTabProps {
  security: ProfileSecurityData;
  onUpdateSecurity: (updated: Partial<ProfileSecurityData>) => void;
}

export function SecurityTab({ security, onUpdateSecurity }: SecurityTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled);
  const [logoutOthers, setLogoutOthers] = useState(security.logoutOtherDevices);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("رمز عبور جدید و تکرار آن یکسان نیستند.");
      return;
    }

    onUpdateSecurity({
      twoFactorEnabled: twoFactor,
      logoutOtherDevices: logoutOthers,
    });

    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-[24px_22px]">
      <div className="text-[15px] font-extrabold text-ink">امنیت حساب</div>
      <div className="mb-[20px] text-[13px] text-ink-faint">
        رمز عبور و لایه‌های امنیتی ورود به پنل را مدیریت کنید.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-[16px] min-[640px]:grid-cols-2">
          {/* Current Password - Full width */}
          <div className="flex flex-col gap-[7px] min-[640px]:col-span-2">
            <label className="text-[13px] font-bold text-ink">رمز عبور فعلی</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">رمز عبور جدید</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">تکرار رمز جدید</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>
        </div>

        {/* Security Toggles */}
        <div className="mt-[20px] divide-y divide-border border-t border-border pt-[6px]">
          {/* 2FA */}
          <div className="flex items-center gap-[14px] py-[16px]">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-ink">
                احراز هویت دو مرحله‌ای
              </div>
              <div className="mt-[2px] text-[12.5px] text-ink-faint">
                دریافت کد یک‌بارمصرف هنگام ورود به پنل
              </div>
            </div>

            <label className="relative inline-block h-[26px] w-[46px] shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="peer sr-only"
              />
              <span className="block h-full w-full rounded-full bg-border transition-colors duration-200 peer-checked:bg-primary" />
              <span className="absolute top-[3px] right-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-xs transition-transform duration-200 peer-checked:-translate-x-[20px]" />
            </label>
          </div>

          {/* Logout others */}
          <div className="flex items-center gap-[14px] py-[16px]">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-ink">
                خروج از سایر دستگاه‌ها
              </div>
              <div className="mt-[2px] text-[12.5px] text-ink-faint">
                بستن همه‌ی نشست‌های فعال به جز این دستگاه
              </div>
            </div>

            <label className="relative inline-block h-[26px] w-[46px] shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={logoutOthers}
                onChange={(e) => setLogoutOthers(e.target.checked)}
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
            به‌روزرسانی رمز عبور
          </button>
          {saved && (
            <span className="mr-auto inline-flex items-center gap-[6px] text-[12.5px] font-bold text-primary-dark">
              <Check className="h-[15px] w-[15px]" />
              تنظیمات امنیتی به‌روز شد
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
