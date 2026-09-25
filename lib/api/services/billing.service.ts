import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface PaymentItem {
  id: string;
  member_id: string;
  member_name: string;
  member_email?: string;
  amount: string | number;
  payment_method?: string;
  status: "COMPLETED" | "PENDING" | "REFUNDED" | "FAILED" | string;
  created_at: string;
  note?: string;
  recorded_by_name?: string;
}

export interface RecordPaymentPayload {
  member_id: string;
  amount: string | number;
  note?: string;
}

export const billingService = {
  /**
   * Get all payments recorded in the gym
   */
  async getPayments(): Promise<PaymentItem[]> {
    return apiClient.get<PaymentItem[]>(ENDPOINTS.BILLING.PAYMENTS, { requiresAuth: true });
  },

  /**
   * Record a manual payment in Django
   */
  async recordPayment(payload: RecordPaymentPayload): Promise<PaymentItem> {
    return apiClient.post<PaymentItem>(ENDPOINTS.BILLING.PAYMENTS, payload, { requiresAuth: true });
  },

  /**
   * Refund a payment
   */
  async refundPayment(id: string | number): Promise<{ detail?: string }> {
    return apiClient.post<{ detail?: string }>(ENDPOINTS.BILLING.REFUND(id), {}, { requiresAuth: true });
  },
};
