"use client";

import React, { useState, useMemo } from "react";
import { toPersianDigits } from "@/lib/persian-digits";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: "coach" | "staff";
  students: string;
  rating: string;
  status: "active" | "inactive";
}

const INITIAL_TEAM: TeamMember[] = [
  { id: "1", name: "آرش رستمی", role: "مربی بدنسازی", type: "coach", students: "۳۸", rating: "۴٫۹", status: "active" },
  { id: "2", name: "نگار سالاری", role: "مربی فیتنس", type: "coach", students: "۳۱", rating: "۴٫۸", status: "active" },
  { id: "3", name: "بهنام راد", role: "مربی کراس‌فیت", type: "coach", students: "۲۷", rating: "۴٫۶", status: "active" },
  { id: "4", name: "سپیده نوری", role: "مربی یوگا", type: "coach", students: "۱۹", rating: "۴٫۷", status: "active" },
  { id: "5", name: "کاوه احمدی", role: "مربی TRX", type: "coach", students: "۱۵", rating: "۴٫۵", status: "inactive" },
  { id: "6", name: "لیلا فروغی", role: "پذیرش", type: "staff", students: "—", rating: "—", status: "active" },
  { id: "7", name: "حسام مرادی", role: "مالی و حسابداری", type: "staff", students: "—", rating: "—", status: "active" },
];

const AVATAR_COLORS = [
  "#16E0A0",
  "#22D3EE",
  "#6366F1",
  "#F59E0B",
  "#EC4899",
  "#0EA5E9",
];

interface CoachesTableProps {
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
  onOpenAddModal?: () => void;
}

export function CoachesTable({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}: CoachesTableProps) {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [filter, setFilter] = useState<"all" | "coach" | "staff">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit states
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    type: "coach" | "staff";
    students: string;
    rating: string;
    status: "active" | "inactive";
  }>({
    name: "",
    role: "",
    type: "coach",
    students: "",
    rating: "۵٫۰",
    status: "active",
  });

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");
  };

  const filteredTeam = useMemo(() => {
    return team.filter((item) => {
      const matchesFilter = filter === "all" || item.type === filter;
      const matchesSearch = item.name.includes(searchQuery.trim());
      return matchesFilter && matchesSearch;
    });
  }, [team, filter, searchQuery]);

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined" && window.confirm("حذف این عضو تیم؟")) {
      setTeam((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleOpenEdit = (item: TeamMember) => {
    setEditingMember(item);
    setFormData({
      name: item.name,
      role: item.role,
      type: item.type,
      students: item.students,
      rating: item.rating,
      status: item.status,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setTeam((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: formData.name || m.name,
              role: formData.role || m.role,
              type: formData.type,
              students: formData.type === "staff" ? "—" : (formData.students || m.students),
              rating: formData.type === "staff" ? "—" : (formData.rating || m.rating),
              status: formData.status,
            }
          : m
      )
    );
    setEditingMember(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      role: formData.role.trim() || (formData.type === "coach" ? "مربی" : "کارمند"),
      type: formData.type,
      students: formData.type === "staff" ? "—" : (formData.students ? toPersianDigits(formData.students) : "۰"),
      rating: formData.type === "staff" ? "—" : (formData.rating ? toPersianDigits(formData.rating) : "۵٫۰"),
      status: formData.status,
    };
    setTeam((prev) => [newMember, ...prev]);
    setFormData({
      name: "",
      role: "",
      type: "coach",
      students: "",
      rating: "۵٫۰",
      status: "active",
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
            onClick={() => setFilter("coach")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "coach"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            مربی
          </button>
          <button
            type="button"
            onClick={() => setFilter("staff")}
            className={cn(
              "cursor-pointer rounded-[8px] px-[14px] py-[8px] text-[13px] font-bold transition-all duration-180",
              filter === "staff"
                ? "bg-surface text-ink shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                : "text-ink-faint hover:text-ink"
            )}
          >
            کارمند
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
            id="coSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام…"
            className="w-full border-none bg-transparent text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-[16px] border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        {/* Card Head */}
        <div className="flex items-center justify-between border-b border-border px-[22px] py-[20px]">
          <div>
            <h3 className="text-[16px] font-extrabold text-ink">فهرست تیم</h3>
            <div className="mt-[3px] text-[12.5px] text-ink-faint" id="rowInfo">
              نمایش {toPersianDigits(filteredTeam.length)} نفر
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  عضو تیم
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  نقش / تخصص
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  شاگردان
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  امتیاز
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint">
                  وضعیت
                </th>
                <th className="border-b border-border px-[22px] pb-[14px] text-right text-[12px] font-bold whitespace-nowrap text-ink-faint" />
              </tr>
            </thead>
            <tbody id="coBody">
              {filteredTeam.length > 0 ? (
                filteredTeam.map((item, index) => {
                  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
                  const isActive = item.status === "active";
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
                              {item.type === "coach" ? "مربی" : "کارمند"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.role}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.students}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        {item.rating !== "—" ? `⭐ ${item.rating}` : "—"}
                      </td>
                      <td className="px-[22px] py-[15px] text-[13.5px] whitespace-nowrap text-ink-soft">
                        <span
                          className={cn(
                            "inline-flex items-center gap-[6px] rounded-[100px] px-[11px] py-[5px] text-[12px] font-bold",
                            isActive
                              ? "bg-tint text-primary-dark"
                              : "bg-[#FFF1F2] text-[#9F1239]"
                          )}
                        >
                          <span
                            className={cn(
                              "h-[6px] w-[6px] rounded-full",
                              isActive ? "bg-primary" : "bg-[#F43F5E]"
                            )}
                          />
                          {isActive ? "فعال" : "غیرفعال"}
                        </span>
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
                    colSpan={6}
                    className="p-[40px] text-center text-[14px] text-ink-faint"
                  >
                    <div>عضوی در تیم پیدا نشد</div>
                    {onOpenAddModal && (
                      <button
                        type="button"
                        onClick={onOpenAddModal}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] bg-tint px-3 py-1.5 text-[12.5px] font-bold text-primary-dark hover:bg-primary/20 cursor-pointer"
                      >
                        + افزودن عضو جدید به تیم
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[4px]">
          <div className="w-full max-w-[480px] rounded-[16px] border border-border bg-surface p-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            <div className="mb-[20px] flex items-center justify-between border-b border-border pb-[14px]">
              <h3 className="text-[17px] font-extrabold text-ink">
                ویرایش اطلاعات — {editingMember.name}
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
                    نوع عضویت
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "coach" | "staff" })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    <option value="coach">مربی</option>
                    <option value="staff">کارمند</option>
                  </select>
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    نقش / تخصص
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
              </div>

              {formData.type === "coach" && (
                <div className="grid grid-cols-2 gap-[12px]">
                  <div>
                    <label className="mb-[6px] block text-[13px] font-bold text-ink">
                      تعداد شاگردان
                    </label>
                    <input
                      type="text"
                      value={formData.students}
                      onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                      className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                    />
                  </div>
                  <div>
                    <label className="mb-[6px] block text-[13px] font-bold text-ink">
                      امتیاز
                    </label>
                    <input
                      type="text"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  وضعیت
                </label>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "active" })}
                    className={cn(
                      "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all",
                      formData.status === "active"
                        ? "border-primary bg-tint text-primary-dark"
                        : "border-border bg-surface text-ink-soft"
                    )}
                  >
                    فعال
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "inactive" })}
                    className={cn(
                      "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all",
                      formData.status === "inactive"
                        ? "border-[#F43F5E] bg-[#FFF1F2] text-[#9F1239]"
                        : "border-border bg-surface text-ink-soft"
                    )}
                  >
                    غیرفعال
                  </button>
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[4px]">
          <div className="w-full max-w-[480px] rounded-[16px] border border-border bg-surface p-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            <div className="mb-[20px] flex items-center justify-between border-b border-border pb-[14px]">
              <h3 className="text-[17px] font-extrabold text-ink">
                افزودن مربی / کارمند جدید
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
                  placeholder="مثلا: کامران مولایی"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    نوع عضویت
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "coach" | "staff" })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    <option value="coach">مربی</option>
                    <option value="staff">کارمند</option>
                  </select>
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    نقش / تخصص
                  </label>
                  <input
                    type="text"
                    placeholder={formData.type === "coach" ? "مثلا: مربی پیلاتس" : "مثلا: پشتیبانی"}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                  />
                </div>
              </div>

              {formData.type === "coach" && (
                <div className="grid grid-cols-2 gap-[12px]">
                  <div>
                    <label className="mb-[6px] block text-[13px] font-bold text-ink">
                      تعداد شاگردان
                    </label>
                    <input
                      type="text"
                      placeholder="مثلا: ۲۰"
                      value={formData.students}
                      onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                      className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                    />
                  </div>
                  <div>
                    <label className="mb-[6px] block text-[13px] font-bold text-ink">
                      امتیاز اولیه
                    </label>
                    <input
                      type="text"
                      placeholder="مثلا: ۴٫۹"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  وضعیت
                </label>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "active" })}
                    className={cn(
                      "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all",
                      formData.status === "active"
                        ? "border-primary bg-tint text-primary-dark"
                        : "border-border bg-surface text-ink-soft"
                    )}
                  >
                    فعال
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "inactive" })}
                    className={cn(
                      "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all",
                      formData.status === "inactive"
                        ? "border-[#F43F5E] bg-[#FFF1F2] text-[#9F1239]"
                        : "border-border bg-surface text-ink-soft"
                    )}
                  >
                    غیرفعال
                  </button>
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
                  افزودن به تیم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
