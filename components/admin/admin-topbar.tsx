"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
  searchPlaceholder?: string;
  customAction?: React.ReactNode;
}

export function AdminTopbar({
  onToggleSidebar,
  searchPlaceholder = "جستجو…",
  customAction,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center gap-[16px] border-b border-border bg-[#FAFAF9]/85 px-[16px] backdrop-blur-[12px] min-[640px]:px-[28px]">
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] text-ink hover:bg-bg min-[981px]:hidden"
        aria-label="منو"
      >
        <Menu className="h-[22px] w-[22px] stroke-[2]" />
      </button>

      {/* Search Input */}
      <div className="hidden items-center gap-[10px] rounded-[12px] border border-border bg-surface px-[14px] py-[9px] transition-colors focus-within:border-primary min-[640px]:flex min-[640px]:w-[340px] min-[640px]:max-w-[40vw]">
        <Search className="h-[17px] w-[17px] shrink-0 text-ink-faint" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full border-none bg-transparent text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>

      {/* Topbar Actions */}
      <div className="mr-auto flex items-center gap-[10px]">
        <Link
          href="/admin/notifications"
          className="relative flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-border bg-surface text-ink-soft transition-all duration-180 hover:border-primary hover:bg-tint hover:text-ink"
          aria-label="اعلان‌ها"
        >
          <span className="absolute left-[11px] top-[9px] h-[8px] w-[8px] rounded-full border-2 border-surface bg-primary" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[19px] w-[19px]"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </Link>

        {customAction ? (
          customAction
        ) : (
          <Link
            href="/admin/messages"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-border bg-surface text-ink-soft transition-all duration-180 hover:border-primary hover:bg-tint hover:text-ink"
            aria-label="پیام‌ها"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[19px] w-[19px]"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}
