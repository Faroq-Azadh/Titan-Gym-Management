"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  billingService,
  type PaymentItem,
  type RecordPaymentPayload,
} from "@/lib/api/services/billing.service";
import { tokenStorage } from "@/lib/api/token";

export function usePayments() {
  return useQuery<PaymentItem[], Error>({
    queryKey: ["payments"],
    queryFn: () => billingService.getPayments(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 30 * 1000,
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordPaymentPayload) => billingService.recordPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
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
    },
  });
}
