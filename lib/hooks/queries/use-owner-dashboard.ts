"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { gymsService, type OwnerDashboard } from "@/lib/api/services/gyms.service";
import { tokenStorage } from "@/lib/api/token";

export function useOwnerDashboard(): UseQueryResult<OwnerDashboard, Error> {
  return useQuery<OwnerDashboard, Error>({
    queryKey: ["owner-dashboard"],
    queryFn: () => gymsService.getDashboard(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
