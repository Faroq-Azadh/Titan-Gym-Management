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
    return apiClient.get<MembershipPlanItem[]>("/members/plans/", { requiresAuth: true });
  },

  /**
   * Create a new membership plan
   * POST /members/plans/
   */
  async createPlan(payload: CreatePlanPayload): Promise<MembershipPlanItem> {
    return apiClient.post<MembershipPlanItem>("/members/plans/", payload, { requiresAuth: true });
  },

  /**
   * Update an existing plan
   * PATCH /members/plans/{id}/
   */
  async updatePlan(id: string | number, payload: Partial<CreatePlanPayload>): Promise<MembershipPlanItem> {
    return apiClient.patch<MembershipPlanItem>(`/members/plans/${id}/`, payload, { requiresAuth: true });
  },

  /**
   * Get public system pricing plans
   * GET /gyms/plans/
   */
  async getSystemPlans(): Promise<SystemPlan[]> {
    return apiClient.get<SystemPlan[]>("/gyms/plans/", { requiresAuth: false });
  },
};
