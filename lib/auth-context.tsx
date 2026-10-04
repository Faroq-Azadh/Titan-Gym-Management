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
          if (cached && isMounted) {
            setUser(JSON.parse(cached));
          }
        } catch {
          // Ignore parse errors
        }
      }

      // 2. If token exists, sync latest profile from backend
      if (tokenStorage.hasValidSession()) {
        try {
          const freshUser = await authService.getMe();
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
    const updated = await authService.updateMe(payload);
    setUser(updated);
    return updated;
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
