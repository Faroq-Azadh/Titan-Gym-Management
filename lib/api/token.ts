/**
 * Token and Session Storage Management for Titan Gym
 * Supports safe browser storage with fallback and SSR guards.
 */

const ACCESS_TOKEN_KEY = "titan_access_token";
const REFRESH_TOKEN_KEY = "titan_refresh_token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(
    new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 7): void {
  if (!isBrowser()) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function deleteCookie(name: string): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY) || getCookie(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY) || getCookie(REFRESH_TOKEN_KEY);
  },

  setTokens(tokens: { access: string; refresh?: string }): void {
    if (!isBrowser()) return;
    if (tokens.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
      setCookie(ACCESS_TOKEN_KEY, tokens.access);
    }
    if (tokens.refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
      setCookie(REFRESH_TOKEN_KEY, tokens.refresh, 30);
    }
  },

  clearTokens(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    deleteCookie(ACCESS_TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
    deleteCookie("csrftoken");

    // Dispatch event so other components or tabs can react immediately
    window.dispatchEvent(new CustomEvent("titan:auth-logout"));
  },

  hasValidSession(): boolean {
    return Boolean(this.getAccessToken());
  },
};
