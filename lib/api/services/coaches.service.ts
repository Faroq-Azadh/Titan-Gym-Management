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
  email?: string;
  gender?: "M" | "F" | "OTHER" | "";
  birth_date?: string;
  address?: string;
  specialties: string[];
  experience_years: number;
  primary_certification?: string;
  student_capacity?: number;
  work_shift?: string;
  start_date?: string;
  password?: string;
  password_confirm?: string;
}

export const coachesService = {
  /**
   * Get all coaches and KPI stats
   */
  async getCoaches(): Promise<CoachesResponse | CoachItem[]> {
    return apiClient.get<CoachesResponse | CoachItem[]>(ENDPOINTS.COACHES.LIST, { requiresAuth: true });
  },

  /**
   * Get single coach details
   */
  async getCoach(id: string | number): Promise<CoachItem> {
    return apiClient.get<CoachItem>(ENDPOINTS.COACHES.DETAIL(id), { requiresAuth: true });
  },

  /**
   * Add a new coach (creates User + CoachProfile in Django)
   */
  async addCoach(payload: AddCoachPayload): Promise<CoachItem> {
    return apiClient.post<CoachItem>("/coaches/add_coach/", payload, { requiresAuth: true });
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
