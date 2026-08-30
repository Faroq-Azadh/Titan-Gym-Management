"use client";

import React, { useState, useMemo } from "react";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

export interface BookingItem {
  id: string;
  name: string;
  className: string;
  coach: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
}

const INITIAL_BOOKINGS: BookingItem[] = [
  { id: "1", name: "سارا محمدی", className: "یوگا", coach: "سپیده نوری", time: "شنبه ۱۰:۰۰", status: "confirmed" },
  { id: "2", name: "رضا کاظمی", className: "بدنسازی", coach: "آرش رستمی", time: "شنبه ۰۸:۰۰", status: "pending" },
  { id: "3", name: "مینا تهرانی", className: "فیتنس", coach: "نگار سالاری", time: "یکشنبه ۱۰:۰۰", status: "pending" },
  { id: "4", name: "امیر صادقی", className: "کراس‌فیت", coach: "بهنام راد", time: "شنبه ۱۷:۰۰", status: "confirmed" },
  { id: "5", name: "کیان مرادی", className: "TRX", coach: "کاوه احمدی", time: "چهارشنبه ۱۷:۰۰", status: "cancelled" },
  { id: "6", name: "هانیه رضایی", className: "یوگا", coach: "سپیده نوری", time: "سه‌شنبه ۱۰:۰۰", status: "confirmed" },
  { id: "7", name: "بهراد یوسفی", className: "بدنسازی", coach: "آرش رستمی", time: "دوشنبه ۰۸:۰۰", status: "pending" },
];

const AVATAR_COLORS = [
  "#16E0A0",
  "#22D3EE",
  "#6366F1",
  "#F59E0B",
  "#EC4899",
  "#0EA5E9",
  "#10B981",
  "#8B5CF6",
];

const STATUS_CONFIG: Record<
  BookingItem["status"],
  { label: string; bgClass: string; dotClass: string; textClass: string }
> = {
  confirmed: {
    label: "تأییدشده",
    bgClass: "bg-tint",
    dotClass: "bg-primary",
    textClass: "text-primary-dark",
  },
  pending: {
    label: "در انتظار",
    bgClass: "bg-[#FFFBEB]",
    dotClass: "bg-[#F59E0B]",
    textClass: "text-[#B45309]",
  },
  cancelled: {
    label: "لغوشده",
    bgClass: "bg-[#FFF1F2]",
    dotClass: "bg-[#F43F5E]",
    textClass: "text-[#9F1239]",
  },
};

interface BookingsTableProps {
  bookings: BookingItem[];
  onUpdateStatus: (id: string, newStatus: BookingItem["status"]) => void;
  onAddBooking: (booking: Omit<BookingItem, "id">) => void;
  onDeleteBooking: (id: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
  onOpenAddModal?: () => void;
}

export function BookingsTable({
  bookings,
  onUpdateStatus,
  onAddBooking,
  onDeleteBooking,
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}: BookingsTableProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState<{
    name: string;
    className: string;
    coach: string;
    time: string;
    status: BookingItem["status"];
  }>({
    name: "",
    className: "بدنسازی",
    coach: "آرش رستمی",
    time: "شنبه ۱۰:۰۰",
    status: "pending",
  });

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const matchesSearch = item.name.includes(searchQuery.trim());
      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, searchQuery]);

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onAddBooking({
      name: formData.name.trim(),
      className: formData.className,
      coach: formData.coach,
      time: formData.time,
      status: formData.status,
    });
    setFormData({
      name: "",
      className: "بدنسازی",
      coach: "آرش رستمی",
      time: "شنبه ۱۰:۰۰",
      status: "pending",
    });
    if (onCloseAddModal) onCloseAddModal();
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-[18px] flex flex-wrap items-center gap-[12px]">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-[4px] rounded-[10px] bg-bg p-[4px]" id="statusTabs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "all"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            همه
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "pending"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            در انتظار
          </button>
          <button
            type="button"
            onClick={() => setFilter("confirmed")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "confirmed"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            تأییدشده
          </button>
          <button
            type="button"
            onClick={() => setFilter("cancelled")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "cancelled"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            لغوشده
          </button>
        </div>

        {/* Search Field */}
        <div className="flex min-w-[240px] flex-1 max-w-[360px] items-center gap-[10px] rounded-[12px] border border-border bg-surface px-[14px] py-[9px] transition-colors focus-within:border-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[17px] w-[17px] shrink-0 text-ink-faint"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            id="bSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام عضو…"
            className="w-full border-none bg-transparent text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        {/* Card Head */}
        <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
          <div>
            <h3 className="text-[16px] font-extrabold text-ink">فهرست رزروها</h3>
            <div className="mt-[3px] text-[12.5px] text-ink-faint" id="rowInfo">
              نمایش {toPersianDigits(filteredBookings.length)} رزرو
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  عضو
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  کلاس
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  مربی
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  زمان
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  وضعیت
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint" />
              </tr>
            </thead>
            <tbody id="bBody">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((item, index) => {
                  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
                  const statusConf = STATUS_CONFIG[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border transition-colors duration-150 last:border-b-0 hover:bg-bg"
                    >
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        <div className="flex items-center gap-[11px]">
                          <span
                            className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] text-[13px] font-bold text-white shadow-xs"
                            style={{ backgroundColor: avatarColor }}
                          >
                            {getInitials(item.name)}
                          </span>
                          <div>
                            <div className="text-[13.5px] font-bold text-ink">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.className}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.coach}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.time}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        <span
                          className={cn(
                            "inline-flex items-center gap-[6px] rounded-[100px] px-[11px] py-[5px] text-[12px] font-bold",
                            statusConf.bgClass,
                            statusConf.textClass
                          )}
                        >
                          <span
                            className={cn("h-[6px] w-[6px] rounded-full", statusConf.dotClass)}
                          />
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.status === "pending" ? (
                          <div className="flex items-center gap-[6px]">
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(item.id, "confirmed")}
                              className="inline-flex cursor-pointer items-center justify-center rounded-[8px] bg-ink px-[10px] py-[6px] text-[12.5px] font-semibold text-white transition-all hover:bg-primary-dark"
                            >
                              تأیید
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(item.id, "cancelled")}
                              className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-border bg-surface px-[10px] py-[6px] text-[12.5px] font-semibold text-ink transition-all hover:border-[#F43F5E] hover:bg-[#FFF1F2] hover:text-[#9F1239]"
                            >
                              رد
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-[4px]">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateStatus(
                                  item.id,
                                  item.status === "cancelled" ? "confirmed" : "cancelled"
                                )
                              }
                              className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-ink-faint transition-all duration-150 hover:bg-[#FFF1F2] hover:text-[#E11D48]"
                              aria-label={item.status === "cancelled" ? "تأیید مجدد" : "لغو"}
                              title={item.status === "cancelled" ? "تأیید مجدد" : "لغو"}
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
                                <path d="M18 6 6 18M6 6l12 12" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (typeof window !== "undefined" && window.confirm("حذف این رزرو؟")) {
                                  onDeleteBooking(item.id);
                                }
                              }}
                              className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-ink-faint transition-all duration-150 hover:bg-[#FFF1F2] hover:text-[#E11D48]"
                              aria-label="حذف"
                              title="حذف"
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
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-[40px] text-center text-[14px] text-ink-faint"
                  >
                    <div>رزروی پیدا نشد</div>
                    {onOpenAddModal && (
                      <button
                        type="button"
                        onClick={onOpenAddModal}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] bg-tint px-3 py-1.5 text-[12.5px] font-bold text-primary-dark hover:bg-primary/20 cursor-pointer"
                      >
                        + ثبت رزرو جدید
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[4px]">
          <div className="w-full max-w-[480px] rounded-[16px] border border-border bg-surface p-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            <div className="mb-[20px] flex items-center justify-between border-b border-border pb-[14px]">
              <h3 className="text-[17px] font-extrabold text-ink">
                ثبت رزرو جدید
              </h3>
              <button
                type="button"
                onClick={onCloseAddModal}
                className="text-ink-faint hover:text-ink"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveNew} className="flex flex-col gap-[14px]">
              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  نام و نام خانوادگی عضو <span className="text-[#F43F5E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلا: مریم رضایی"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    کلاس
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    <option value="بدنسازی">بدنسازی</option>
                    <option value="فیتنس">فیتنس</option>
                    <option value="کراس‌فیت">کراس‌فیت</option>
                    <option value="یوگا">یوگا</option>
                    <option value="TRX">TRX</option>
                    <option value="پیلاتس">پیلاتس</option>
                  </select>
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    مربی
                  </label>
                  <input
                    type="text"
                    value={formData.coach}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    روز و ساعت
                  </label>
                  <input
                    type="text"
                    placeholder="مثلا: دوشنبه ۱۸:۰۰"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    وضعیت اولیه
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingItem["status"] })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    <option value="pending">در انتظار تأیید</option>
                    <option value="confirmed">تأییدشده</option>
                    <option value="cancelled">لغوشده</option>
                  </select>
                </div>
              </div>

              <div className="mt-[10px] flex justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="rounded-[10px] border border-border px-[16px] py-[9px] text-[13.5px] font-semibold text-ink hover:bg-bg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-[10px] bg-ink px-[20px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-emerald"
                >
                  ثبت رزرو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export { INITIAL_BOOKINGS };
