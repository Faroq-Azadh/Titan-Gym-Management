"use client";

import { useQuery } from "@tanstack/react-query";
import { gymsService, type Reports } from "@/lib/api/services/gyms.service";
import { tokenStorage } from "@/lib/api/token";

export function useReports(months = 6) {
  return useQuery<Reports, Error>({
    queryKey: ["gym-reports", months],
    queryFn: () => gymsService.getReports(months),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 60 * 1000,
  });
}
