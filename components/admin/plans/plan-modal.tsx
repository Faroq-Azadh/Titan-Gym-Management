"use client";

import { useState, useEffect } from "react";
import { PlanItem } from "./types";
import { X, Plus, Trash2 } from "lucide-react";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: Omit<PlanItem, "id">, editId?: string) => void;
  editPlan?: PlanItem | null;
}

export function PlanModal({
  isOpen,
  onClose,
  onSave,
  editPlan,
}: PlanModalProps) {
  const [name, setName] = useState("");
  const [hint, setHint] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("هزار تومان / ماه");
  const [duration, setDuration] = useState("۱ ماه");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [featured, setFeatured] = useState(false);
  const [ribbonText, setRibbonText] = useState("محبوب");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "دسترسی به سالن بدنسازی",
    "کمد اختصاصی",
  ]);
  const [newFeatureText, setNewFeatureText] = useState("");

  useEffect(() => {
    if (editPlan) {
      setName(editPlan.name);
      setHint(editPlan.hint);
      setPrice(editPlan.price);
      setPriceUnit(editPlan.priceUnit);
      setDuration(editPlan.duration);
      setStatus(editPlan.status);
      setFeatured(Boolean(editPlan.featured));
      setRibbonText(editPlan.ribbonText || "محبوب");
      setDescription(editPlan.description || "");
      setFeatures(editPlan.features || []);
    } else {
      setName("");
      setHint("");
      setPrice("");
      setPriceUnit("هزار تومان / ماه");
      setDuration("۱ ماه");
      setStatus("active");
      setFeatured(false);
      setRibbonText("محبوب");
      setDescription("");
      setFeatures([
        "دسترسی به سالن بدنسازی",
        "کمد اختصاصی",
      ]);
    }
    setNewFeatureText("");
  }, [editPlan, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("لطفاً عنوان پلن را وارد کنید.");
      return;
    }
    if (!price.trim()) {
      alert("لطفاً قیمت پلن را مشخص کنید.");
      return;
    }

    onSave(
      {
        name,
        hint,
        price,
        priceUnit,
        duration,
        status,
        featured,
        ribbonText: featured ? ribbonText : undefined,
        description,
        features: features.length > 0 ? features : ["دسترسی استاندارد به باشگاه"],
        activeMembers: editPlan ? editPlan.activeMembers : 0,
      },
      editPlan?.id,
    );

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
      <div className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-bg/60 p-[20px_24px]">
          <div>
            <h3 className="text-[18px] font-black text-ink">
              {editPlan ? "ویرایش پلن عضویت" : "تعریف پلن جدید"}
            </h3>
            <p className="mt-[2px] text-[12.5px] text-ink-faint">
              تنظیم قیمت، مدت اعتبار و خدمات اختصاصی پلن
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
            {/* Name & Hint */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  عنوان پلن <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ۳ ماهه طلایی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  برچسب یا توضیح کوتاه
                </label>
                <input
                  type="text"
                  placeholder="مثال: پرطرفدارترین"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>
            </div>

            {/* Price & Unit & Duration */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-3">
              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  قیمت (هزار تومان) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="۲٬۵۰۰"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  واحد زمانی قیمت
                </label>
                <input
                  type="text"
                  placeholder="هزار تومان / ۳ ماه"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                  مدت اعتبار
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="select-input w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13.5px] text-ink focus:border-primary focus:bg-tint focus:outline-none"
                >
                  <option value="۱ ماه">۱ ماه</option>
                  <option value="۳ ماه">۳ ماه</option>
                  <option value="۶ ماه">۶ ماه</option>
                  <option value="۱۲ ماه">۱۲ ماه (سالانه)</option>
                </select>
              </div>
            </div>

            {/* Featured & Status Toggles */}
            <div className="grid grid-cols-1 gap-[14px] min-[480px]:grid-cols-2 rounded-[14px] border border-border bg-bg p-[14px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-ink">پلن ویژه / برگزیده</div>
                  <div className="text-[11px] text-ink-faint">نمایش با حاشیه سبز و نشان محبوب</div>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-[18px] w-[18px] accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-ink">وضعیت فروش پلن</div>
                  <div className="text-[11px] text-ink-faint">فعال یا غیرفعال برای عضویت</div>
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                  className="rounded-[8px] border border-border bg-surface px-[10px] py-[4px] text-[12px] font-bold text-ink focus:outline-none"
                >
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>
            </div>

            {/* Features List */}
            <div>
              <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                ویژگی‌ها و خدمات مشمول این پلن
              </label>

              {/* Add feature input */}
              <div className="flex gap-[8px]">
                <input
                  type="text"
                  placeholder="افزودن ویژگی جدید (مثال: دسترسی به سونا)"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 rounded-[10px] border border-border bg-surface p-[8px_12px] text-[13px] text-ink focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center gap-[4px] rounded-[10px] bg-ink px-[14px] py-[8px] text-[12.5px] font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  <Plus className="h-[14px] w-[14px]" />
                  افزودن
                </button>
              </div>

              {/* Feature items */}
              <div className="mt-[10px] space-y-[6px]">
                {features.map((feat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-[8px] border border-border bg-bg p-[8px_12px] text-[13px] text-ink"
                  >
                    <div className="flex items-center gap-[8px]">
                      <span className="h-[6px] w-[6px] rounded-full bg-primary-dark" />
                      <span>{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-ink-faint hover:text-[#DC2626]"
                    >
                      <Trash2 className="h-[14px] w-[14px]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-[6px] block text-[12.5px] font-bold text-ink">
                توضیحات و یادداشت داخلی
              </label>
              <textarea
                rows={2}
                placeholder="توضیحات تکمیلی پیرامون شرایط پلن یا تخفیف‌ها..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-[12px] border border-border bg-surface p-[10px_14px] text-[13px] text-ink placeholder:text-ink-faint focus:border-primary focus:bg-tint focus:outline-none"
              />
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
              {editPlan ? "ذخیره تغییرات" : "ثبت پلن"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
