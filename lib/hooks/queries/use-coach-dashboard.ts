"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  coachesService,
  INITIAL_COACH_DASHBOARD_DATA,
  type CoachDashboardData,
} from "@/lib/api/services/coaches.service";
import { tokenStorage } from "@/lib/api/token";
import { getCurrentGymScope, getCurrentUserScope } from "@/lib/session-scope";

export function useCoachDashboard(): UseQueryResult<CoachDashboardData, Error> {
  const userScope = getCurrentUserScope();
  const gymScope = getCurrentGymScope();

  return useQuery<CoachDashboardData, Error>({
    queryKey: ["coach-dashboard", userScope, gymScope],
    queryFn: () => coachesService.getCoachDashboard(),
    enabled: typeof window !== "undefined",
    initialData: INITIAL_COACH_DASHBOARD_DATA,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
  });
}
