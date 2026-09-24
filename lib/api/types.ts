/**
 * General API and Django REST Framework types
 */

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorDetail {
  [key: string]: string[] | string | ApiErrorDetail;
}

export interface DjangoErrorPayload {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
}

export interface RequestConfig extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  requiresAuth?: boolean;
  timeoutMs?: number;
}
