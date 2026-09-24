import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { gymsService } from "@/lib/api/services/gyms.service";
import type { RegisterGymPayload, RegisterGymResponse } from "@/lib/api/register-gym";
import type { ApiError } from "@/lib/api/errors";

export function useRegisterGym(): UseMutationResult<
  RegisterGymResponse,
  ApiError,
  RegisterGymPayload
> {
  return useMutation<RegisterGymResponse, ApiError, RegisterGymPayload>({
    mutationFn: (payload: RegisterGymPayload) => gymsService.registerGym(payload),
  });
}
