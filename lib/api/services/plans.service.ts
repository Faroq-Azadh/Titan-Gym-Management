import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface MembershipPlanItem {
  id: string;
  name: string;
  duration_days: number;
  price: string | number;
  description?: string;
  features?: Record<string, unknown> | string[];
  is_active: boolean;
  active_members: number;
}

export interface CreatePlanPayload {
  name: string;
  duration_days: number;
  price: string | number;
  description?: string;
  features?: Record<string, unknown> | string[];
  is_active?: boolean;
}

export interface SystemPlan {
  code: "FREE" | "BASIC" | "PRO" | "ENTERPRISE" | string;
  name: string;
  price: string | null;
  trial_days: number;
  member_limit: number | null;
  coach_limit: number | null;
}

export const plansService = {
  /**
   * Get all gym membership plans (Owner-facing)
   * GET /members/plans/
   */
  async getPlans(): Promise<MembershipPlanItem[]> {
    return apiClient.get<MembershipPlanItem[]>(ENDPOINTS.PLANS.MEMBERSHIP_LIST, {
      requiresAuth: true,
    });
  },

  /**
   * Create a new membership plan
   * POST /members/plans/
   */
  async createPlan(payload: CreatePlanPayload): Promise<MembershipPlanItem> {
    // Ensure price is formatted as a valid decimal string for DRF (e.g. "980000")
    const formattedPrice =
      typeof payload.price === "number"
        ? Math.round(payload.price).toString()
        : String(payload.price).replace(/[^\d.-]/g, "");

    const normalizedPayload: CreatePlanPayload = {
      ...payload,
      price: formattedPrice,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
    };

    return apiClient.post<MembershipPlanItem>(
      ENDPOINTS.PLANS.MEMBERSHIP_CREATE,
      normalizedPayload,
      { requiresAuth: true },
    );
  },

  /**
   * Update an existing plan
   * PATCH /members/plans/{id}/
   */
  async updatePlan(
    id: string | number,
    payload: Partial<CreatePlanPayload>,
  ): Promise<MembershipPlanItem> {
    const patchPayload: Partial<CreatePlanPayload> = { ...payload };
    if (patchPayload.price !== undefined) {
      patchPayload.price =
        typeof patchPayload.price === "number"
          ? Math.round(patchPayload.price).toString()
          : String(patchPayload.price).replace(/[^\d.-]/g, "");
    }

    return apiClient.patch<MembershipPlanItem>(
      ENDPOINTS.PLANS.MEMBERSHIP_DETAIL(id),
      patchPayload,
      { requiresAuth: true },
    );
  },

  /**
   * Retire / deactivate a plan (OpenAPI: No DELETE — Membership.plan is PROTECT; retire with is_active=false)
   * PATCH /members/plans/{id}/ { is_active: false }
   */
  async deletePlan(id: string | number): Promise<MembershipPlanItem> {
    return this.updatePlan(id, { is_active: false });
  },

  /**
   * Get public system pricing plans
   * GET /gyms/plans/
   */
  async getSystemPlans(): Promise<SystemPlan[]> {
    return apiClient.get<SystemPlan[]>(ENDPOINTS.PLANS.SYSTEM_LIST, {
      requiresAuth: false,
    });
  },
};
