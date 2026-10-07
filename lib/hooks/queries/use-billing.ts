"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  billingService,
  type PaymentAdmin,
  type RecordPaymentPayload,
} from "@/lib/api/services/billing.service";
import { tokenStorage } from "@/lib/api/token";
import { getCurrentUserScope } from "@/lib/session-scope";

export function usePayments(memberId?: string) {
  const userScope = getCurrentUserScope();
  return useQuery<PaymentAdmin[], Error>({
    queryKey: ["payments", userScope, memberId || "all"],
    queryFn: () => billingService.getPayments(memberId),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 15 * 1000,
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordPaymentPayload) => billingService.recordPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["gym-reports"] });
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => billingService.refundPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["gym-reports"] });
    },
  });
}
