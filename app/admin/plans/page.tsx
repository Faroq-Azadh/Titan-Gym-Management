"use client";

import { useState, useMemo } from "react";
import { usePlans, useCreatePlan, useUpdatePlan, useSystemPlans } from "@/lib/hooks/queries/use-plans";
import { useGymMe } from "@/lib/hooks/queries/use-gym-me";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { PlansGrid } from "@/components/admin/plans/plans-grid";
import { PlansTable } from "@/components/admin/plans/plans-table";
import { PlanModal } from "@/components/admin/plans/plan-modal";
import { PlanItem } from "@/components/admin/plans/types";
import { Shield, Sparkles, Check, X } from "lucide-react";
import { toPersianDigits } from "@/lib/persian-digits";
import { SystemPlan } from "@/lib/api/services/plans.service";

export default function AdminPlansPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  const [tableActiveTab, setTableActiveTab] = useState<"member_plans" | "system_plans">("member_plans");
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  const { data: gym } = useGymMe();
  const { data: backendPlans } = usePlans();
  const { data: systemPlans } = useSystemPlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  const plans: PlanItem[] = useMemo(() => {
    const list: any[] = Array.isArray(backendPlans)
      ? backendPlans
      : Array.isArray((backendPlans as any)?.results)
        ? (backendPlans as any).results
        : Array.isArray((backendPlans as any)?.plans)
          ? (backendPlans as any).plans
          : [];

    return list.map((p) => {
      const priceNum = typeof p.price === "string" ? parseFloat(p.price) : p.price;
      const formattedPrice = priceNum ? priceNum.toLocaleString("fa-IR") : "۰";
      const durationMonths = Math.max(1, Math.round((p.duration_days || 30) / 30));
      const durationText = `${durationMonths.toLocaleString("fa-IR")} ماهه (${(p.duration_days || 30).toLocaleString("fa-IR")} روز)`;

      return {
        id: String(p.id),
        name: p.name,
        hint: p.description || (p.is_active ? "پلن فعال" : "پلن غیرفعال"),
        price: formattedPrice,
        priceRaw: priceNum,
        priceUnit: "تومان",
        duration: durationText,
        activeMembers: p.active_members || 0,
        status: p.is_active ? ("active" as const) : ("inactive" as const),
        features: Array.isArray(p.features) ? p.features : ["دسترسی به کلیه تجهیزات باشگاه"],
      };
    });
  }, [backendPlans]);

  const handleSavePlan = async (planData: Omit<PlanItem, "id">, editId?: string) => {
    const cleanPrice = String(planData.price)
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
      .replace(/[^\d.-]/g, "");
    const rawPrice = parseFloat(cleanPrice) || 0;

    let duration_days = 30;
    if (planData.duration.includes("۱۲") || planData.duration.includes("سال")) {
      duration_days = 365;
    } else if (planData.duration.includes("۶")) {
      duration_days = 180;
    } else if (planData.duration.includes("۳")) {
      duration_days = 90;
    } else if (planData.duration.includes("۱")) {
      duration_days = 30;
    } else {
      const match = planData.duration.match(/\d+/);
      if (match) duration_days = parseInt(match[0], 10);
    }

    try {
      if (editId) {
        await updatePlanMutation.mutateAsync({
          id: editId,
          payload: {
            name: planData.name,
            duration_days,
            price: rawPrice,
            description: planData.description || planData.hint,
            features: planData.features,
            is_active: planData.status === "active",
          },
        });
      } else {
        await createPlanMutation.mutateAsync({
          name: planData.name,
          duration_days,
          price: rawPrice,
          description: planData.description || planData.hint,
          features: planData.features,
          is_active: planData.status === "active",
        });
      }
    } catch {
      // Handled
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (typeof window !== "undefined" && window.confirm("آیا از غیرفعال‌سازی این پلن اطمینان دارید؟")) {
      try {
        await updatePlanMutation.mutateAsync({
          id,
          payload: {
            is_active: false,
          },
        });
      } catch {
        // Handled
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    try {
      await updatePlanMutation.mutateAsync({
        id,
        payload: {
          is_active: plan.status !== "active",
        },
      });
    } catch {
      // Handled
    }
  };

  // Gym's own platform subscription data
  const currentSub = gym?.subscription;
  const currentPlanCode = typeof currentSub?.plan === "string" ? currentSub.plan : "FREE";
  const planLabels: Record<string, string> = {
    FREE: "آزمایشی رایگان",
    BASIC: "پلن پایه",
    PRO: "پلن حرفه‌ای",
    ENTERPRISE: "پلن سازمانی",
  };
  const currentPlanName = planLabels[currentPlanCode] || "آزمایشی رایگان";

  const allSystemPlans: SystemPlan[] = (systemPlans && systemPlans.length > 0) ? systemPlans : [
    { code: "FREE", name: "رایگان / دمو", price: "0", trial_days: 14, member_limit: 50, coach_limit: 2 },
    { code: "BASIC", name: "پایه", price: "1200000", trial_days: 0, member_limit: 200, coach_limit: 5 },
    { code: "PRO", name: "حرفه‌ای", price: "2900000", trial_days: 0, member_limit: 1000, coach_limit: 20 },
    { code: "ENTERPRISE", name: "سازمانی", price: null, trial_days: 0, member_limit: null, coach_limit: null },
  ];

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
                مدیریت تعرفه‌های عضویت باشگاه و وضعیت اشتراک در تیتان جیم
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
                <span>تعریف پلن عضویت جدید</span>
              </button>
            </div>
          </div>

          {/* Gym Current Subscription Banner (from Django GET /gyms/me/) */}
          <div className="mb-[24px] overflow-hidden rounded-[16px] border border-primary/40 bg-gradient-to-l from-tint via-surface to-surface p-[20px] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-[16px]">
              <div className="flex items-center gap-[14px]">
                <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] bg-primary/20 text-primary-dark">
                  <Shield className="h-[24px] w-[24px]" />
                </span>
                <div>
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[16px] font-black text-ink">
                      اشتراک فعلی باشگاه: {currentPlanName}
                    </span>
                    <span className="rounded-full bg-tint px-[8px] py-[2px] text-[11px] font-bold text-primary-dark border border-primary/30">
                      {currentSub?.is_active ? "فعال" : "دوره آزمایشی"}
                    </span>
                  </div>
                  <p className="mt-[3px] text-[12.5px] text-ink-faint">
                    سقف اعضا: {currentPlanCode === "FREE" ? "۵۰ نفر" : currentPlanCode === "BASIC" ? "۲۰۰ نفر" : "نامحدود"} · سقف مربیان: {currentPlanCode === "FREE" ? "۲ نفر" : currentPlanCode === "BASIC" ? "۵ نفر" : "نامحدود"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUpgradeSuccess(null);
                    setIsUpgradeModalOpen(true);
                    setTableActiveTab("system_plans");
                  }}
                  className="rounded-[10px] bg-ink px-[16px] py-[9px] text-[13px] font-bold text-white transition-all hover:bg-primary-dark cursor-pointer shadow-xs"
                >
                  مشاهده و ارتقای تعرفه‌های اشتراک
                </button>
              </div>
            </div>
          </div>

          {/* Featured Plan Cards Grid (Shown only if there are active plans) */}
          {plans.length > 0 && (
            <PlansGrid
              plans={plans}
              onEditPlan={(plan) => {
                setEditingPlan(plan);
                setIsModalOpen(true);
              }}
            />
          )}

          {/* All Plans & Tariffs Table Card */}
          <PlansTable
            plans={plans}
            systemPlans={allSystemPlans}
            currentPlanCode={currentPlanCode}
            activeTab={tableActiveTab}
            onTabChange={setTableActiveTab}
            onEditPlan={(plan) => {
              setEditingPlan(plan);
              setIsModalOpen(true);
            }}
            onDeletePlan={handleDeletePlan}
            onToggleStatus={handleToggleStatus}
            onOpenCreateModal={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
            onUpgradeSystemPlan={(sp) => {
              setUpgradeSuccess(null);
              setIsUpgradeModalOpen(true);
            }}
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

      {/* System Subscription Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsUpgradeModalOpen(false);
              setUpgradeSuccess(null);
            }}
          />
          <div className="relative z-10 w-full max-w-[850px] overflow-hidden rounded-[20px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-dark" />
                  <h3 className="text-[18px] font-black text-ink">
                    ارتقای اشتراک نرم‌افزار تیتان جیم
                  </h3>
                </div>
                <p className="mt-1 text-[13px] text-ink-faint">
                  تعرفه متناسب با ظرفیت باشگاه و تعداد ورزشکاران و مربیان خود را انتخاب کنید
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsUpgradeModalOpen(false);
                  setUpgradeSuccess(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-faint hover:bg-bg hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success alert if triggered */}
            {upgradeSuccess ? (
              <div className="my-6 rounded-[16px] border border-primary/40 bg-tint/60 p-6 text-center animate-in fade-in">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary-dark">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h4 className="text-[16px] font-extrabold text-ink">درخواست ارتقا ثبت گردید</h4>
                <p className="mt-1 text-[13.5px] text-ink-soft">
                  {upgradeSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsUpgradeModalOpen(false);
                    setUpgradeSuccess(null);
                  }}
                  className="mt-4 rounded-[10px] bg-ink px-6 py-2 text-[13px] font-bold text-white transition-all hover:bg-primary-dark cursor-pointer"
                >
                  متوجه شدم
                </button>
              </div>
            ) : (
              /* Plans Grid */
              <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[800px]:grid-cols-4">
                {allSystemPlans.map((sp) => {
                  const isCurrent = sp.code?.toUpperCase() === currentPlanCode.toUpperCase();
                  const priceNum = sp.price ? parseFloat(sp.price) : 0;
                  const priceFormatted =
                    sp.code === "FREE"
                      ? "رایگان"
                      : sp.price === null
                        ? "سفارشی"
                        : priceNum >= 1_000_000
                          ? `${(priceNum / 1_000_000).toLocaleString("fa-IR")} م`
                          : `${priceNum.toLocaleString("fa-IR")} تومان`;

                  return (
                    <div
                      key={sp.code}
                      className={`flex flex-col justify-between rounded-[16px] border p-4.5 transition-all ${
                        isCurrent
                          ? "border-primary bg-tint/60 shadow-[0_8px_24px_rgba(22,224,160,0.15)] ring-2 ring-primary/40"
                          : "border-border bg-surface hover:border-border/80 hover:shadow-xs"
                      }`}
                    >
                      <div>
                        {isCurrent && (
                          <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10.5px] font-black text-[#006633]">
                            اشتراک فعال فعلی شما
                          </span>
                        )}
                        <h4 className="text-[15.5px] font-extrabold text-ink">{sp.name}</h4>
                        <div className="mt-2 text-[20px] font-black text-ink">
                          {priceFormatted}
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-ink-faint">
                          {sp.code === "FREE" ? `${toPersianDigits(sp.trial_days || 14)} روز آزمایشی` : "ماهانه"}
                        </div>

                        <ul className="mt-3.5 space-y-2 text-[12px] text-ink-soft">
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-primary-dark shrink-0 stroke-[2.5]" />
                            <span>سقف اعضا: {sp.member_limit ? `${toPersianDigits(sp.member_limit)} نفر` : "نامحدود"}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-primary-dark shrink-0 stroke-[2.5]" />
                            <span>سقف مربیان: {sp.coach_limit ? `${toPersianDigits(sp.coach_limit)} نفر` : "نامحدود"}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-primary-dark shrink-0 stroke-[2.5]" />
                            <span>پشتیبانی و به‌روزرسانی سامانه</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        type="button"
                        disabled={isCurrent}
                        onClick={() => {
                          setUpgradeSuccess(`درخواست ارتقای اشتراک به پلن «${sp.name}» ثبت شد. کارشناسان تیتان جیم به زودی جهت هماهنگی و فعال‌سازی با شما تماس خواهند گرفت.`);
                        }}
                        className={`mt-4 w-full rounded-[10px] py-2 text-[12.5px] font-bold transition-all ${
                          isCurrent
                            ? "bg-bg text-ink-faint cursor-default"
                            : "bg-ink text-white hover:bg-primary-dark cursor-pointer shadow-xs"
                        }`}
                      >
                        {isCurrent ? "پلن کنونی" : "ارتقا به این پلن"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
