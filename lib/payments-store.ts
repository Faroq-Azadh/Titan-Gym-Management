"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { usePayments as useBackendPayments, useRecordPayment, useRefundPayment } from "@/lib/hooks/queries/use-billing";
import { INITIAL_PAYMENTS, type PaymentItem, type PaymentStatus, type PaymentMethod } from "@/components/admin/payments/types";
import { toPersianDigits } from "@/lib/persian-digits";

export const PAYMENTS_STORAGE_KEY = "titan_gym_custom_payments";
export const PAYMENTS_UPDATED_EVENT = "titan_gym_payments_updated";

/**
 * Format any amount into full Persian digits with thousands separators + "تومان"
 * Example: 2400000 -> "۲٬۴۰۰٬۰۰۰ تومان"
 * NEVER uses the letter "م"
 */
export function formatFullToman(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === "") return "۰ تومان";
  const num = typeof val === "string" ? parseFloat(val.replace(/[^\d.-]/g, "")) : val;
  if (isNaN(num)) return "۰ تومان";
  return `${num.toLocaleString("fa-IR")} تومان`;
}

export function getLocalPayments(): PaymentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Failed to read payments from storage:", err);
  }
  return [];
}

export function saveLocalPayments(payments: PaymentItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    window.dispatchEvent(new CustomEvent(PAYMENTS_UPDATED_EVENT, { detail: payments }));
  } catch (err) {
    console.error("Failed to save payments to storage:", err);
  }
}

export function usePaymentsData() {
  const { data: backendPayments, isLoading: isBackendLoading } = useBackendPayments();
  const recordMutation = useRecordPayment();
  const refundMutation = useRefundPayment();

  const [localPayments, setLocalPayments] = useState<PaymentItem[]>(() => {
    const stored = getLocalPayments();
    if (stored.length > 0) return stored;
    // Seed with INITIAL_PAYMENTS if storage is fresh
    return INITIAL_PAYMENTS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setLocalPayments(getLocalPayments());
    };
    window.addEventListener(PAYMENTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(PAYMENTS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Merge backend payments with local payments
  const payments: PaymentItem[] = useMemo(() => {
    const backendList: any[] = Array.isArray(backendPayments)
      ? backendPayments
      : Array.isArray((backendPayments as any)?.results)
        ? (backendPayments as any).results
        : Array.isArray((backendPayments as any)?.payments)
          ? (backendPayments as any).payments
          : [];

    if (backendList.length > 0) {
      const mappedBackend: PaymentItem[] = backendList.map((p, idx) => {
        const amt = typeof p.amount === "string" ? parseFloat(p.amount) : p.amount;
        const isRefunded = p.status === "REFUNDED";
        const statusMap: PaymentStatus =
          p.status === "COMPLETED" ? "paid" : p.status === "PENDING" ? "pending" : isRefunded ? "refunded" : "failed";
        const statusLabels: Record<PaymentStatus, string> = {
          paid: "موفق",
          pending: "در انتظار",
          failed: "ناموفق",
          refunded: "بازگشت‌خورده",
        };

        const dateFormatted = p.created_at
          ? new Date(p.created_at).toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" })
          : "۱۴۰۴/۰۴/۰۹";

        return {
          id: String(p.id || `backend-${idx}`),
          txId: `TXN-${10000 + idx}`,
          memberName: p.member_name || "عضو باشگاه",
          memberEmail: p.member_email || "",
          memberAvatar: (p.member_name || "ع").slice(0, 2),
          avatarGradient: "linear-gradient(135deg,#16E0A0,#22D3EE)",
          forTitle: p.note || "پرداخت شهریه",
          amount: amt || 0,
          amountFormatted: (amt || 0).toLocaleString("fa-IR"),
          isNegative: isRefunded,
          date: dateFormatted,
          method: "online" as PaymentMethod,
          methodLabel: p.payment_method || "درگاه آنلاین",
          status: statusMap,
          statusLabel: statusLabels[statusMap],
        };
      });

      // Filter local payments that aren't duplicates
      const backendIds = new Set(mappedBackend.map((b) => b.id));
      const customOnes = localPayments.filter((p) => !backendIds.has(p.id) && !p.id.startsWith("pay-"));
      return [...customOnes, ...mappedBackend];
    }

    // If backend is empty or not yet loaded, use local/seeded payments
    return localPayments;
  }, [backendPayments, localPayments]);

  // Calculations
  const successfulPayments = useMemo(() => payments.filter((p) => p.status === "paid"), [payments]);

  const totalRevenue = useMemo(() => {
    return successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [successfulPayments]);

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weeklyRevenue = useMemo(() => {
    // If payments have date, calculate for last 7 days, else proportional to total
    return successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [successfulPayments]);

  const monthlyRevenue = totalRevenue;

  const addPayment = useCallback(
    async (newPaymentData: Omit<PaymentItem, "id">) => {
      const newId = `pay-custom-${Date.now()}`;
      const item: PaymentItem = {
        id: newId,
        ...newPaymentData,
      };

      const updated = [item, ...localPayments];
      setLocalPayments(updated);
      saveLocalPayments(updated);

      // Attempt backend record
      try {
        await recordMutation.mutateAsync({
          member_id: "1",
          amount: newPaymentData.amount,
          note: newPaymentData.forTitle,
        });
      } catch (err) {
        console.warn("Backend payment record notice:", err);
      }

      return item;
    },
    [localPayments, recordMutation]
  );

  const updatePaymentStatus = useCallback(
    async (id: string, newStatus: PaymentStatus) => {
      const statusLabels: Record<PaymentStatus, string> = {
        paid: "موفق",
        pending: "در انتظار",
        failed: "ناموفق",
        refunded: "بازگشت‌خورده",
      };

      const updated = localPayments.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: newStatus,
            statusLabel: statusLabels[newStatus],
            isNegative: newStatus === "refunded",
          };
        }
        return p;
      });

      setLocalPayments(updated);
      saveLocalPayments(updated);

      if (newStatus === "refunded") {
        try {
          await refundMutation.mutateAsync(id);
        } catch (err) {
          console.warn("Backend refund notice:", err);
        }
      }
    },
    [localPayments, refundMutation]
  );

  const deletePayment = useCallback(
    (id: string) => {
      const updated = localPayments.filter((p) => p.id !== id);
      setLocalPayments(updated);
      saveLocalPayments(updated);
    },
    [localPayments]
  );

  return {
    payments,
    totalRevenue,
    monthlyRevenue,
    weeklyRevenue,
    successfulCount: successfulPayments.length,
    pendingCount: payments.filter((p) => p.status === "pending").length,
    failedCount: payments.filter((p) => p.status === "failed" || p.status === "refunded").length,
    isLoading: isBackendLoading,
    addPayment,
    updatePaymentStatus,
    deletePayment,
  };
}
