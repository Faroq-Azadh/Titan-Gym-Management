"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { BookingsKpi } from "@/components/admin/bookings/bookings-kpi";
import {
  BookingsTable,
  INITIAL_BOOKINGS,
  BookingItem,
} from "@/components/admin/bookings/bookings-table";

export default function AdminBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  const handleUpdateStatus = (id: string, newStatus: BookingItem["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleAddBooking = (newBookingData: Omit<BookingItem, "id">) => {
    const newBooking: BookingItem = {
      ...newBookingData,
      id: Date.now().toString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleExport = () => {
    const headers = ["نام عضو", "کلاس", "مربی", "زمان", "وضعیت"];
    const statusLabels: Record<BookingItem["status"], string> = {
      confirmed: "تأییدشده",
      pending: "در انتظار تأیید",
      cancelled: "لغوشده",
    };
    const rows = bookings.map((b) => [
      b.name,
      b.className,
      b.coach,
      b.time,
      statusLabels[b.status],
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `titan-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen">
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
          searchPlaceholder="جستجو…"
        />

        {/* Page Content */}
        <main className="flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px]">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink min-[640px]:text-[26px]">
                رزروها
              </h1>
              <div className="mt-[5px] text-[14px] text-ink-faint">
                مدیریت و تأیید درخواست‌های رزرو کلاس
              </div>
            </div>

            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex cursor-pointer items-center justify-center gap-[8px] whitespace-nowrap rounded-[10px] border-[1.5px] border-border bg-surface px-[14px] py-[8px] text-[13px] font-semibold text-ink transition-all duration-200 hover:border-primary hover:bg-tint"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[17px] w-[17px]"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>خروجی</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <BookingsKpi
            confirmedCount={confirmedCount}
            pendingCount={pendingCount}
            cancelledCount={cancelledCount}
          />

          {/* Bookings Table */}
          <BookingsTable
            bookings={bookings}
            onUpdateStatus={handleUpdateStatus}
            onAddBooking={handleAddBooking}
            onDeleteBooking={handleDeleteBooking}
            isAddModalOpen={isAddModalOpen}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onCloseAddModal={() => setIsAddModalOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}
