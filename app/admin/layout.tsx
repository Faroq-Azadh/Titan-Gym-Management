import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل مدیر باشگاه — تیتان",
  description: "داشبورد مدیریت و نظارت بر آمار، کلاس‌ها، اعضا و درآمد باشگاه ورزشی تیتان",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-bg text-ink">{children}</div>;
}
