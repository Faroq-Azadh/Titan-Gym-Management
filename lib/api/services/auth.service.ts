import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { tokenStorage } from "../token";

export type UserRole = "OWNER" | "COACH" | "MEMBER";

export interface User {
  id: string;
  email: string | null;
  phone_number: string | null;
  is_phone_verified: boolean;
  full_name: string;
  avatar: string | null;
  role: UserRole;
  date_joined: string;
  notify_workout_reminder?: boolean;
  notify_coach_message?: boolean;
  notify_membership_expiry?: boolean;
  notify_promotions?: boolean;
  language?: "fa" | "en";
  weight_unit?: "kg" | "lb";
  dark_mode?: boolean;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface OTPRequestPayload {
  identifier: string;
}

export interface OTPVerifyPayload {
  identifier: string;
  code: string;
}

export interface GoogleLoginPayload {
  id_token?: string;
  access_token?: string;
}

export interface ForgotPasswordRequestPayload {
  identifier: string;
  phone_number?: string;
}

export interface ForgotPasswordVerifyPayload {
  identifier: string;
  code: string;
}

export interface ForgotPasswordVerifyResponse {
  reset_token: string;
}

export interface ForgotPasswordConfirmPayload {
  reset_token?: string;
  phone_number?: string;
  code?: string;
  password: string;
  password_confirm: string;
}

export interface DetailResponse {
  detail: string;
  needs_registration?: boolean;
}

export const authService = {
  /**
   * Log in user with identifier (email or phone) and password
   * Conforms to POST /users/login/
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload, {
      requiresAuth: false,
      credentials: "include",
    });

    if (data?.access) {
      tokenStorage.setTokens({
        access: data.access,
        refresh: data.refresh,
      });
      if (typeof window !== "undefined" && data.user) {
        localStorage.setItem("titan_user", JSON.stringify(data.user));
      }
    }

    return data;
  },

  /**
   * Request OTP SMS or Email code for Login
   * Conforms to POST /users/otp/request/
   */
  async requestOtp(payload: OTPRequestPayload): Promise<DetailResponse> {
    return apiClient.post<DetailResponse>(ENDPOINTS.AUTH.OTP_REQUEST, payload, {
      requiresAuth: false,
      credentials: "include",
    });
  },

  /**
   * Verify OTP and log in
   * Conforms to POST /users/otp/verify/
   */
  async verifyOtp(payload: OTPVerifyPayload): Promise<LoginResponse | DetailResponse> {
    const data = await apiClient.post<LoginResponse | DetailResponse>(
      ENDPOINTS.AUTH.OTP_VERIFY,
      payload,
      { requiresAuth: false, credentials: "include" },
    );

    // If tokens are returned directly
    if ("access" in data && data.access) {
      tokenStorage.setTokens({
        access: data.access,
        refresh: data.refresh,
      });
      if (typeof window !== "undefined" && data.user) {
        localStorage.setItem("titan_user", JSON.stringify(data.user));
      }
      return data;
    }

    // If session cookie was set or response is DetailResponse, try fetching current user
    try {
      const user = await this.getMe();
      if (user) {
        return {
          access: tokenStorage.getAccessToken() || "",
          refresh: tokenStorage.getRefreshToken() || "",
          user,
        };
      }
    } catch {
      // Ignored if user not yet available
    }

    return data;
  },

  /**
   * Google OAuth / One Tap login
   * Conforms to POST /users/google/
   */
  async googleLogin(payload: GoogleLoginPayload): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.GOOGLE,
      payload,
      { requiresAuth: false, credentials: "include" },
    );

    if (data?.access) {
      tokenStorage.setTokens({
        access: data.access,
        refresh: data.refresh,
      });
      if (typeof window !== "undefined" && data.user) {
        localStorage.setItem("titan_user", JSON.stringify(data.user));
      }
      return data;
    }

    // If tokens are in httpOnly cookie or returned differently, fetch user
    const user = await this.getMe();
    return {
      access: tokenStorage.getAccessToken() || "",
      refresh: tokenStorage.getRefreshToken() || "",
      user,
    };
  },

  /**
   * Step 1 — Send OTP for Forgot Password
   * Conforms to POST /users/password/forgot/request/
   */
  async forgotPasswordRequest(payload: ForgotPasswordRequestPayload): Promise<DetailResponse> {
    return apiClient.post<DetailResponse>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD_REQUEST,
      payload,
      { requiresAuth: false },
    );
  },

  /**
   * Step 2 — Verify OTP for Forgot Password -> returns reset_token
   * Conforms to POST /users/password/forgot/verify/
   */
  async forgotPasswordVerify(payload: ForgotPasswordVerifyPayload): Promise<ForgotPasswordVerifyResponse> {
    return apiClient.post<ForgotPasswordVerifyResponse>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD_VERIFY,
      payload,
      { requiresAuth: false },
    );
  },

  /**
   * Step 3 — Set new password using reset_token
   * Conforms to POST /users/password/forgot/confirm/
   */
  async forgotPasswordConfirm(payload: ForgotPasswordConfirmPayload): Promise<DetailResponse> {
    return apiClient.post<DetailResponse>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD_CONFIRM,
      payload,
      { requiresAuth: false },
    );
  },

  /**
   * Get current authenticated user details
   * Conforms to GET /users/me/
   */
  async getMe(): Promise<User> {
    const user = await apiClient.get<User>(ENDPOINTS.AUTH.ME, { requiresAuth: true });
    if (typeof window !== "undefined" && user) {
      localStorage.setItem("titan_user", JSON.stringify(user));
    }
    return user;
  },

  /**
   * Partial update current user fields
   * Conforms to PATCH /users/me/
   */
  async updateMe(payload: Partial<User>): Promise<User> {
    const updated = await apiClient.patch<User>(ENDPOINTS.AUTH.ME, payload, { requiresAuth: true });
    if (typeof window !== "undefined" && updated) {
      const cached = localStorage.getItem("titan_user");
      let merged = updated;
      if (cached) {
        try {
          merged = { ...JSON.parse(cached), ...updated };
        } catch {}
      }
      localStorage.setItem("titan_user", JSON.stringify(merged));
    }
    return updated;
  },

  /**
   * Change user password
   * Conforms to POST /users/password/change/
   */
  async changePassword(payload: { new_password1: string; new_password2: string }): Promise<{ detail: string }> {
    return apiClient.post<{ detail: string }>(
      ENDPOINTS.AUTH.CHANGE_PASSWORD,
      payload,
      { requiresAuth: true },
    );
  },

  /**
   * Log out user and clear stored tokens
   * Conforms to POST /users/logout/
   */
  async logout(): Promise<void> {
    try {
      const refresh = tokenStorage.getRefreshToken();
      await apiClient.post(
        ENDPOINTS.AUTH.LOGOUT,
        refresh ? { refresh } : {},
        { requiresAuth: true, credentials: "include" },
      );
    } catch {
      // Proceed to cleanup even if backend logout fails
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("titan_user");
      }
      tokenStorage.clearTokens();
    }
  },
};

