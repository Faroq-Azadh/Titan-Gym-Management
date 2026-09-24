import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { tokenStorage } from "../token";
import type { RegisterGymPayload, RegisterGymResponse } from "../register-gym";

export const gymsService = {
  /**
   * Register a new gym and admin account via POST /api/v1/gyms/register/
   */
  async registerGym(payload: RegisterGymPayload): Promise<RegisterGymResponse> {
    const data = await apiClient.post<RegisterGymResponse>(
      ENDPOINTS.AUTH.REGISTER,
      payload,
      {
        requiresAuth: false, // Public registration endpoint
      },
    );

    // If backend returns JWT tokens immediately upon registration, store them
    const tokens = (data as Record<string, unknown>).tokens as { access?: string; refresh?: string } | undefined;
    const access = (data as Record<string, unknown>).access as string | undefined;
    const refresh = (data as Record<string, unknown>).refresh as string | undefined;

    if (tokens?.access) {
      tokenStorage.setTokens({ access: tokens.access, refresh: tokens.refresh });
    } else if (access) {
      tokenStorage.setTokens({ access, refresh });
    }

    return data;
  },
};
