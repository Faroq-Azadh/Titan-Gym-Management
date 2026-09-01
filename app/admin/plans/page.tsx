"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { PlansGrid } from "@/components/admin/plans/plans-grid";
import { PlansTable } from "@/components/admin/plans/plans-table";
import { PlanModal } from "@/components/admin/plans/plan-modal";
import { PlanItem, INITIAL_PLANS } from "@/components/admin/plans/types";

export default function AdminPlansPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plans, setPlans] = useState<PlanItem[]>(INITIAL_PLANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  const handleSavePlan = (planData: Omit<PlanItem, "id">, editId?: string) => {
    if (editId) {
      setPlans((prev) =>
        prev.map((p) => (p.id === editId ? { ...planData, id: editId } : p)),
      );
    } else {
      const newPlan: PlanItem = {
        ...planData,
        id: `plan-${Date.now()}`,
      };
      setPlans((prev) => [newPlan, ...prev]);
    }
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p,
      ),
    );
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
          searchPlaceholder="جستجو در پلن‌ها و تعرفه‌ها…"
        />

        {/* Page Content */}
        <main className="flex-1 p-[18px] min-[640px]:p-[28px]">
          {/* Page Head */}
          <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[16px]">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink min-[640px]:text-[26px]">
                پلن‌ها و قیمت‌گذاری
              </h1>
              <div className="mt-[5px] text-[14px] text-ink-faint">
                مدیریت پلن‌های عضویت و تعرفه‌ها
              </div>
            </div>

            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                onClick={() => {
                  setEditingPlan(null);
                  setIsModalOpen(true);
                }}
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
                <span>افزودن پلن</span>
              </button>
            </div>
          </div>

          {/* Featured Plan Cards Grid (3 cards from HTML) */}
          <PlansGrid
            plans={plans}
            onEditPlan={(plan) => {
              setEditingPlan(plan);
              setIsModalOpen(true);
            }}
          />

          {/* All Plans Table Card */}
          <PlansTable
            plans={plans}
            onEditPlan={(plan) => {
              setEditingPlan(plan);
              setIsModalOpen(true);
            }}
            onDeletePlan={handleDeletePlan}
            onToggleStatus={handleToggleStatus}
          />
        </main>
      </div>

      {/* Plan Add / Edit Modal */}
      <PlanModal
        isOpen={isModalOpen}
        editPlan={editingPlan}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
      />
    </div>
  );
}
