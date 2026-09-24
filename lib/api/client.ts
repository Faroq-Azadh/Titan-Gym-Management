import { API_BASE_URL, ENDPOINTS } from "./endpoints";
import { parseDjangoError, ApiError } from "./errors";
import { tokenStorage } from "./token";
import type { RequestConfig } from "./types";

interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  retry: () => Promise<unknown>;
}

class ApiClient {
  private customBaseUrl?: string;
  private isRefreshing = false;
  private refreshQueue: PendingRequest[] = [];

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.customBaseUrl = baseUrl.replace(/\/+$/, "");
    }
  }

  public getBaseUrl(): string {
    if (this.customBaseUrl) return this.customBaseUrl;
    const envUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      API_BASE_URL ||
      "http://127.0.0.1:8000";
    return envUrl.replace(/\/+$/, "");
  }

  /**
   * Constructs the full URL including query parameters
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
  ): string {
    const isAbsolute = endpoint.startsWith("http://") || endpoint.startsWith("https://");
    const baseUrl = this.getBaseUrl();
    const base = isAbsolute ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    if (!params || Object.keys(params).length === 0) {
      return base;
    }

    const hasProtocol = base.startsWith("http://") || base.startsWith("https://");
    const url = new URL(
      base,
      hasProtocol ? undefined : typeof window !== "undefined" ? window.location.origin : "http://localhost",
    );

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });

    return hasProtocol || isAbsolute ? url.toString() : `${url.pathname}${url.search}`;
  }

  /**
   * Attempts to refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.getBaseUrl()}${ENDPOINTS.AUTH.REFRESH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      const newAccess = data.access || data.access_token;
      const newRefresh = data.refresh || data.refresh_token || refreshToken;

      if (newAccess) {
        tokenStorage.setTokens({ access: newAccess, refresh: newRefresh });
        return newAccess;
      }
      return null;
    } catch {
      tokenStorage.clearTokens();
      return null;
    }
  }

  /**
   * Process all queued requests after token refresh completes
   */
  private processQueue(success: boolean): void {
    const currentQueue = [...this.refreshQueue];
    this.refreshQueue = [];

    currentQueue.forEach((item) => {
      if (success) {
        item.retry().then(item.resolve).catch(item.reject);
      } else {
        item.reject(
          new ApiError({
            status: 401,
            detail: "نشست کاربری شما به پایان رسیده است. لطفاً مجدداً وارد شوید.",
          }),
        );
      }
    });
  }

  /**
   * Core request executor with timeout, token injection, and 401 retry
   */
  public async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const {
      params,
      body,
      requiresAuth = true,
      timeoutMs = 15000,
      headers: customHeaders = {},
      ...customConfig
    } = config;

    const url = this.buildUrl(endpoint, params);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(customHeaders as Record<string, string>),
    };

    // Bearer token injection
    if (requiresAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Set JSON content-type if body is not FormData
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (!isFormData && body !== undefined && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Handle timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const executeFetch = async (): Promise<Response> => {
      try {
        return await fetch(url, {
          ...customConfig,
          headers,
          signal: controller.signal,
          body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
        });
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          throw new ApiError({
            status: 408,
            detail: "مهلت برقراری ارتباط با سرور به پایان رسید (Request Timeout).",
            isNetworkError: true,
          });
        }
        throw new ApiError({
          status: 0,
          detail: "خطا در اتصال به شبکه. لطفاً دسترسی به اینترنت خود را بررسی کنید.",
          isNetworkError: true,
        });
      }
    };

    try {
      const response = await executeFetch();
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized for authenticated requests (Silent Refresh)
      if (response.status === 401 && requiresAuth && tokenStorage.getRefreshToken()) {
        if (this.isRefreshing) {
          return new Promise<T>((resolve, reject) => {
            this.refreshQueue.push({
              resolve: resolve as (val: unknown) => void,
              reject,
              retry: () => this.request<T>(endpoint, config),
            });
          });
        }

        this.isRefreshing = true;
        const newAccessToken = await this.refreshAccessToken();
        this.isRefreshing = false;

        if (newAccessToken) {
          this.processQueue(true);
          // Retry original request with fresh token
          return this.request<T>(endpoint, config);
        } else {
          this.processQueue(false);
          throw new ApiError({
            status: 401,
            detail: "نشست کاربری شما منقضی شده است. لطفاً وارد حساب خود شوید.",
          });
        }
      }

      // Parse response body
      let responseData: unknown = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json();
        } catch {
          responseData = null;
        }
      } else {
        try {
          responseData = await response.text();
        } catch {
          responseData = null;
        }
      }

      if (!response.ok) {
        throw parseDjangoError(responseData, response.status);
      }

      return responseData as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Convenience HTTP Methods
  public get<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  public put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  public patch<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  public delete<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
