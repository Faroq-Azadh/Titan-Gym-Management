import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface GymClassTemplate {
  id: string;
  title: string;
  coach?: string | null;
  coach_name?: string;
  day_of_week: number;
  day_of_week_display?: string;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  booked?: number;
  is_active: boolean;
}

export interface ClassCalendarResponse {
  week_dates: string[];
  kpis?: {
    total_classes?: number;
    active_classes?: number;
    total_capacity?: number;
    total_bookings?: number;
  };
  schedule: Record<string, GymClassTemplate[]>;
  classes: GymClassTemplate[];
}

export interface BookingItem {
  id: string;
  member_id: string;
  member_name: string;
  member_email?: string;
  class_id: string;
  class_title: string;
  coach_name?: string;
  date: string;
  start_time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED" | string;
  created_at?: string;
}

export interface CreateClassPayload {
  title: string;
  coach?: string | null;
  day_of_week: number;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  is_active?: boolean;
}

export interface CreateBookingPayload {
  class_id: string;
  date: string;
  member_id?: string;
}

export const classesService = {
  /**
   * List all class templates
   */
  async getClasses(): Promise<GymClassTemplate[]> {
    return apiClient.get<GymClassTemplate[]>(ENDPOINTS.CLASSES.LIST, { requiresAuth: true });
  },

  /**
   * Get weekly calendar grid + KPI stats
   */
  async getCalendar(): Promise<ClassCalendarResponse> {
    return apiClient.get<ClassCalendarResponse>(ENDPOINTS.CLASSES.CALENDAR, { requiresAuth: true });
  },

  /**
   * Create a new weekly class template
   */
  async createClass(payload: CreateClassPayload): Promise<GymClassTemplate> {
    return apiClient.post<GymClassTemplate>(ENDPOINTS.CLASSES.LIST, payload, { requiresAuth: true });
  },

  /**
   * Update a class template
   */
  async updateClass(id: string | number, payload: Partial<CreateClassPayload>): Promise<GymClassTemplate> {
    return apiClient.patch<GymClassTemplate>(ENDPOINTS.CLASSES.DETAIL(id), payload, { requiresAuth: true });
  },

  /**
   * Delete or deactivate a class
   */
  async deleteClass(id: string | number): Promise<void> {
    return apiClient.delete(ENDPOINTS.CLASSES.DETAIL(id), { requiresAuth: true });
  },

  /**
   * Get all member bookings roster
   */
  async getBookings(): Promise<BookingItem[]> {
    return apiClient.get<BookingItem[]>(ENDPOINTS.CLASSES.BOOKINGS, { requiresAuth: true });
  },

  /**
   * Approve a booking (PENDING -> CONFIRMED)
   */
  async approveBooking(id: string | number): Promise<{ detail?: string }> {
    return apiClient.post<{ detail?: string }>(`/classes/bookings/${id}/approve/`, {}, { requiresAuth: true });
  },

  /**
   * Reject a booking
   */
  async rejectBooking(id: string | number): Promise<{ detail?: string }> {
    return apiClient.post<{ detail?: string }>(`/classes/bookings/${id}/reject/`, {}, { requiresAuth: true });
  },

  /**
   * Create a booking
   */
  async createBooking(payload: CreateBookingPayload): Promise<BookingItem> {
    return apiClient.post<BookingItem>("/classes/bookings/create/", payload, { requiresAuth: true });
  },
};
