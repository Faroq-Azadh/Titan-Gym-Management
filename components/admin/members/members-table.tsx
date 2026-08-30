"use client";

import React, { useState, useMemo } from "react";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

export interface MemberItem {
  id: string;
  code: number;
  name: string;
  plan: string;
  coach: string;
  status: "active" | "expiring" | "expired";
  joinDate: string;
  dueDate: string;
}

const INITIAL_MEMBERS: MemberItem[] = [
  { id: "1", code: 1000, name: "سارا محمدی", plan: "VIP سالانه", coach: "آرش رستمی", status: "active", joinDate: "۱۲ فروردین", dueDate: "۱۵ مرداد" },
  { id: "2", code: 1001, name: "رضا کاظمی", plan: "۳ماهه", coach: "آرش رستمی", status: "expiring", joinDate: "۲ فروردین", dueDate: "۲ تیر" },
  { id: "3", code: 1002, name: "مینا تهرانی", plan: "ماهانه", coach: "نگار سالاری", status: "active", joinDate: "۲۰ اردیبهشت", dueDate: "۲۰ مرداد" },
  { id: "4", code: 1003, name: "نیما اکبری", plan: "۶ماهه", coach: "آرش رستمی", status: "expired", joinDate: "۱۰ دی", dueDate: "۲۵ خرداد" },
  { id: "5", code: 1004, name: "کیان مرادی", plan: "ماهانه", coach: "نگار سالاری", status: "active", joinDate: "۵ خرداد", dueDate: "۱۰ شهریور" },
  { id: "6", code: 1005, name: "هانیه رضایی", plan: "VIP سالانه", coach: "بهنام راد", status: "expiring", joinDate: "۸ بهمن", dueDate: "۵ تیر" },
  { id: "7", code: 1006, name: "بهراد یوسفی", plan: "۳ماهه", coach: "بهنام راد", status: "active", joinDate: "۱۸ اردیبهشت", dueDate: "۱۸ مرداد" },
  { id: "8", code: 1007, name: "الناز کریمی", plan: "ماهانه", coach: "نگار سالاری", status: "active", joinDate: "۱ خرداد", dueDate: "۱ تیر" },
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
  MemberItem["status"],
  { label: string; bgClass: string; dotClass: string; textClass: string }
> = {
  active: {
    label: "فعال",
    bgClass: "bg-tint",
    dotClass: "bg-primary",
    textClass: "text-primary-dark",
  },
  expiring: {
    label: "رو به اتمام",
    bgClass: "bg-[#FFFBEB]",
    dotClass: "bg-[#F59E0B]",
    textClass: "text-[#B45309]",
  },
  expired: {
    label: "منقضی",
    bgClass: "bg-[#FFF1F2]",
    dotClass: "bg-[#F43F5E]",
    textClass: "text-[#9F1239]",
  },
};

interface MembersTableProps {
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
  onOpenAddModal?: () => void;
}

export function MembersTable({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}: MembersTableProps) {
  const [members, setMembers] = useState<MemberItem[]>(INITIAL_MEMBERS);
  const [filter, setFilter] = useState<"all" | "active" | "expiring" | "expired">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("1");
  
  // Edit & Add Member states
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    plan: string;
    coach: string;
    status: MemberItem["status"];
    joinDate: string;
    dueDate: string;
  }>({
    name: "",
    plan: "ماهانه",
    coach: "آرش رستمی",
    status: "active",
    joinDate: "",
    dueDate: "",
  });

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesFilter = filter === "all" || member.status === filter;
      const matchesSearch = member.name.includes(searchQuery.trim());
      return matchesFilter && matchesSearch;
    });
  }, [members, filter, searchQuery]);

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined" && window.confirm("حذف این عضو؟")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleOpenEdit = (member: MemberItem) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      plan: member.plan,
      coach: member.coach,
      status: member.status,
      joinDate: member.joinDate,
      dueDate: member.dueDate,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: formData.name || m.name,
              plan: formData.plan || m.plan,
              coach: formData.coach || m.coach,
              status: formData.status,
              joinDate: formData.joinDate || m.joinDate,
              dueDate: formData.dueDate || m.dueDate,
            }
          : m
      )
    );
    setEditingMember(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const newCode = members.length > 0 ? Math.max(...members.map((m) => m.code)) + 1 : 1000;
    const newMember: MemberItem = {
      id: Date.now().toString(),
      code: newCode,
      name: formData.name.trim(),
      plan: formData.plan,
      coach: formData.coach,
      status: formData.status,
      joinDate: formData.joinDate || "امروز",
      dueDate: formData.dueDate || "یک ماه بعد",
    };
    setMembers((prev) => [newMember, ...prev]);
    setFormData({
      name: "",
      plan: "ماهانه",
      coach: "آرش رستمی",
      status: "active",
      joinDate: "",
      dueDate: "",
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
            onClick={() => setFilter("active")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "active"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            فعال
          </button>
          <button
            type="button"
            onClick={() => setFilter("expiring")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "expiring"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            رو به اتمام
          </button>
          <button
            type="button"
            onClick={() => setFilter("expired")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "expired"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            منقضی
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
            id="memSearch"
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
            <h3 className="text-[16px] font-extrabold text-ink">فهرست اعضا</h3>
            <div className="mt-[3px] text-[12.5px] text-ink-faint" id="rowInfo">
              نمایش {toPersianDigits(filteredMembers.length)} عضو از ۱٬۲۴۸
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
                  پلن
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  مربی
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  وضعیت
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  تاریخ عضویت
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  سررسید
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint" />
              </tr>
            </thead>
            <tbody id="memBody">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((item, index) => {
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
                            <div className="text-[12px] text-ink-faint">
                              #{toPersianDigits(item.code)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.plan}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.coach}
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
                        {item.joinDate}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.dueDate}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        <div className="flex items-center gap-[4px]">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-ink-faint transition-all duration-150 hover:bg-tint hover:text-primary-dark"
                            aria-label="ویرایش"
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
                              <path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            </svg>
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-ink-faint transition-all duration-150 hover:bg-[#FFF1F2] hover:text-[#E11D48]"
                            aria-label="حذف"
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
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-[40px] text-center text-[14px] text-ink-faint"
                  >
                    <div>عضوی پیدا نشد</div>
                    {onOpenAddModal && (
                      <button
                        type="button"
                        onClick={onOpenAddModal}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] bg-tint px-3 py-1.5 text-[12.5px] font-bold text-primary-dark hover:bg-primary/20 cursor-pointer"
                      >
                        + افزودن عضو جدید
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pager Pagination */}
        <div className="flex items-center justify-center gap-[6px] p-[18px]">
          <button
            type="button"
            disabled
            className="min-w-[36px] h-[36px] cursor-default rounded-[10px] border border-border bg-surface px-[10px] text-[13.5px] font-bold text-ink-soft opacity-45 transition-all duration-150"
          >
            قبلی
          </button>
          {["۱", "۲", "۳"].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={cn(
                "min-w-[36px] h-[36px] cursor-pointer rounded-[10px] border px-[10px] text-[13.5px] font-bold transition-all duration-150",
                currentPage === page
                  ? "border-ink bg-ink text-white"
                  : "border-border bg-surface text-ink-soft hover:border-primary hover:bg-tint hover:text-primary-dark"
              )}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled
            className="min-w-[36px] h-[36px] cursor-default rounded-[10px] border border-border bg-surface px-[10px] text-[13.5px] font-bold text-ink-soft transition-all duration-150"
          >
            …
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage("۸۴")}
            className={cn(
              "min-w-[36px] h-[36px] cursor-pointer rounded-[10px] border px-[10px] text-[13.5px] font-bold transition-all duration-150",
              currentPage === "۸۴"
                ? "border-ink bg-ink text-white"
                : "border-border bg-surface text-ink-soft hover:border-primary hover:bg-tint hover:text-primary-dark"
            )}
          >
            ۸۴
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage("۲")}
            className="min-w-[36px] h-[36px] cursor-pointer rounded-[10px] border border-border bg-surface px-[10px] text-[13.5px] font-bold text-ink-soft transition-all duration-150 hover:border-primary hover:bg-tint hover:text-primary-dark"
          >
            بعدی
          </button>
        </div>
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[4px]">
          <div className="w-full max-w-[480px] rounded-[16px] border border-border bg-surface p-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            <div className="mb-[20px] flex items-center justify-between border-b border-border pb-[14px]">
              <h3 className="text-[17px] font-extrabold text-ink">
                ویرایش عضو — {editingMember.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-ink-faint hover:text-ink"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-[14px]">
              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    پلن
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    <option value="VIP سالانه">VIP سالانه</option>
                    <option value="۶ماهه">۶ماهه</option>
                    <option value="۳ماهه">۳ماهه</option>
                    <option value="ماهانه">ماهانه</option>
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
                    تاریخ عضویت
                  </label>
                  <input
                    type="text"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    سررسید
                  </label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  وضعیت
                </label>
                <div className="flex gap-[10px]">
                  {(["active", "expiring", "expired"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st })}
                      className={cn(
                        "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all",
                        formData.status === st
                          ? "border-primary bg-tint text-primary-dark"
                          : "border-border bg-surface text-ink-soft"
                      )}
                    >
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-[10px] flex justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="rounded-[10px] border border-border px-[16px] py-[9px] text-[13.5px] font-semibold text-ink hover:bg-bg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-[10px] bg-ink px-[20px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-primary-dark"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[4px]">
          <div className="w-full max-w-[480px] rounded-[16px] border border-border bg-surface p-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            <div className="mb-[20px] flex items-center justify-between border-b border-border pb-[14px]">
              <h3 className="text-[17px] font-extrabold text-ink">
                افزودن عضو جدید
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
                  نام و نام خانوادگی <span className="text-[#F43F5E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلا: علی رضایی"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    پلن انتخابی
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    <option value="VIP سالانه">VIP سالانه</option>
                    <option value="۶ماهه">۶ماهه</option>
                    <option value="۳ماهه">۳ماهه</option>
                    <option value="ماهانه">ماهانه</option>
                  </select>
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    مربی
                  </label>
                  <input
                    type="text"
                    placeholder="نام مربی"
                    value={formData.coach}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    تاریخ شروع
                  </label>
                  <input
                    type="text"
                    placeholder="مثلا: ۵ شهریور"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    تاریخ سررسید
                  </label>
                  <input
                    type="text"
                    placeholder="مثلا: ۵ مهر"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  وضعیت اولیه
                </label>
                <div className="flex gap-[10px]">
                  {(["active", "expiring", "expired"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st })}
                      className={cn(
                        "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all",
                        formData.status === st
                          ? "border-primary bg-tint text-primary-dark"
                          : "border-border bg-surface text-ink-soft"
                      )}
                    >
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
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
                  افزودن عضو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
