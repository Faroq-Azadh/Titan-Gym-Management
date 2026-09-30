/**
 * Standardized Error Handling for Django REST Framework (DRF)
 */

export class ApiError extends Error {
  public status: number;
  public detail: string;
  public fieldErrors: Record<string, string[]>;
  public isNetworkError: boolean;
  public rawData: unknown;

  constructor({
    status,
    detail,
    fieldErrors = {},
    isNetworkError = false,
    rawData,
  }: {
    status: number;
    detail: string;
    fieldErrors?: Record<string, string[]>;
    isNetworkError?: boolean;
    rawData?: unknown;
  }) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.fieldErrors = fieldErrors;
    this.isNetworkError = isNetworkError;
    this.rawData = rawData;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Helper to get the first validation error of a specific field
   */
  getFieldError(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }

  /**
   * Returns a flat array of all validation error messages
   */
  getAllErrorMessages(): string[] {
    const list: string[] = [];
    if (this.detail && !list.includes(this.detail)) {
      list.push(this.detail);
    }
    for (const field in this.fieldErrors) {
      const msgs = this.fieldErrors[field];
      if (Array.isArray(msgs)) {
        list.push(...msgs);
      }
    }
    return list;
  }
}

/**
 * Normalizes DRF backend error payloads into an ApiError instance
 */
export function parseDjangoError(errorPayload: unknown, status: number): ApiError {
  let detail = "خطایی در برقراری ارتباط با سرور رخ داد.";
  const fieldErrors: Record<string, string[]> = {};

  if (!errorPayload || typeof errorPayload !== "object") {
    if (status === 401) detail = "نشست کاربری شما منقضی شده است. لطفاً مجدداً وارد شوید.";
    else if (status === 403) detail = "شما دسترسی لازم برای انجام این عملیات را ندارید.";
    else if (status === 404) detail = "آیتم مورد نظر یافت نشد.";
    else if (status >= 500) detail = "خطای داخلی سرور رخ داده است. لطفاً بعداً تلاش کنید.";

    return new ApiError({
      status,
      detail: typeof errorPayload === "string" && errorPayload.trim() ? errorPayload : detail,
      fieldErrors,
      rawData: errorPayload,
    });
  }

  const payload = errorPayload as Record<string, unknown>;

  if (typeof payload.detail === "string") {
    detail = payload.detail;
  } else if (Array.isArray(payload.non_field_errors) && payload.non_field_errors.length > 0) {
    detail = String(payload.non_field_errors[0]);
  } else if (typeof payload.message === "string") {
    detail = payload.message;
  }

  // Handle SimpleJWT token expiration or invalidity
  if (
    status === 401 ||
    payload.code === "token_not_valid" ||
    (typeof detail === "string" && detail.toLowerCase().includes("token not valid"))
  ) {
    detail = "نشست کاربری شما در سرور منقضی شده است. لطفاً یک‌بار از حساب کاربری خارج شده و مجدداً وارد شوید.";
  }

  // Parse field-level errors (DRF standard format: { field: ["error1", "error2"] })
  for (const [key, value] of Object.entries(payload)) {
    if (key === "detail" || key === "status_code" || key === "code") continue;

    if (Array.isArray(value)) {
      fieldErrors[key] = value.map((item) => String(item));
      if (!payload.detail && !payload.non_field_errors && fieldErrors[key].length > 0) {
        detail = fieldErrors[key][0];
      }
    } else if (typeof value === "string") {
      fieldErrors[key] = [value];
      if (!payload.detail && !payload.non_field_errors) {
        detail = value;
      }
    } else if (typeof value === "object" && value !== null) {
      // Nested error object
      fieldErrors[key] = [JSON.stringify(value)];
    }
  }

  return new ApiError({
    status,
    detail,
    fieldErrors,
    rawData: errorPayload,
  });
}
