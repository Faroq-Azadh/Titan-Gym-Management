"use client";

import { useState } from "react";
import { ProfileClubData } from "./types";
import { Check } from "lucide-react";

interface ClubInfoTabProps {
  club: ProfileClubData;
  onUpdateClub: (updated: Partial<ProfileClubData>) => void;
}

export function ClubInfoTab({ club, onUpdateClub }: ClubInfoTabProps) {
  const [formData, setFormData] = useState<ProfileClubData>(club);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClub(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setFormData(club);
  };

  return (
    <div className="p-[24px_22px]">
      <div className="text-[15px] font-extrabold text-ink">اطلاعات باشگاه</div>
      <div className="mb-[20px] text-[13px] text-ink-faint">
        مشخصات باشگاه که در رسیدها و پروفایل اعضا استفاده می‌شود.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-[16px] min-[640px]:grid-cols-2">
          {/* Club Name */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">نام باشگاه</label>
            <input
              type="text"
              required
              value={formData.clubName}
              onChange={(e) =>
                setFormData({ ...formData, clubName: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Club Phone */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">شماره تماس باشگاه</label>
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

          {/* Start Hour */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">ساعت شروع کار</label>
            <input
              type="text"
              required
              value={formData.startHour}
              onChange={(e) =>
                setFormData({ ...formData, startHour: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* End Hour */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">ساعت پایان کار</label>
            <input
              type="text"
              required
              value={formData.endHour}
              onChange={(e) =>
                setFormData({ ...formData, endHour: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-[7px] min-[640px]:col-span-2">
            <label className="text-[13px] font-bold text-ink">آدرس</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
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
              اطلاعات باشگاه ذخیره شد
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
