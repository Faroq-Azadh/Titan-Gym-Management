"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ClubInfoTab } from "@/components/admin/settings/club-info-tab";
import { WorkingHoursTab } from "@/components/admin/settings/working-hours-tab";
import { NotificationsTab } from "@/components/admin/settings/notifications-tab";

type SettingsTab = "info" | "hours" | "notif";

export default function AdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("info");

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
          searchPlaceholder="جستجو در تنظیمات باشگاه…"
        />

        {/* Page Content */}
        <main className="flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="mb-[24px]">
            <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink min-[640px]:text-[26px]">
              تنظیمات باشگاه
            </h1>
            <div className="mt-[5px] text-[14px] text-ink-faint">
              اطلاعات، ساعات کاری و ترجیحات سیستم
            </div>
          </div>

          {/* Settings Card with Tabs */}
          <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            {/* Tabs Bar */}
            <div className="m-[20px_22px_0] flex flex-wrap gap-[4px] rounded-[12px] bg-bg p-[5px]">
              {/* Tab 1: Club Info */}
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={cn(
                  "inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-[15px] py-[9px] text-[13px] font-bold transition-all duration-180",
                  activeTab === "info"
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
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01" />
                </svg>
                <span>اطلاعات باشگاه</span>
              </button>

              {/* Tab 2: Working Hours */}
              <button
                type="button"
                onClick={() => setActiveTab("hours")}
                className={cn(
                  "inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-[15px] py-[9px] text-[13px] font-bold transition-all duration-180",
                  activeTab === "hours"
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>ساعات کاری</span>
              </button>

              {/* Tab 3: Notifications */}
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

            {/* Panels Content */}
            {activeTab === "info" && <ClubInfoTab />}
            {activeTab === "hours" && <WorkingHoursTab />}
            {activeTab === "notif" && <NotificationsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
