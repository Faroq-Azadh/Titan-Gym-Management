"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ProfileSummaryCard } from "@/components/admin/profile/profile-summary-card";
import { PersonalInfoTab } from "@/components/admin/profile/personal-info-tab";
import { ClubInfoTab } from "@/components/admin/profile/club-info-tab";
import { SecurityTab } from "@/components/admin/profile/security-tab";
import { NotificationsTab } from "@/components/admin/profile/notifications-tab";
import {
  ProfileUserData,
  ProfileClubData,
  ProfileSecurityData,
  ProfileNotificationData,
} from "@/components/admin/profile/types";

type ProfileTab = "personal" | "club" | "security" | "notif";

export default function AdminProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

  const [user, setUser] = useState<ProfileUserData>({
    firstName: "اشکان",
    lastName: "وکیلی",
    email: "ascendp07@gmail.com",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    role: "مدیر باشگاه",
    language: "فارسی",
    about: "مدیر باشگاه ورزشی تیتان، علاقه‌مند به مدیریت هوشمند و تجربه کاربری اعضا.",
    branch: "تیتان — مرکزی",
    memberSince: "فروردین ۱۴۰۲",
  });

  const [club, setClub] = useState<ProfileClubData>({
    clubName: "باشگاه ورزشی تیتان",
    phone: "۰۲۱۸۸۷۷۶۶۵۵",
    startHour: "۰۶:۰۰",
    endHour: "۲۳:۰۰",
    address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۸، طبقه همکف",
  });

  const [security, setSecurity] = useState<ProfileSecurityData>({
    twoFactorEnabled: true,
    logoutOtherDevices: false,
  });

  const [notifications, setNotifications] = useState<ProfileNotificationData>({
    emailNewMembers: true,
    alertFailedPayment: true,
    smsExpiryReminder: true,
    weeklyReport: true,
  });

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
          searchPlaceholder="جستجو در پروفایل و تنظیمات…"
        />

        {/* Page Content */}
        <main className="flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px]">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink min-[640px]:text-[26px]">
                پروفایل مدیر
              </h1>
              <div className="mt-[5px] text-[14px] text-ink-faint">
                مدیریت حساب کاربری، اطلاعات باشگاه و تنظیمات امنیتی
              </div>
            </div>

            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                className="rounded-[10px] border-[1.5px] border-border bg-surface px-[14px] py-[8px] text-[13px] font-semibold text-ink transition-colors hover:border-primary hover:bg-tint"
              >
                انصراف
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-[6px] rounded-[10px] bg-ink px-[16px] py-[8px] text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-primary-dark hover:shadow-[0_20px_50px_rgba(22,224,160,0.25)]"
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <path d="M17 21v-8H7v8M7 3v5h8" />
                </svg>
                <span>ذخیره تغییرات</span>
              </button>
            </div>
          </div>

          {/* Profile 2-Column Grid (320px / 1fr) */}
          <div className="grid grid-cols-1 items-start gap-[18px] min-[980px]:grid-cols-[320px_1fr]">
            {/* Summary Left Card */}
            <ProfileSummaryCard user={user} />

            {/* Right Card with Tabs */}
            <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              {/* Tabs Bar */}
              <div className="m-[20px_22px_0] flex flex-wrap gap-[4px] rounded-[12px] bg-bg p-[5px]">
                {/* Personal Info Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("personal")}
                  className={cn(
                    "inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-[15px] py-[9px] text-[13px] font-bold transition-all duration-180",
                    activeTab === "personal"
                      ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                      : "text-ink-faint hover:text-ink",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[15px] w-[15px]"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>اطلاعات شخصی</span>
                </button>

                {/* Club Info Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("club")}
                  className={cn(
                    "inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-[15px] py-[9px] text-[13px] font-bold transition-all duration-180",
                    activeTab === "club"
                      ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                      : "text-ink-faint hover:text-ink",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[15px] w-[15px]"
                  >
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                  <span>اطلاعات باشگاه</span>
                </button>

                {/* Security Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={cn(
                    "inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-[15px] py-[9px] text-[13px] font-bold transition-all duration-180",
                    activeTab === "security"
                      ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                      : "text-ink-faint hover:text-ink",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[15px] w-[15px]"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>امنیت</span>
                </button>

                {/* Notifications Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("notif")}
                  className={cn(
                    "inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-[15px] py-[9px] text-[13px] font-bold transition-all duration-180",
                    activeTab === "notif"
                      ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                      : "text-ink-faint hover:text-ink",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[15px] w-[15px]"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  <span>اعلان‌ها</span>
                </button>
              </div>

              {/* Tab Panels */}
              {activeTab === "personal" && (
                <PersonalInfoTab
                  user={user}
                  onUpdateUser={(updated) =>
                    setUser((prev) => ({ ...prev, ...updated }))
                  }
                />
              )}
              {activeTab === "club" && (
                <ClubInfoTab
                  club={club}
                  onUpdateClub={(updated) =>
                    setClub((prev) => ({ ...prev, ...updated }))
                  }
                />
              )}
              {activeTab === "security" && (
                <SecurityTab
                  security={security}
                  onUpdateSecurity={(updated) =>
                    setSecurity((prev) => ({ ...prev, ...updated }))
                  }
                />
              )}
              {activeTab === "notif" && (
                <NotificationsTab
                  notifications={notifications}
                  onUpdateNotifications={(updated) =>
                    setNotifications((prev) => ({ ...prev, ...updated }))
                  }
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
