"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { PaymentsStats } from "@/components/admin/payments/payments-stats";
import { PaymentsTable } from "@/components/admin/payments/payments-table";
import { NewPaymentModal } from "@/components/admin/payments/new-payment-modal";
import { PaymentDetailModal } from "@/components/admin/payments/payment-detail-modal";
import { PaymentItem, INITIAL_PAYMENTS, PaymentStatus } from "@/components/admin/payments/types";

export default function AdminPaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);

  const handleAddPayment = (newPaymentData: Omit<PaymentItem, "id">) => {
    const newPayment: PaymentItem = {
      ...newPaymentData,
      id: `pay-${Date.now()}`,
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const handleUpdateStatus = (id: string, newStatus: PaymentStatus) => {
    const statusLabels: Record<PaymentStatus, string> = {
      paid: "موفق",
      pending: "در انتظار",
      failed: "ناموفق",
      refunded: "بازگشت‌خورده",
    };

    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: newStatus,
              statusLabel: statusLabels[newStatus],
              isNegative: newStatus === "refunded",
              amountFormatted:
                newStatus === "refunded" && !p.amountFormatted.startsWith("−")
                  ? `−${p.amountFormatted}`
                  : p.amountFormatted.replace("−", ""),
            }
          : p,
      ),
    );

    if (selectedPayment?.id === id) {
      setSelectedPayment((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              statusLabel: statusLabels[newStatus],
              isNegative: newStatus === "refunded",
            }
          : null,
      );
    }
  };

  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    if (selectedPayment?.id === id) {
      setSelectedPayment(null);
    }
  };

  const handleExportExcel = () => {
    const headers = ["شناسه تراکنش", "نام عضو", "ایمیل", "مبلغ (تومان)", "روش پرداخت", "بابت", "تاریخ", "وضعیت"];
    const rows = payments.map((p) => [
      p.txId,
      p.memberName,
      p.memberEmail,
      p.amountFormatted,
      p.methodLabel,
      p.forTitle,
      p.date,
      p.statusLabel,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `titan-payments-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          searchPlaceholder="جستجوی عضو، رزرو یا پرداخت…"
        />

        {/* Page Content */}
        <main className="flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px]">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink min-[640px]:text-[26px]">
                پرداخت‌ها
              </h1>
              <div className="mt-[5px] text-[14px] text-ink-faint">
                تراکنش‌ها، تسویه‌ها و وضعیت مالی باشگاه
              </div>
            </div>

            <div className="flex items-center gap-[10px]">
              {/* Excel Export Button */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center justify-center gap-[8px] rounded-[10px] border-[1.5px] border-border bg-surface px-[14px] py-[8px] text-[13px] font-semibold text-ink transition-all duration-200 hover:border-primary hover:bg-tint"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>خروجی اکسل</span>
              </button>

              {/* Add Payment Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-[8px] rounded-[10px] bg-ink px-[14px] py-[8px] text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-primary-dark hover:shadow-[0_20px_50px_rgba(22,224,160,0.25)] active:translate-y-0"
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>ثبت پرداخت</span>
              </button>
            </div>
          </div>

          {/* Mini Stat Cards Grid */}
          <PaymentsStats
            monthlyRevenue="۲۴۸ م"
            successfulCount={1394}
            pendingCount={27}
            failedCount={18}
          />

          {/* Payments Table Card with Tabs, Search, and Filters */}
          <PaymentsTable
            payments={payments}
            onSelectPayment={(payment) => setSelectedPayment(payment)}
          />
        </main>
      </div>

      {/* New Payment Modal */}
      <NewPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPayment}
      />

      {/* Payment Detail Receipt Modal */}
      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeletePayment}
      />
    </div>
  );
}
