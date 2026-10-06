"use client";

import { useQuery, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { gymsService, type GymDetail, type GymSettings } from "@/lib/api/services/gyms.service";
import { tokenStorage } from "@/lib/api/token";

import { setActiveGymScope, getCurrentUserScope } from "@/lib/session-scope";

export function useGymMe(): UseQueryResult<GymDetail, Error> {
  const userScope = getCurrentUserScope();
  return useQuery<GymDetail, Error>({
    queryKey: ["gym-me", userScope],
    queryFn: async () => {
      const res = await gymsService.getGymMe();
      if (res) {
        setActiveGymScope(res.id ? String(res.id) : null, res.name || null);
      }
      return res;
    },
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateGymMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GymDetail>) => gymsService.updateGymMe(payload),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["gym-me"], updatedData);
      queryClient.invalidateQueries({ queryKey: ["gym-me"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useGymSettings(): UseQueryResult<GymSettings, Error> {
  return useQuery<GymSettings, Error>({
    queryKey: ["gym-settings"],
    queryFn: () => gymsService.getSettings(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateGymSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GymSettings>) => gymsService.updateSettings(payload),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["gym-settings"], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ["gym-settings"] });
      queryClient.invalidateQueries({ queryKey: ["gym-me"] });
    },
  });
}
