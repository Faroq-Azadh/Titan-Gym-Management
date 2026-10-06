"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  coachesService,
  type CoachesResponse,
  type CoachItem,
  type AddCoachPayload,
} from "@/lib/api/services/coaches.service";
import { tokenStorage } from "@/lib/api/token";

export function useCoaches() {
  return useQuery<CoachesResponse | CoachItem[], Error>({
    queryKey: ["coaches"],
    queryFn: () => coachesService.getCoaches(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 60 * 1000,
  });
}

export function useAddCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddCoachPayload) => coachesService.addCoach(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
      await queryClient.refetchQueries({ queryKey: ["coaches"] });
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useUpdateCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<AddCoachPayload> }) =>
      coachesService.updateCoach(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
      await queryClient.refetchQueries({ queryKey: ["coaches"] });
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useDeleteCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => coachesService.deleteCoach(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
      await queryClient.refetchQueries({ queryKey: ["coaches"] });
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}
