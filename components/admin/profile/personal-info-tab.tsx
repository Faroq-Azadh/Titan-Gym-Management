"use client";

import { useState } from "react";
import { ProfileUserData } from "./types";
import { Check } from "lucide-react";

interface PersonalInfoTabProps {
  user: ProfileUserData;
  onUpdateUser: (updated: Partial<ProfileUserData>) => void;
}

export function PersonalInfoTab({ user, onUpdateUser }: PersonalInfoTabProps) {
  const [formData, setFormData] = useState<ProfileUserData>(user);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setFormData(user);
  };

  return (
    <div className="p-[24px_22px]">
      <div className="text-[15px] font-extrabold text-ink">اطلاعات شخصی</div>
      <div className="mb-[20px] text-[13px] text-ink-faint">
        اطلاعات حساب کاربری شما به عنوان مدیر باشگاه.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-[16px] min-[640px]:grid-cols-2">
          {/* First Name */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">نام</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">نام خانوادگی</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">ایمیل</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">شماره تماس</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Role Select */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">نقش</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="select-input w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] font-medium text-ink focus:border-primary focus:bg-tint focus:outline-none"
              >
                <option value="مدیر باشگاه">مدیر باشگاه</option>
                <option value="مدیر شعبه">مدیر شعبه</option>
                <option value="پذیرش">پذیرش</option>
              </select>
            </div>
          </div>

          {/* Language Select */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">زبان پنل</label>
            <div className="relative">
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="select-input w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] font-medium text-ink focus:border-primary focus:bg-tint focus:outline-none"
              >
                <option value="فارسی">فارسی</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-[7px] min-[640px]:col-span-2">
            <label className="text-[13px] font-bold text-ink">درباره</label>
            <textarea
              rows={3}
              placeholder="توضیح کوتاه درباره خودتان…"
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="min-h-[84px] w-full resize-y rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] leading-[1.7] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-[22px] flex items-center justify-start gap-[10px] border-t border-border pt-[20px]">
          <button
            type="submit"
            className="rounded-[10px] bg-ink px-[18px] py-[8px] text-[13px] font-bold text-white transition-all hover:bg-primary-dark hover:shadow-[0_20px_50px_rgba(22,224,160,0.25)]"
          >
            ذخیره
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-[10px] border border-border bg-surface px-[16px] py-[8px] text-[13px] font-semibold text-ink-soft transition-colors hover:border-primary hover:bg-tint hover:text-ink"
          >
            بازنشانی
          </button>
          {saved && (
            <span className="mr-auto inline-flex items-center gap-[6px] text-[12.5px] font-bold text-primary-dark">
              <Check className="h-[15px] w-[15px]" />
              اطلاعات ذخیره شد
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
