"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  plansService,
  type MembershipPlanItem,
  type CreatePlanPayload,
  type SystemPlan,
} from "@/lib/api/services/plans.service";
import { tokenStorage } from "@/lib/api/token";

export function usePlans() {
  return useQuery<MembershipPlanItem[], Error>({
    queryKey: ["plans"],
    queryFn: () => plansService.getPlans(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 60 * 1000,
  });
}

export function useSystemPlans() {
  return useQuery<SystemPlan[], Error>({
    queryKey: ["system-plans"],
    queryFn: () => plansService.getSystemPlans(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => plansService.createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<CreatePlanPayload> }) =>
      plansService.updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}
