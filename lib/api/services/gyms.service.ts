import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { tokenStorage } from "../token";
import type { RegisterGymPayload, RegisterGymResponse } from "../register-gym";

export interface WeeklyAttendanceBar {
  day: string;
  checkins: number;
}

export interface TodaysClass {
  id: string;
  title: string;
  coach_name: string;
  start_time: string; // format: HH:mm or HH:mm:ss
  duration_minutes: number;
  capacity: number;
  booked: number;
}

export interface RecentActivityEvent {
  type: string;
  text: string;
  timestamp: string;
}

export interface RecentMemberRow {
  id: string;
  full_name: string;
  email: string;
  plan_name: string | null;
  expiry_date: string | null;
  status: string;
}

export interface ExpiringMembership {
  id: string;
  member_name: string;
  expiry_date: string;
  days_left: number;
}

export interface OwnerDashboard {
  active_members: number;
  active_members_trend_percent: number | null;
  today_checkins: number;
  expiring_count: number;
  expiring: ExpiringMembership[];
  revenue_month: string;
  revenue_trend_percent: number | null;
  revenue_year: string;
  bookings_today: number;
  bookings_trend_percent: number | null;
  renewal_rate_percent: number | null;
  renewal_trend_percent: number | null;
  weekly_attendance: WeeklyAttendanceBar[];
  todays_classes: TodaysClass[];
  recent_activity: RecentActivityEvent[];
  recent_members: RecentMemberRow[];
}

export interface Subscription {
  id?: string;
  plan: string;
  is_active: boolean;
  starts_at?: string;
  expires_at?: string;
  trial_ends_at?: string;
  auto_renew?: boolean;
}

export interface GymSettings {
  timezone?: string;
  currency?: string;
  working_hours?: Record<string, unknown>;
  notification_preferences?: Record<string, unknown>;
}

export interface GymDetail {
  id: string;
  name: string;
  slug: string;
  gym_type?: string;
  phone_number?: string;
  email?: string;
  city?: string;
  address?: string;
  about?: string;
  is_active: boolean;
  settings: GymSettings;
  subscription: Subscription;
}

export interface RevenueTrendPoint {
  year: number;
  month: number;
  revenue: number;
}

export interface MemberGrowthPoint {
  year: number;
  month: number;
  members: number;
}

export interface NewMembershipsPoint {
  year: number;
  month: number;
  new_members: number;
}

export interface DailyAttendancePoint {
  date: string;
  checkins: number;
}

export interface PlanDistribution {
  plan_name: string;
  count: number;
  percentage: number;
}

export interface Reports {
  revenue_trend?: RevenueTrendPoint[];
  member_growth?: MemberGrowthPoint[];
  new_memberships?: NewMembershipsPoint[];
  daily_attendance: DailyAttendancePoint[];
  plan_distribution?: PlanDistribution[];
}

export const gymsService = {
  /**
   * Register a new gym and admin account via POST /gyms/register/
   */
  async registerGym(payload: RegisterGymPayload): Promise<RegisterGymResponse> {
    const data = await apiClient.post<RegisterGymResponse>(
      ENDPOINTS.GYMS.REGISTER,
      payload,
      {
        requiresAuth: false, // Public registration endpoint
      },
    );

    // If backend returns JWT tokens immediately upon registration, store them
    const resObj = data as Record<string, unknown>;
    const tokens = resObj.tokens as { access?: string; refresh?: string } | undefined;
    const access = (resObj.access || resObj.token) as string | undefined;
    const refresh = resObj.refresh as string | undefined;

    if (tokens?.access) {
      tokenStorage.setTokens({ access: tokens.access, refresh: tokens.refresh });
    } else if (access) {
      tokenStorage.setTokens({ access, refresh });
    }

    return data;
  },

  /**
   * Get Owner Dashboard summary via GET /gyms/dashboard/
   */
  async getDashboard(): Promise<OwnerDashboard> {
    return apiClient.get<OwnerDashboard>(ENDPOINTS.GYMS.DASHBOARD, {
      requiresAuth: true,
    });
  },

  /**
   * Get current gym details via GET /gyms/me/
   */
  async getGymMe(): Promise<GymDetail> {
    return apiClient.get<GymDetail>(ENDPOINTS.GYMS.ME, {
      requiresAuth: true,
    });
  },

  /**
   * Update gym details via PATCH /gyms/me/
   */
  async updateGymMe(payload: Partial<GymDetail>): Promise<GymDetail> {
    return apiClient.patch<GymDetail>(ENDPOINTS.GYMS.ME, payload, {
      requiresAuth: true,
    });
  },

  /**
   * Get owner reports via GET /gyms/reports/?months=6
   */
  async getReports(months = 6): Promise<Reports> {
    return apiClient.get<Reports>(`${ENDPOINTS.GYMS.REPORTS}?months=${months}`, {
      requiresAuth: true,
    });
  },

  /**
   * Get gym settings via GET /gyms/me/settings/
   */
  async getSettings(): Promise<GymSettings> {
    return apiClient.get<GymSettings>(ENDPOINTS.GYMS.SETTINGS, {
      requiresAuth: true,
    });
  },

  /**
   * Update gym settings via PATCH /gyms/me/settings/
   */
  async updateSettings(payload: Partial<GymSettings>): Promise<GymSettings> {
    return apiClient.patch<GymSettings>(ENDPOINTS.GYMS.SETTINGS, payload, {
      requiresAuth: true,
    });
  },
};

