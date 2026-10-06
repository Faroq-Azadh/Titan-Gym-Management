"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { gymsService, type OwnerDashboard } from "@/lib/api/services/gyms.service";
import { tokenStorage } from "@/lib/api/token";

import { getCurrentGymScope, getCurrentUserScope } from "@/lib/session-scope";

export function useOwnerDashboard(): UseQueryResult<OwnerDashboard, Error> {
  const userScope = getCurrentUserScope();
  const gymScope = getCurrentGymScope();
  return useQuery<OwnerDashboard, Error>({
    queryKey: ["owner-dashboard", userScope, gymScope],
    queryFn: () => gymsService.getDashboard(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
  });
}
