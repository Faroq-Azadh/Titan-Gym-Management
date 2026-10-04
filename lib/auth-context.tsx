"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  authService,
  type User,
  type LoginPayload,
  type GoogleLoginPayload,
  type LoginResponse,
  type OTPRequestPayload,
  type OTPVerifyPayload,
  type DetailResponse,
} from "@/lib/api/services/auth.service";
import { tokenStorage } from "@/lib/api/token";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithPassword: (payload: LoginPayload) => Promise<LoginResponse>;
  loginWithGoogle: (payload: GoogleLoginPayload) => Promise<LoginResponse>;
  requestOtp: (payload: OTPRequestPayload) => Promise<DetailResponse>;
  verifyOtp: (payload: OTPVerifyPayload) => Promise<LoginResponse | DetailResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  updateUser: (payload: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize cached user & verify session on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // 1. First try instant load from localStorage for snappy UI
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("titan_user");
          const localAvatar = localStorage.getItem("titan_user_avatar");
          if (cached && isMounted) {
            const parsed = JSON.parse(cached);
            if (localAvatar) parsed.avatar = localAvatar;
            setUser(parsed);
          }
        } catch {
          // Ignore parse errors
        }
      }

      // 2. If token exists, sync latest profile from backend
      if (tokenStorage.hasValidSession()) {
        try {
          const freshUser = await authService.getMe();
          if (typeof window !== "undefined") {
            const localAvatar = localStorage.getItem("titan_user_avatar");
            if (localAvatar && (!freshUser.avatar || freshUser.avatar === "")) {
              freshUser.avatar = localAvatar;
            }
          }
          if (isMounted) {
            setUser(freshUser);
          }
        } catch {
          // Token might be invalid or expired and refresh failed
          if (isMounted && !tokenStorage.hasValidSession()) {
            setUser(null);
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to global logout events
    const handleLogoutEvent = () => {
      if (isMounted) {
        setUser(null);
      }
    };
    window.addEventListener("titan:auth-logout", handleLogoutEvent);

    return () => {
      isMounted = false;
      window.removeEventListener("titan:auth-logout", handleLogoutEvent);
    };
  }, []);

  const loginWithPassword = useCallback(async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const loginWithGoogle = useCallback(async (payload: GoogleLoginPayload) => {
    const res = await authService.googleLogin(payload);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const requestOtp = useCallback(async (payload: OTPRequestPayload) => {
    return authService.requestOtp(payload);
  }, []);

  const verifyOtp = useCallback(async (payload: OTPVerifyPayload) => {
    const res = await authService.verifyOtp(payload);
    if ("user" in res && res.user) {
      setUser(res.user);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const u = await authService.getMe();
      setUser(u);
      return u;
    } catch {
      return null;
    }
  }, []);

  const updateUser = useCallback(async (payload: Partial<User>) => {
    if (payload.avatar && typeof window !== "undefined") {
      try {
        localStorage.setItem("titan_user_avatar", payload.avatar);
      } catch {}
    }

    let updated: User | null = null;
    try {
      updated = await authService.updateMe(payload);
    } catch {
      // Backend might fail or reject large avatar base64 string; try updating rest
      if (payload.avatar) {
        try {
          const { avatar: _av, ...rest } = payload;
          updated = await authService.updateMe(rest);
        } catch {}
      }
    }

    setUser((prev) => {
      const merged: User = {
        ...(prev || ({} as User)),
        ...(updated || {}),
        ...payload,
        avatar: payload.avatar || updated?.avatar || prev?.avatar || null,
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("titan_user", JSON.stringify(merged));
        } catch {}
      }
      return merged;
    });

    return (updated || payload) as User;
  }, []);

  const isAuthenticated = Boolean(user && tokenStorage.hasValidSession());

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        loginWithPassword,
        loginWithGoogle,
        requestOtp,
        verifyOtp,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
