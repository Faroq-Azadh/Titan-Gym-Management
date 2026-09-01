"use client";

import { useState } from "react";
import { PaymentItem, PaymentMethod, PaymentStatus } from "./types";
import { toPersianDigits } from "@/lib/persian-digits";
import { X } from "lucide-react";

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: Omit<PaymentItem, "id">) => void;
}

export function NewPaymentModal({
  isOpen,
  onClose,
  onSave,
}: NewPaymentModalProps) {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [forTitle, setForTitle] = useState("عضویت طلایی");
  const [status, setStatus] = useState<PaymentStatus>("paid");
  const [date, setDate] = useState("۱۴۰۴/۰۴/۰۹");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !amount.trim()) {
      alert("لطفاً نام عضو و مبلغ پرداختی را وارد نمایید.");
      return;
    }

    const rawAmount = Number(amount.replace(/[^0-9]/g, "")) || 1000000;
    const formattedAmount = rawAmount.toLocaleString();

    const initials = memberName
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);

    const methodLabels: Record<PaymentMethod, string> = {
      online: "درگاه آنلاین",
      card: "کارت بانکی",
      cash: "نقدی",
    };

    const statusLabels: Record<PaymentStatus, string> = {
      paid: "موفق",
      pending: "در انتظار",
      failed: "ناموفق",
      refunded: "بازگشت‌خورده",
    };

    const randomTx = Math.floor(10000 + Math.random() * 90000);

    onSave({
      txId: `TXN-${toPersianDigits(randomTx)}`,
      memberName,
      memberEmail: memberEmail || "member@mail.com",
      memberAvatar: initials || "عض",
      avatarGradient: "linear-gradient(135deg,#16E0A0,#22D3EE)",
      amount: rawAmount,
      amountFormatted: formattedAmount,
      method,
      methodLabel: methodLabels[method],
      forTitle,
      date,
      status,
      statusLabel: statusLabels[status],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-[16px]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-[540px] overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-bg/60 p-[20px_24px]">
          <div>
            <h3 className="text-[18px] font-black text-ink">ثبت پرداخت جدید</h3>
            <p className="mt-[2px] text-[12.5px] text-ink-faint">
              ثبت دستی تراکنش دریافتی از اعضای باشگاه
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-ink-faint transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[72vh] space-y-[18px] overflow-y-auto p-[24px]">
            {/* Member Name & Email */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  نام و نام‌خانوادگی عضو <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: پریا احمدی"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  ایمیل یا شماره تماس
                </label>
                <input
                  type="text"
                  placeholder="paria@mail.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>
            </div>

            {/* Amount & Method */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  مبلغ پرداختی (تومان) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="۲٬۴۰۰٬۰۰۰"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  روش پرداخت
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="select-input w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                >
                  <option value="online">درگاه آنلاین</option>
                  <option value="card">کارت‌خوان / کارت بانکی</option>
                  <option value="cash">نقدی</option>
                </select>
              </div>
            </div>

            {/* For Title & Date */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  بابت
                </label>
                <input
                  type="text"
                  placeholder="عضویت طلایی"
                  value={forTitle}
                  onChange={(e) => setForTitle(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  تاریخ تراکنش
                </label>
                <input
                  type="text"
                  placeholder="۱۴۰۴/۰۴/۰۹"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                وضعیت اولیه تراکنش
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="select-input w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
              >
                <option value="paid">موفق (پرداخت شده)</option>
                <option value="pending">در انتظار بررسی / تسویه</option>
                <option value="failed">ناموفق</option>
                <option value="refunded">بازگشت‌خورده</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-[10px] border-t border-border bg-bg/50 p-[16px_24px]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-border bg-surface px-[16px] py-[9px] text-[13px] font-bold text-ink-soft transition-colors hover:bg-bg hover:text-ink"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-[6px] rounded-[10px] bg-ink px-[20px] py-[9px] text-[13.5px] font-bold text-white transition-all hover:bg-primary-dark"
            >
              ثبت پرداخت
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
