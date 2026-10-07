import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface PaymentAdmin {
  id: string;
  member: string;
  member_id?: string;
  member_name: string;
  member_email?: string;
  amount: string | number;
  payment_method?: string;
  status: "RECORDED" | "REFUNDED" | "COMPLETED" | "PENDING" | "FAILED" | string;
  created_at: string;
  note?: string;
  recorded_by_name?: string;
}

export type PaymentItem = PaymentAdmin;

export interface RecordPaymentPayload {
  member_id: string;
  amount: string | number;
  note?: string;
}

export interface PaymentCreateResponse {
  detail?: string;
  payment?: PaymentAdmin;
}

export const billingService = {
  /**
   * Get all payments recorded in the gym
   * GET /billing/payments/
   * Optional ?member=<uuid> query param
   */
  async getPayments(memberId?: string): Promise<PaymentAdmin[]> {
    const url = memberId
      ? `${ENDPOINTS.BILLING.PAYMENTS}?member=${encodeURIComponent(memberId)}`
      : ENDPOINTS.BILLING.PAYMENTS;
    return apiClient.get<PaymentAdmin[]>(url, { requiresAuth: true });
  },

  /**
   * Record a manual payment in backend
   * POST /billing/payments/
   */
  async recordPayment(payload: RecordPaymentPayload): Promise<PaymentAdmin> {
    const cleanAmount =
      typeof payload.amount === "number"
        ? Math.round(payload.amount).toString()
        : payload.amount.toString().replace(/[^0-9.]/g, "");

    const body = {
      member_id: payload.member_id,
      amount: cleanAmount,
      note: payload.note ? payload.note.trim().slice(0, 255) : undefined,
    };

    const response = await apiClient.post<PaymentCreateResponse | PaymentAdmin>(
      ENDPOINTS.BILLING.PAYMENTS,
      body,
      { requiresAuth: true }
    );

    if ((response as PaymentCreateResponse)?.payment) {
      return (response as PaymentCreateResponse).payment!;
    }
    return response as PaymentAdmin;
  },

  /**
   * Refund a payment
   * POST /billing/payments/{id}/refund/
   */
  async refundPayment(id: string | number): Promise<PaymentAdmin> {
    const cleanId = String(id).trim();
    return apiClient.post<PaymentAdmin>(
      ENDPOINTS.BILLING.REFUND(cleanId),
      {},
      { requiresAuth: true }
    );
  },

  /**
   * Update payment note or details in backend
   * PATCH /billing/payments/{id}/ (falls back to PUT if needed)
   */
  async updatePayment(
    id: string | number,
    payload: { note?: string; status?: string }
  ): Promise<PaymentAdmin> {
    const cleanId = String(id).trim();
    try {
      return await apiClient.patch<PaymentAdmin>(
        `${ENDPOINTS.BILLING.PAYMENTS}${cleanId}/`,
        payload,
        { requiresAuth: true }
      );
    } catch {
      return await apiClient.put<PaymentAdmin>(
        `${ENDPOINTS.BILLING.PAYMENTS}${cleanId}/`,
        payload,
        { requiresAuth: true }
      );
    }
  },
};
