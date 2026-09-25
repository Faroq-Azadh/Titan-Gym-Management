"use client";

import { useQuery, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { gymsService, type GymDetail } from "@/lib/api/services/gyms.service";
import { tokenStorage } from "@/lib/api/token";

export function useGymMe(): UseQueryResult<GymDetail, Error> {
  return useQuery<GymDetail, Error>({
    queryKey: ["gym-me"],
    queryFn: () => gymsService.getGymMe(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useUpdateGymMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GymDetail>) => gymsService.updateGymMe(payload),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["gym-me"], updatedData);
    },
  });
}
