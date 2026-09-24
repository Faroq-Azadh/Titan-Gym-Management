"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Sparkles, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api/errors";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; text?: string; width?: number; type?: string; shape?: string },
          ) => void;
        };
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

export function SocialLogin() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [manualClientId, setManualClientId] = useState("");
  const [testToken, setTestToken] = useState("");
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const [clientId, setClientId] = useState(envClientId);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("titan_google_client_id");
      if (saved) {
        setClientId(saved);
      } else if (envClientId) {
        setClientId(envClientId);
      }
    }
  }, [envClientId]);

  const handleGoogleSuccess = useCallback(
    async (idToken?: string, accessToken?: string) => {
      if (!idToken && !accessToken) {
        setErrorMsg("توکن احراز هویت از گوگل دریافت نشد.");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMsg(null);

        const res = await loginWithGoogle({
          id_token: idToken,
          access_token: accessToken,
        });

        const role = res?.user?.role;
        if (role === "OWNER" || role === "COACH") {
          router.push("/admin");
        } else {
          router.push("/admin");
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMsg(err.detail || "ورود با حساب گوگل با خطا مواجه شد.");
        } else if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("ورود با حساب گوگل با خطا مواجه شد.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loginWithGoogle, router],
  );

  // Initialize Google GIS
  useEffect(() => {
    if (typeof window === "undefined" || !clientId) return;

    const initGsi = () => {
      if (!window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              handleGoogleSuccess(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: "outline",
            size: "large",
            width: 380,
            text: "signin_with",
            shape: "rectangular",
          });
        }
      } catch {
        // Ignore initialization errors
      }
    };

    if (!document.getElementById("google-gis-sdk")) {
      const script = document.createElement("script");
      script.id = "google-gis-sdk";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [clientId, handleGoogleSuccess]);

  const handleGoogleClick = () => {
    setErrorMsg(null);

    if (!clientId) {
      setShowConfigModal(true);
      return;
    }

    if (!window.google?.accounts?.id) {
      setErrorMsg("در حال بارگذاری سرویس گوگل... لطفاً چند لحظه دیگر کلیک کنید.");
      return;
    }

    try {
      setIsLoading(true);

      // Trigger Google Identity Services One Tap / Prompt
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            handleGoogleSuccess(response.credential);
          } else {
            setIsLoading(false);
          }
        },
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          setIsLoading(false);
          // If One Tap was suppressed by browser, trigger Google button click
          const hiddenBtn = googleBtnContainerRef.current?.querySelector('div[role="button"]') as HTMLElement | null;
          if (hiddenBtn) {
            hiddenBtn.click();
          } else if (window.google?.accounts?.oauth2) {
            // Fallback to token client
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: "openid email profile",
              callback: (res) => {
                if (res.access_token) {
                  handleGoogleSuccess(undefined, res.access_token);
                } else {
                  setIsLoading(false);
                }
              },
            });
            tokenClient.requestAccessToken();
          }
        }
      });
    } catch {
      setIsLoading(false);
      setErrorMsg("خطایی در برقراری ارتباط با گوگل رخ داد.");
    }
  };

  const handleSaveManualClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualClientId.trim()) {
      localStorage.setItem("titan_google_client_id", manualClientId.trim());
      setClientId(manualClientId.trim());
      setShowConfigModal(false);
      setErrorMsg(null);
    }
  };

  const handleSendTestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testToken.trim()) return;
    setShowConfigModal(false);
    await handleGoogleSuccess(testToken.trim());
  };

  return (
    <div>
      {errorMsg && (
        <div className="mb-3 flex items-start gap-2 rounded-[10px] border border-rose-200 bg-rose-50 p-2.5 text-[12px] text-rose-700 animate-in fade-in duration-200">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Hidden container for rendering official Google button */}
      <div ref={googleBtnContainerRef} className="hidden" aria-hidden="true" />

      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-border py-3 text-[13.5px] font-semibold text-ink-soft transition-all duration-200 ease-in-out hover:border-ink-faint hover:bg-bg disabled:opacity-60 cursor-pointer"
        aria-label="ورود با گوگل"
      >
        {isLoading ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin text-ink-faint" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
            <path
              fill="#EA4335"
              d="M12 11v2.4h6.7c-.3 1.6-2.1 4.7-6.7 4.7-4 0-7.3-3.3-7.3-7.4S8 3.3 12 3.3c2.3 0 3.8.9 4.7 1.8l2.5-2.4C17.6 1.2 15.1 0 12 0 5.4 0 0 5.4 0 12s5.4 12 12 12c6.9 0 11.5-4.8 11.5-11.6 0-.8-.1-1.4-.2-2H12z"
            />
          </svg>
        )}
        <span>{isLoading ? "در حال اتصال به گوگل..." : "ورود با گوگل"}</span>
      </button>

      {/* Google Setup & Testing Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-2xl text-right">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="absolute left-4 top-4 text-ink-faint hover:text-ink cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">تنظیم ورود با گوگل (OAuth)</h3>
            </div>

            <p className="mb-4 text-xs leading-[1.8] text-ink-soft">
              برای فعال‌سازی کامل ورود با گوگل، شناسه Client ID گوگل خود را در فایل <code className="rounded bg-slate-100 px-1.5 py-0.5 text-rose-600 font-mono text-[11px]">.env</code> در متغیر <code className="rounded bg-slate-100 px-1.5 py-0.5 text-primary-dark font-mono text-[11px]">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> قرار دهید.
            </p>

            {/* Quick Test Option */}
            <form onSubmit={handleSaveManualClientId} className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-ink">
                یا شناسه Client ID گوگل را وارد کنید:
              </label>
              <input
                type="text"
                dir="ltr"
                value={manualClientId}
                onChange={(e) => setManualClientId(e.target.value)}
                placeholder="123456789-xxx.apps.googleusercontent.com"
                className="mb-2.5 w-full rounded-lg border border-border p-2.5 text-xs text-ink outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-ink py-2 text-xs font-bold text-white hover:bg-primary-dark cursor-pointer transition-colors"
              >
                ذخیره و فعال‌سازی
              </button>
            </form>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <span className="relative bg-white px-2 text-[11px] text-ink-faint">یا تست مستقیم API با توکن</span>
            </div>

            <form onSubmit={handleSendTestToken}>
              <input
                type="text"
                dir="ltr"
                value={testToken}
                onChange={(e) => setTestToken(e.target.value)}
                placeholder="Google ID Token یا Access Token تستی"
                className="mb-2.5 w-full rounded-lg border border-border p-2.5 text-xs text-ink outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-full rounded-lg border border-border bg-tint py-2 text-xs font-bold text-primary-dark hover:bg-primary/20 cursor-pointer transition-colors"
              >
                ارسال مستقیم به POST /users/google/
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function RoleNote() {
  return (
    <div className="mt-5 flex items-start gap-[9px] rounded-[12px] border border-primary/30 bg-tint px-3.5 py-3">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-[17px] w-[17px] shrink-0 stroke-primary-dark"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <p className="text-[12.5px] leading-[1.7] text-ink-soft">
        مربیان و اعضا نمی‌توانند ثبت‌نام کنند؛ آن‌ها توسط مدیر باشگاه اضافه
        می‌شوند و فقط وارد می‌شوند.
      </p>
    </div>
  );
}

export function GymRegistrationLink() {
  return (
    <p className="mt-5 text-center text-sm text-ink-soft">
      می‌خواهید باشگاه‌تان را ثبت کنید؟{" "}
      <Link
        href="/register-gym"
        className="font-bold text-primary-dark hover:underline"
      >
        درخواست ثبت باشگاه
      </Link>
    </p>
  );
}
