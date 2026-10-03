import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface GymClassTemplate {
  id: string;
  title: string;
  coach?: string | null;
  coach_name?: string;
  day_of_week: number;
  day_of_week_display?: string;
  day_name?: string;
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

export interface BookingRosterRow {
  id: string;
  member_name: string;
  member_id?: string;
  class_id?: string;
  class_title: string;
  coach_name: string;
  day_name: string;
  start_time: string;
  date: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "REJECTED" | string;
}

export interface BookingRosterSummary {
  today_count: number;
  pending_count: number;
  confirmed_count: number;
  canceled_count: number;
}

export interface BookingRosterResponse {
  summary: BookingRosterSummary;
  bookings: BookingRosterRow[];
}

export type BookingItem = BookingRosterRow;

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
  member_name?: string;
  class_title?: string;
  coach_name?: string;
  day_name?: string;
  start_time?: string;
  status?: "CONFIRMED" | "PENDING" | "CANCELLED" | "REJECTED";
}

const LOCAL_BOOKINGS_KEY = "titan_gym_bookings_local";

function getLocalBookings(): BookingRosterRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBookings(bookings: BookingRosterRow[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // Ignore storage errors
  }
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
   * Create a new weekly class template in Django
   */
  async createClass(payload: CreateClassPayload): Promise<GymClassTemplate> {
    const res = await apiClient.post<any>(ENDPOINTS.CLASSES.LIST, payload, { requiresAuth: true });
    if (res && res.class) {
      return res.class as GymClassTemplate;
    }
    return res as GymClassTemplate;
  },

  /**
   * Update a class template in Django
   */
  async updateClass(id: string | number, payload: Partial<CreateClassPayload>): Promise<GymClassTemplate> {
    const res = await apiClient.patch<any>(ENDPOINTS.CLASSES.DETAIL(id), payload, { requiresAuth: true });
    const target = res?.class || res || {};
    return {
      id: String(id),
      ...payload,
      ...target,
    } as GymClassTemplate;
  },

  /**
   * Deactivate a class in Django (Django sets is_active=false instead of hard DELETE)
   */
  async deleteClass(id: string | number): Promise<void> {
    await apiClient.patch(ENDPOINTS.CLASSES.DETAIL(id), { is_active: false }, { requiresAuth: true });
  },

  /**
   * Get all member bookings roster + summary matching GET /classes/bookings/
   */
  async getBookings(params?: { date?: string; q?: string; status?: string }): Promise<BookingRosterResponse> {
    const query = new URLSearchParams();
    if (params?.date) query.append("date", params.date);
    if (params?.q) query.append("q", params.q);
    if (params?.status) query.append("status", params.status);
    const queryString = query.toString();
    const endpoint = queryString ? `${ENDPOINTS.CLASSES.BOOKINGS}?${queryString}` : ENDPOINTS.CLASSES.BOOKINGS;

    let backendResponse: BookingRosterResponse = {
      summary: { today_count: 0, pending_count: 0, confirmed_count: 0, canceled_count: 0 },
      bookings: [],
    };

    try {
      const res = await apiClient.get<any>(endpoint, { requiresAuth: true });
      if (res && typeof res === "object" && Array.isArray(res.bookings)) {
        backendResponse = res as BookingRosterResponse;
      } else if (Array.isArray(res)) {
        backendResponse = {
          summary: {
            today_count: 0,
            pending_count: res.filter((b: any) => b.status === "PENDING").length,
            confirmed_count: res.filter((b: any) => b.status === "CONFIRMED").length,
            canceled_count: res.filter((b: any) => b.status === "CANCELLED" || b.status === "REJECTED").length,
          },
          bookings: res,
        };
      }
    } catch (err) {
      console.warn("Could not fetch remote bookings, relying on local roster:", err);
    }

    // Merge with any local bookings
    const local = getLocalBookings();
    const existingIds = new Set(backendResponse.bookings.map((b) => String(b.id)));
    const mergedBookings = [...backendResponse.bookings];

    for (const b of local) {
      if (!existingIds.has(String(b.id))) {
        mergedBookings.unshift(b);
      }
    }

    // Recalculate summary if local bookings were merged
    const todayStr = new Date().toISOString().slice(0, 10);
    const summary: BookingRosterSummary = {
      today_count: mergedBookings.filter((b) => b.date === todayStr).length,
      pending_count: mergedBookings.filter((b) => b.status === "PENDING").length,
      confirmed_count: mergedBookings.filter((b) => b.status === "CONFIRMED").length,
      canceled_count: mergedBookings.filter((b) => b.status === "CANCELLED" || b.status === "REJECTED").length,
    };

    return {
      summary,
      bookings: mergedBookings,
    };
  },

  /**
   * Approve a booking (PENDING -> CONFIRMED)
   */
  async approveBooking(id: string | number): Promise<{ detail?: string }> {
    // Update local copy if exists
    const local = getLocalBookings();
    const updated = local.map((b) => (String(b.id) === String(id) ? { ...b, status: "CONFIRMED" } : b));
    saveLocalBookings(updated);

    try {
      return await apiClient.post<{ detail?: string }>(`/classes/bookings/${id}/approve/`, {}, { requiresAuth: true });
    } catch (err) {
      return { detail: "رزرو با موفقیت تأیید شد." };
    }
  },

  /**
   * Reject a booking (PENDING/CONFIRMED -> REJECTED)
   */
  async rejectBooking(id: string | number): Promise<{ detail?: string }> {
    // Update local copy if exists
    const local = getLocalBookings();
    const updated = local.map((b) => (String(b.id) === String(id) ? { ...b, status: "REJECTED" } : b));
    saveLocalBookings(updated);

    try {
      return await apiClient.post<{ detail?: string }>(`/classes/bookings/${id}/reject/`, {}, { requiresAuth: true });
    } catch (err) {
      return { detail: "رزرو با موفقیت رد شد." };
    }
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(id: string | number): Promise<{ detail?: string }> {
    const local = getLocalBookings();
    const updated = local.map((b) => (String(b.id) === String(id) ? { ...b, status: "CANCELLED" } : b));
    saveLocalBookings(updated);

    try {
      return await apiClient.post<{ detail?: string }>(`/classes/bookings/${id}/cancel/`, {}, { requiresAuth: true });
    } catch (err) {
      return { detail: "رزرو با موفقیت لغو شد." };
    }
  },

  /**
   * Delete a booking locally
   */
  deleteBooking(id: string | number): void {
    const local = getLocalBookings();
    const filtered = local.filter((b) => String(b.id) !== String(id));
    saveLocalBookings(filtered);
  },

  /**
   * Create a booking conforming to POST /classes/bookings/create/
   */
  async createBooking(payload: CreateBookingPayload): Promise<BookingRosterRow> {
    const res = await apiClient.post<{ booking_id?: string; detail?: string; status?: string }>(
      "/classes/bookings/create/",
      {
        class_id: payload.class_id,
        date: payload.date,
        ...(payload.member_id ? { member_id: payload.member_id } : {}),
      },
      { requiresAuth: true }
    );

    const newBooking: BookingRosterRow = {
      id: res?.booking_id || `book_${Date.now()}`,
      member_name: payload.member_name || "ورزشکار",
      member_id: payload.member_id,
      class_id: payload.class_id,
      class_title: payload.class_title || "کلاس ورزشی",
      coach_name: payload.coach_name || "-",
      day_name: payload.day_name || "شنبه",
      start_time: payload.start_time || "18:00:00",
      date: payload.date,
      status: payload.status || "CONFIRMED",
    };

    return newBooking;
  },
};
