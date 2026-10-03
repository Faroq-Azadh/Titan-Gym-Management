import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface CoachItem {
  id: string;
  user_id?: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_number?: string;
  email?: string;
  avatar?: string | null;
  specialties: string[];
  experience_years: number;
  primary_certification?: string;
  student_capacity?: number;
  active_students_count?: number;
  students_count?: number;
  work_shift?: "MORNING" | "EVENING" | "FULL_TIME" | "FLEXIBLE" | string;
  is_active: boolean;
  rating?: number;
  start_date?: string;
  bio?: string;
}

export interface CoachesResponse {
  coaches: CoachItem[];
  total_coaches: number;
  active_coaches: number;
  total_students: number;
  avg_rating: number;
}

export interface AddCoachPayload {
  first_name: string;
  last_name: string;
  phone: string;
  specialties: string[];
  gender?: "male" | "female" | "";
  birth_date?: string | null;
  email?: string;
  address?: string;
  experience_years?: number;
  primary_certification?: string;
  student_capacity?: number | null;
  work_shift?: "morning" | "evening" | "morning_evening" | "full_time" | string;
  start_date?: string | null;
  working_days?: string[];
  position?: "coach" | "head_coach" | "reception" | string;
  send_invite?: boolean;
  instant_activation?: boolean;
  password?: string;
  password_confirm?: string;
  is_active?: boolean;
}

export const DAY_CODE_TO_NAME: Record<string, string> = {
  sat: "شنبه",
  sun: "یکشنبه",
  mon: "دوشنبه",
  tue: "سه‌شنبه",
  wed: "چهارشنبه",
  thu: "پنج‌شنبه",
  fri: "جمعه",
};

export const DAY_INDEX_TO_NAME = DAY_CODE_TO_NAME;

const DAY_MAP_TO_CODE: Record<string, string> = {
  "شنبه": "sat",
  "یکشنبه": "sun",
  "۱شنبه": "sun",
  "1شنبه": "sun",
  "دوشنبه": "mon",
  "۲شنبه": "mon",
  "2شنبه": "mon",
  "سه‌شنبه": "tue",
  "سه شنبه": "tue",
  "۳شنبه": "tue",
  "3شنبه": "tue",
  "چهارشنبه": "wed",
  "۴شنبه": "wed",
  "4شنبه": "wed",
  "پنج‌شنبه": "thu",
  "پنجشنبه": "thu",
  "۵شنبه": "thu",
  "5شنبه": "thu",
  "جمعه": "fri",
  "0": "sat",
  "1": "sun",
  "2": "mon",
  "3": "tue",
  "4": "wed",
  "5": "thu",
  "6": "fri",
  sat: "sat",
  sun: "sun",
  mon: "mon",
  tue: "tue",
  wed: "wed",
  thu: "thu",
  fri: "fri",
};

export function normalizeWorkingDays(days?: (string | number)[]): string[] {
  if (!Array.isArray(days)) return [];
  const normalized: string[] = [];
  const validCodes = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];
  for (const d of days) {
    const key = String(d).trim().toLowerCase();
    const mapped = DAY_MAP_TO_CODE[key] ?? key;
    if (validCodes.includes(mapped) && !normalized.includes(mapped)) {
      normalized.push(mapped);
    }
  }
  return normalized;
}

export const coachesService = {
  /**
   * Get all coaches and KPI stats
   */
  async getCoaches(): Promise<CoachesResponse | CoachItem[]> {
    try {
      return await apiClient.get<CoachesResponse | CoachItem[]>(ENDPOINTS.COACHES.LIST, { requiresAuth: true });
    } catch (err) {
      console.warn("Error fetching /coaches/, attempting fallback /coaches/?type=coach:", err);
      try {
        return await apiClient.get<CoachesResponse | CoachItem[]>("/coaches/?type=coach", { requiresAuth: true });
      } catch (err2) {
        console.error("Failed to fetch coaches from backend:", err2);
        return [] as any;
      }
    }
  },

  /**
   * Get single coach details
   */
  async getCoach(id: string | number): Promise<CoachItem> {
    return apiClient.get<CoachItem>(ENDPOINTS.COACHES.DETAIL(id), { requiresAuth: true });
  },

  /**
   * Add a new coach (creates User + CoachProfile in Django)
   * Matches CoachCreate schema in Titan_Gym_OS_API.yaml
   */
  async addCoach(payload: AddCoachPayload): Promise<CoachItem> {
    const body: Record<string, unknown> = {
      first_name: payload.first_name.trim(),
      last_name: payload.last_name.trim(),
      phone: payload.phone.trim(),
      specialties:
        Array.isArray(payload.specialties) && payload.specialties.length > 0
          ? payload.specialties
          : ["بدنسازی"],
    };

    if (payload.gender) body.gender = payload.gender;
    if (payload.birth_date) body.birth_date = payload.birth_date;
    if (payload.email?.trim()) body.email = payload.email.trim();
    if (payload.address?.trim()) body.address = payload.address.trim();
    if (payload.experience_years !== undefined) {
      body.experience_years = Number(payload.experience_years) || 0;
    }
    if (payload.primary_certification?.trim()) {
      body.primary_certification = payload.primary_certification.trim();
    }
    if (payload.student_capacity !== undefined && payload.student_capacity !== null) {
      body.student_capacity = Number(payload.student_capacity);
    }


    if (payload.work_shift) body.work_shift = payload.work_shift;
    if (payload.start_date) body.start_date = payload.start_date;
    if (Array.isArray(payload.working_days) && payload.working_days.length > 0) {
      const normalizedDays = normalizeWorkingDays(payload.working_days);
      if (normalizedDays.length > 0) {
        body.working_days = normalizedDays;
      }
    }
    if (payload.position) body.position = payload.position;
    if (payload.send_invite !== undefined) body.send_invite = payload.send_invite;
    if (payload.instant_activation !== undefined) body.instant_activation = payload.instant_activation;
    if (payload.password) body.password = payload.password;
    if (payload.password_confirm) body.password_confirm = payload.password_confirm;

    return apiClient.post<CoachItem>("/coaches/add_coach/", body, { requiresAuth: true });
  },

  /**
   * Update an existing coach
   */
  async updateCoach(id: string | number, payload: Partial<AddCoachPayload>): Promise<CoachItem> {
    return apiClient.patch<CoachItem>(ENDPOINTS.COACHES.DETAIL(id), payload, { requiresAuth: true });
  },

  /**
   * Delete or deactivate a coach
   */
  async deleteCoach(id: string | number): Promise<void> {
    return apiClient.delete(ENDPOINTS.COACHES.DETAIL(id), { requiresAuth: true });
  },
};
