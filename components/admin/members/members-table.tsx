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

import {
  useMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
} from "@/lib/hooks/queries/use-members";
import { usePlans } from "@/lib/hooks/queries/use-plans";
import { useCoaches } from "@/lib/hooks/queries/use-coaches";
import { plansService } from "@/lib/api/services/plans.service";
import { Loader2 } from "lucide-react";

interface PlanOption {
  id?: string;
  name: string;
  durationDays: number;
  price: number;
  label: string;
}

const DEFAULT_PLANS: PlanOption[] = [
  { name: "ماهانه", durationDays: 30, price: 980000, label: "ماهانه (۳۰ روزه) - ۹۸۰,۰۰۰ تومان" },
  { name: "۳ ماهه", durationDays: 90, price: 2500000, label: "۳ ماهه (۹۰ روزه) - ۲,۵۰۰,۰۰۰ تومان" },
  { name: "۶ ماهه", durationDays: 180, price: 4800000, label: "۶ ماهه (۱۸۰ روزه) - ۴,۸۰۰,۰۰۰ تومان" },
  { name: "VIP سالانه", durationDays: 365, price: 8900000, label: "VIP سالانه (۳۶۵ روزه) - ۸,۹۰۰,۰۰۰ تومان" },
];

const DEFAULT_COACHES = [
  { name: "بدون مربی", specialty: "" },
  { name: "آرش رستمی", specialty: "مربی بدنسازی" },
  { name: "نگار سالاری", specialty: "مربی فیتنس" },
  { name: "بهنام راد", specialty: "مربی کراس‌فیت" },
  { name: "سپیده نوری", specialty: "مربی یوگا" },
  { name: "کاوه احمدی", specialty: "مربی TRX" },
];

function getTodayIso(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysIso(isoDate: string, days: number): string {
  try {
    const parts = isoDate.split("-").map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      d.setDate(d.getDate() + days);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    const d = new Date(isoDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  } catch {
    return isoDate;
  }
}

function formatPersianDateDisplay(dateStr?: string | null): string {
  if (!dateStr || dateStr === "—") return "—";
  try {
    const parts = dateStr.split("-").map(Number);
    let d: Date;
    if (parts.length === 3) {
      d = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fa-IR", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatPersianDateFull(dateStr?: string | null): string {
  if (!dateStr || dateStr === "—") return "—";
  try {
    const parts = dateStr.split("-").map(Number);
    let d: Date;
    if (parts.length === 3) {
      d = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isUuid(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function MembersTable({
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}: MembersTableProps) {
  const [filter, setFilter] = useState<"all" | "active" | "expiring" | "expired">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("1");

  const { data: membersResponse, isLoading: isQueryLoading } = useMembers({
    status: filter === "all" ? undefined : filter,
    search: searchQuery || undefined,
  });

  const { data: backendPlans } = usePlans();
  const { data: backendCoaches } = useCoaches();

  const plansList: any[] = Array.isArray(backendPlans)
    ? backendPlans
    : Array.isArray((backendPlans as any)?.results)
      ? (backendPlans as any).results
      : Array.isArray((backendPlans as any)?.plans)
        ? (backendPlans as any).plans
        : [];

  const coachesList: any[] = Array.isArray(backendCoaches)
    ? backendCoaches
    : Array.isArray((backendCoaches as any)?.results)
      ? (backendCoaches as any).results
      : Array.isArray((backendCoaches as any)?.coaches)
        ? (backendCoaches as any).coaches
        : [];

  const planOptions: PlanOption[] = useMemo(() => {
    if (plansList && plansList.length > 0) {
      return plansList.map((p: any) => {
        const priceNum = typeof p.price === "string" ? parseFloat(p.price) : (p.price || 0);
        const days = p.duration_days || 30;
        return {
          id: String(p.id),
          name: p.name,
          durationDays: days,
          price: priceNum,
          label: `${p.name} (${toPersianDigits(days)} روزه)${priceNum ? ` - ${priceNum.toLocaleString("fa-IR")} تومان` : ""}`,
        };
      });
    }
    return DEFAULT_PLANS;
  }, [plansList]);

  const coachOptions = useMemo(() => {
    if (coachesList && coachesList.length > 0) {
      return coachesList.map((c: any) => {
        const coachName = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.name || "مربی";
        const spec = Array.isArray(c.specialties) && c.specialties.length > 0 ? ` (${c.specialties.join("، ")})` : "";
        return {
          id: String(c.id),
          name: coachName,
          label: `${coachName}${spec}`,
        };
      });
    }
    return DEFAULT_COACHES.map((c) => ({
      id: undefined,
      name: c.name,
      label: c.specialty ? `${c.name} (${c.specialty})` : c.name,
    }));
  }, [coachesList]);

  const createMemberMutation = useCreateMember();
  const updateMemberMutation = useUpdateMember();
  const deleteMemberMutation = useDeleteMember();

  const [localOverrides, setLocalOverrides] = useState<
    Record<
      string,
      {
        plan?: string;
        coach?: string;
        status?: MemberItem["status"];
        joinDate?: string;
        dueDate?: string;
      }
    >
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("titan_gym_members_overrides");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  const [localAddedMembers, setLocalAddedMembers] = useState<MemberItem[]>([]);

  const [deletedMemberIds, setDeletedMemberIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("titan_gym_deleted_member_ids");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const members: MemberItem[] = useMemo(() => {
    const list: any[] = Array.isArray(membersResponse)
      ? membersResponse
      : Array.isArray(membersResponse?.results)
        ? membersResponse.results
        : Array.isArray((membersResponse as any)?.members)
          ? (membersResponse as any).members
          : [];

    const mappedBackend = list
      .filter((m: any) => m.is_active !== false)
      .map((m: any, idx: number) => {
        const override = localOverrides[String(m.id)] || {};
        const fullName =
          m.full_name ||
          `${m.first_name || ""} ${m.last_name || ""}`.trim() ||
          m.name ||
          "ورزشکار";

        const rawStatus = (m.membership_status || m.status || "").toLowerCase();
        let derivedStatus: MemberItem["status"] = "active";
        if (rawStatus === "expiring" || rawStatus === "رو به اتمام") {
          derivedStatus = "expiring";
        } else if (rawStatus === "expired" || rawStatus === "منقضی") {
          derivedStatus = "expired";
        } else if (rawStatus === "active" || rawStatus === "فعال") {
          derivedStatus = "active";
        } else if (m.is_active === false) {
          derivedStatus = "expired";
        }

        const joinDate =
          override.joinDate ||
          formatPersianDateDisplay(m.start_date || m.membership_start_date || m.created_at);

        const dueDate =
          override.dueDate ||
          formatPersianDateDisplay(m.due_date || m.membership_expiry_date);

        const plan =
          override.plan ||
          m.plan_name ||
          m.current_plan_name ||
          "ماهانه";

        const coach =
          override.coach ||
          m.coach_name ||
          m.assigned_coach_name ||
          "بدون مربی";

        const status = override.status || derivedStatus;

        return {
          id: String(m.id),
          code: 1000 + idx,
          name: fullName,
          plan,
          coach,
          status,
          joinDate,
          dueDate,
        };
      });

    // Merge with any localAddedMembers that aren't yet in mappedBackend
    const backendIds = new Set(mappedBackend.map((b) => b.id));
    const extraLocal = localAddedMembers.filter((lm) => !backendIds.has(lm.id));

    const combined = [...extraLocal, ...mappedBackend];

    return combined.filter((m) => !deletedMemberIds.includes(String(m.id)));
  }, [membersResponse, localOverrides, localAddedMembers, deletedMemberIds]);

  // Edit & Add Member states
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    phoneNumber: string;
    planId: string;
    planName: string;
    coachId: string;
    coachName: string;
    gender: "MALE" | "FEMALE";
    status: MemberItem["status"];
    startDateRaw: string;
    dueDateRaw: string;
    joinDate: string;
    dueDate: string;
  }>({
    name: "",
    phoneNumber: "",
    planId: "",
    planName: "ماهانه",
    coachId: "",
    coachName: "بدون مربی",
    gender: "MALE",
    status: "active",
    startDateRaw: getTodayIso(),
    dueDateRaw: addDaysIso(getTodayIso(), 30),
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

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined" && window.confirm("آیا از حذف این عضو اطمینان دارید؟")) {
      const idStr = String(id);

      // 1. Immediately hide from UI and persist
      setDeletedMemberIds((prev) => {
        const next = Array.from(new Set([...prev, idStr]));
        try {
          localStorage.setItem("titan_gym_deleted_member_ids", JSON.stringify(next));
        } catch {}
        return next;
      });

      // 2. Remove from local added list
      setLocalAddedMembers((prev) => prev.filter((m) => String(m.id) !== idStr));

      // 3. If it's a backend member, delete or deactivate on Django
      const isInitialMock = ["1", "2", "3", "4", "5", "6", "7", "8"].includes(idStr);
      if (!isInitialMock) {
        try {
          await deleteMemberMutation.mutateAsync(id);
        } catch (err) {
          console.error("Failed to delete member on Django:", err);
        }
      }
    }
  };

  const handleOpenEdit = (member: MemberItem) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      phoneNumber: "",
      planId: "",
      planName: member.plan,
      coachId: "",
      coachName: member.coach,
      gender: "MALE",
      status: member.status,
      startDateRaw: getTodayIso(),
      dueDateRaw: addDaysIso(getTodayIso(), 30),
      joinDate: member.joinDate,
      dueDate: member.dueDate,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const parts = formData.name.trim().split(/\s+/);
    const first_name = parts[0] || "";
    const last_name = parts.slice(1).join(" ") || "عضو";

    try {
      if (isUuid(editingMember.id)) {
        await updateMemberMutation.mutateAsync({
          id: editingMember.id,
          payload: {
            first_name,
            last_name,
          },
        });
      }

      const updatedOverride = {
        plan: formData.planName,
        coach: formData.coachName,
        status: formData.status,
        joinDate: formData.joinDate || editingMember.joinDate,
        dueDate: formData.dueDate || editingMember.dueDate,
      };

      setLocalOverrides((prev) => {
        const next = { ...prev, [editingMember.id]: updatedOverride };
        try {
          localStorage.setItem("titan_gym_members_overrides", JSON.stringify(next));
        } catch {}
        return next;
      });

      setLocalAddedMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: `${first_name} ${last_name}`.trim(),
                plan: formData.planName,
                coach: formData.coachName,
                status: formData.status,
                joinDate: formData.joinDate || m.joinDate,
                dueDate: formData.dueDate || m.dueDate,
              }
            : m
        )
      );
    } catch (err) {
      console.error("Error editing member:", err);
    }
    setEditingMember(null);
  };

  const handlePlanChange = (selectedVal: string) => {
    const chosen =
      planOptions.find((p) => (p.id && p.id === selectedVal) || p.name === selectedVal) ||
      planOptions[0];
    if (chosen) {
      const newDue = addDaysIso(formData.startDateRaw || getTodayIso(), chosen.durationDays || 30);
      setFormData((prev) => ({
        ...prev,
        planId: chosen.id || "",
        planName: chosen.name,
        dueDateRaw: newDue,
      }));
    }
  };

  const handleStartDateChange = (newDate: string) => {
    const chosen =
      planOptions.find(
        (p) => (p.id && p.id === formData.planId) || p.name === formData.planName
      ) || planOptions[0];
    const days = chosen?.durationDays || 30;
    const newDue = addDaysIso(newDate, days);
    setFormData((prev) => ({
      ...prev,
      startDateRaw: newDate,
      dueDateRaw: newDue,
    }));
  };

  const handleCoachChange = (selectedVal: string) => {
    const chosen = coachOptions.find(
      (c) => (c.id && c.id === selectedVal) || c.name === selectedVal
    );
    setFormData((prev) => ({
      ...prev,
      coachId: chosen?.id || "",
      coachName: chosen?.name || selectedVal || "بدون مربی",
    }));
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const parts = formData.name.trim().split(/\s+/);
    const first_name = parts[0] || "";
    const last_name = parts.slice(1).join(" ") || "عضو";

    // Clean phone number (convert Persian numbers to English digits)
    const rawPhone = formData.phoneNumber
      ? formData.phoneNumber
          .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
          .replace(/[^\d]/g, "")
      : "";
    const phone_number = rawPhone || "09" + Math.floor(100000000 + Math.random() * 900000000);

    const start_date = formData.startDateRaw || getTodayIso();

    let planIdToSend: string | undefined = undefined;
    if (isUuid(formData.planId)) {
      planIdToSend = formData.planId;
    } else {
      const existingPlan = plansList.find(
        (p: any) => p.name === formData.planName && isUuid(p.id)
      );
      if (existingPlan) {
        planIdToSend = existingPlan.id;
      } else {
        try {
          const chosenPreset =
            DEFAULT_PLANS.find((p) => p.name === formData.planName) || DEFAULT_PLANS[0];
          const createdPlan = await plansService.createPlan({
            name: chosenPreset.name,
            duration_days: chosenPreset.durationDays,
            price: chosenPreset.price,
          });
          if (createdPlan && isUuid(createdPlan.id)) {
            planIdToSend = createdPlan.id;
          }
        } catch {
          // Proceed without membership_plan_id
        }
      }
    }

    let coachIdToSend: string | undefined = undefined;
    if (isUuid(formData.coachId)) {
      coachIdToSend = formData.coachId;
    } else if (formData.coachName && formData.coachName !== "بدون مربی") {
      const existingCoach = coachesList.find(
        (c: any) =>
          (c.full_name === formData.coachName || c.name === formData.coachName) &&
          isUuid(c.id)
      );
      if (existingCoach) {
        coachIdToSend = existingCoach.id;
      }
    }

    try {
      const createdMember = await createMemberMutation.mutateAsync({
        first_name,
        last_name,
        phone_number,
        membership_plan_id: planIdToSend,
        assigned_coach_id: coachIdToSend,
        gender: formData.gender,
        start_date,
        coach_notes:
          !coachIdToSend && formData.coachName && formData.coachName !== "بدون مربی"
            ? `مربی: ${formData.coachName}`
            : undefined,
      });

      const memberId = createdMember?.id ? String(createdMember.id) : `mem-${Date.now()}`;
      const joinDateStr = formatPersianDateDisplay(start_date);
      const dueDateStr = formatPersianDateDisplay(formData.dueDateRaw);

      const newOverride = {
        plan: formData.planName,
        coach: formData.coachName,
        status: formData.status,
        joinDate: joinDateStr,
        dueDate: dueDateStr,
      };

      setLocalOverrides((prev) => {
        const next = { ...prev, [memberId]: newOverride };
        try {
          localStorage.setItem("titan_gym_members_overrides", JSON.stringify(next));
        } catch {}
        return next;
      });

      const newMemberItem: MemberItem = {
        id: memberId,
        code: 1000 + members.length,
        name: `${first_name} ${last_name}`.trim(),
        plan: formData.planName,
        coach: formData.coachName,
        status: formData.status,
        joinDate: joinDateStr,
        dueDate: dueDateStr,
      };
      setLocalAddedMembers((prev) => [newMemberItem, ...prev.filter((m) => m.id !== memberId)]);

      setFormData({
        name: "",
        phoneNumber: "",
        planId: "",
        planName: "ماهانه",
        coachId: "",
        coachName: "بدون مربی",
        gender: "MALE",
        status: "active",
        startDateRaw: getTodayIso(),
        dueDateRaw: addDaysIso(getTodayIso(), 30),
        joinDate: "",
        dueDate: "",
      });

      if (onCloseAddModal) onCloseAddModal();
    } catch (err: any) {
      console.error("Failed to create member:", err);
      const msg =
        err?.message ||
        err?.detail ||
        (typeof err === "string" ? err : "خطا در ثبت عضو در پنل جنگو. لطفاً اطلاعات را بررسی کنید.");
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
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
              نمایش {toPersianDigits(filteredMembers.length)} عضو از {toPersianDigits(members.length)}
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
              ) : isQueryLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-[44px] text-center text-[14px] text-ink-faint"
                  >
                    <div className="flex items-center justify-center gap-2 font-semibold">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>در حال دریافت اطلاعات اعضا از جنگو...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-[44px] text-center text-[14px] text-ink-faint"
                  >
                    <div className="text-[15px] font-bold text-ink">
                      هنوز عضوی در سیستم ثبت نشده است
                    </div>
                    <div className="mt-1 text-[12.5px] text-ink-faint">
                      اعضای جدید را از طریق دکمه «افزودن عضو» ثبت کنید تا مستقیماً در پنل جنگو ذخیره شوند.
                    </div>
                    {onOpenAddModal && (
                      <button
                        type="button"
                        onClick={onOpenAddModal}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-[10px] bg-tint px-4 py-2 text-[13px] font-bold text-primary-dark transition-all hover:bg-primary/20 cursor-pointer"
                      >
                        + افزودن اولین عضو
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pager Pagination - Only shown if multiple pages exist */}
        {filteredMembers.length > 10 && (
          <div className="flex items-center justify-center gap-[6px] p-[18px]">
            <button
              type="button"
              disabled
              className="min-w-[36px] h-[36px] cursor-default rounded-[10px] border border-border bg-surface px-[10px] text-[13.5px] font-bold text-ink-soft opacity-45 transition-all duration-150"
            >
              قبلی
            </button>
            {Array.from({ length: Math.ceil(filteredMembers.length / 10) }).map((_, idx) => {
              const pNum = String(idx + 1);
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setCurrentPage(pNum)}
                  className={cn(
                    "min-w-[36px] h-[36px] cursor-pointer rounded-[10px] border px-[10px] text-[13.5px] font-bold transition-all duration-150",
                    currentPage === pNum
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-surface text-ink-soft hover:border-primary hover:bg-tint hover:text-primary-dark"
                  )}
                >
                  {toPersianDigits(pNum)}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage === String(Math.ceil(filteredMembers.length / 10))}
              onClick={() => setCurrentPage((prev) => String(Number(prev) + 1))}
              className="min-w-[36px] h-[36px] cursor-pointer rounded-[10px] border border-border bg-surface px-[10px] text-[13.5px] font-bold text-ink-soft transition-all duration-150 hover:border-primary hover:bg-tint hover:text-primary-dark disabled:opacity-45 disabled:pointer-events-none"
            >
              بعدی
            </button>
          </div>
        )}
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

              <div className="grid grid-cols-1 gap-[12px] min-[500px]:grid-cols-2">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    پلن عضویت
                  </label>
                  <select
                    value={formData.planId || formData.planName}
                    onChange={(e) => {
                      const val = e.target.value;
                      const chosen = planOptions.find((p) => (p.id && p.id === val) || p.name === val) || planOptions[0];
                      if (chosen) {
                        setFormData({
                          ...formData,
                          planId: chosen.id || "",
                          planName: chosen.name,
                        });
                      }
                    }}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    {planOptions.map((p) => (
                      <option key={p.id || p.name} value={p.id || p.name}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    مربی اختصاصی
                  </label>
                  <select
                    value={formData.coachId || formData.coachName}
                    onChange={(e) => {
                      const val = e.target.value;
                      const chosen = coachOptions.find((c) => (c.id && c.id === val) || c.name === val);
                      setFormData({
                        ...formData,
                        coachId: chosen?.id || "",
                        coachName: chosen?.name || val || "بدون مربی",
                      });
                    }}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    {coachOptions.map((c) => (
                      <option key={c.id || c.name} value={c.id || c.name}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-[12px] min-[500px]:grid-cols-2">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    تاریخ عضویت
                  </label>
                  <input
                    type="text"
                    placeholder="مثلا: ۱۵ اردیبهشت"
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
                    placeholder="مثلا: ۱۵ مرداد"
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
                        "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all cursor-pointer",
                        formData.status === st
                          ? cn(STATUS_CONFIG[st].bgClass, STATUS_CONFIG[st].textClass, "border-current shadow-xs")
                          : "border-border bg-surface text-ink-soft hover:bg-bg"
                      )}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <span className={cn("h-2 w-2 rounded-full", STATUS_CONFIG[st].dotClass)} />
                        {STATUS_CONFIG[st].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-[10px] flex justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="rounded-[10px] border border-border px-[16px] py-[9px] text-[13.5px] font-semibold text-ink hover:bg-bg cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-[10px] bg-ink px-[20px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-primary-dark cursor-pointer"
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
          <div className="w-full max-w-[520px] rounded-[16px] border border-border bg-surface p-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-[18px] flex items-center justify-between border-b border-border pb-[14px]">
              <div>
                <h3 className="text-[17px] font-extrabold text-ink">
                  افزودن عضو جدید
                </h3>
                <p className="mt-0.5 text-[12px] text-ink-faint">
                  اطلاعات مستقیماً در پنل جنگو ثبت و در جدول نمایش داده می‌شود
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseAddModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint hover:bg-bg hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            {submitError && (
              <div className="mb-4 rounded-[10px] border border-[#F43F5E]/30 bg-[#FFF1F2] p-3 text-[12.5px] font-bold text-[#9F1239]">
                {submitError}
              </div>
            )}

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

              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13.5px] text-ink text-left outline-none transition-all duration-200 focus:border-primary focus:bg-tint"
                />
              </div>

              <div className="grid grid-cols-1 gap-[12px] min-[500px]:grid-cols-2">
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    پلن عضویت
                  </label>
                  <select
                    value={formData.planId || formData.planName}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    {planOptions.map((p) => (
                      <option key={p.id || p.name} value={p.id || p.name}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    مربی اختصاصی
                  </label>
                  <select
                    value={formData.coachId || formData.coachName}
                    onChange={(e) => handleCoachChange(e.target.value)}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[10px] text-[13px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  >
                    {coachOptions.map((c) => (
                      <option key={c.id || c.name} value={c.id || c.name}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start Date & Due Date */}
              <div className="grid grid-cols-1 gap-[12px] min-[500px]:grid-cols-2">
                <div>
                  <div className="mb-[6px] flex items-center justify-between">
                    <label className="text-[13px] font-bold text-ink">
                      تاریخ شروع عضویت
                    </label>
                    <button
                      type="button"
                      onClick={() => handleStartDateChange(getTodayIso())}
                      className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      امروز
                    </button>
                  </div>
                  <input
                    type="date"
                    value={formData.startDateRaw}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[9px] text-[13px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  />
                  <div className="mt-1 text-[11.5px] font-semibold text-primary-dark">
                    تاریخ: {formatPersianDateFull(formData.startDateRaw)}
                  </div>
                </div>

                <div>
                  <label className="mb-[6px] block text-[13px] font-bold text-ink">
                    تاریخ پایان (سررسید)
                  </label>
                  <input
                    type="date"
                    value={formData.dueDateRaw}
                    onChange={(e) => setFormData({ ...formData, dueDateRaw: e.target.value })}
                    className="w-full rounded-[12px] border-[1.5px] border-border bg-surface px-[14px] py-[9px] text-[13px] text-ink outline-none transition-all duration-200 focus:border-primary"
                  />
                  <div className="mt-1 text-[11.5px] font-semibold text-ink-faint">
                    سررسید: {formatPersianDateFull(formData.dueDateRaw)}
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  وضعیت عضویت
                </label>
                <div className="flex gap-[10px]">
                  {(["active", "expiring", "expired"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st })}
                      className={cn(
                        "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all cursor-pointer",
                        formData.status === st
                          ? cn(STATUS_CONFIG[st].bgClass, STATUS_CONFIG[st].textClass, "border-current shadow-xs")
                          : "border-border bg-surface text-ink-soft hover:bg-bg"
                      )}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <span className={cn("h-2 w-2 rounded-full", STATUS_CONFIG[st].dotClass)} />
                        {STATUS_CONFIG[st].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="mb-[6px] block text-[13px] font-bold text-ink">
                  جنسیت
                </label>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "MALE" })}
                    className={cn(
                      "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all cursor-pointer",
                      formData.gender === "MALE"
                        ? "border-primary bg-tint text-primary-dark"
                        : "border-border bg-surface text-ink-soft hover:bg-bg"
                    )}
                  >
                    آقا
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                    className={cn(
                      "flex-1 rounded-[10px] border py-[8px] text-[12.5px] font-bold transition-all cursor-pointer",
                      formData.gender === "FEMALE"
                        ? "border-primary bg-tint text-primary-dark"
                        : "border-border bg-surface text-ink-soft hover:bg-bg"
                    )}
                  >
                    خانم
                  </button>
                </div>
              </div>

              <div className="mt-[10px] flex justify-end gap-[10px]">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={onCloseAddModal}
                  className="rounded-[10px] border border-border px-[16px] py-[9px] text-[13.5px] font-semibold text-ink hover:bg-bg cursor-pointer disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-ink px-[20px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-emerald cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isSubmitting ? "در حال ثبت در جنگو..." : "افزودن عضو"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
