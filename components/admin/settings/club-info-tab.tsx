"use client";

import { useState } from "react";
import { ClubInfoData } from "./types";
import { Check } from "lucide-react";

export function ClubInfoTab() {
  const [formData, setFormData] = useState<ClubInfoData>({
    clubName: "باشگاه ورزشی تیتان",
    phoneNumber: "۰۲۱۴۴۵۵۶۶۷۷",
    email: "info@titan.fit",
    city: "تهران",
    address: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۲۰",
    about: "باشگاه تخصصی بدنسازی و فیتنس با مجهزترین امکانات و تیم مربیان حرفه‌ای.",
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setFormData({
      clubName: "باشگاه ورزشی تیتان",
      phoneNumber: "۰۲۱۴۴۵۵۶۶۷۷",
      email: "info@titan.fit",
      city: "تهران",
      address: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۲۰",
      about: "باشگاه تخصصی بدنسازی و فیتنس با مجهزترین امکانات و تیم مربیان حرفه‌ای.",
    });
  };

  return (
    <div className="p-[24px_22px]">
      <div className="text-[15px] font-extrabold text-ink">اطلاعات باشگاه</div>
      <div className="mb-[20px] text-[13px] text-ink-faint">
        این اطلاعات در فاکتورها و صفحه‌ی عمومی نمایش داده می‌شود
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

          {/* Phone Number */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">شماره تماس</label>
            <input
              type="text"
              required
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
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

          {/* City */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[13px] font-bold text-ink">شهر</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* Address - Full width */}
          <div className="flex flex-col gap-[7px] min-[640px]:col-span-2">
            <label className="text-[13px] font-bold text-ink">آدرس</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>

          {/* About Club - Full width */}
          <div className="flex flex-col gap-[7px] min-[640px]:col-span-2">
            <label className="text-[13px] font-bold text-ink">درباره‌ی باشگاه</label>
            <textarea
              rows={3}
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="min-h-[84px] w-full resize-y rounded-[12px] border-[1.5px] border-border bg-surface p-[11px_14px] text-[13.5px] leading-[1.7] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-[18px] flex items-center justify-end gap-[10px]">
          {saved && (
            <span className="ml-auto inline-flex items-center gap-[6px] text-[12.5px] font-bold text-primary-dark">
              <Check className="h-[15px] w-[15px]" />
              تغییرات با موفقیت ذخیره شد
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="rounded-[10px] border border-border bg-surface px-[14px] py-[8px] text-[13px] font-semibold text-ink-soft transition-colors hover:border-primary hover:bg-tint hover:text-ink"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="rounded-[10px] bg-ink px-[16px] py-[8px] text-[13px] font-bold text-white transition-all hover:bg-primary-dark hover:shadow-[0_20px_50px_rgba(22,224,160,0.25)]"
          >
            ذخیره‌ی تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}
