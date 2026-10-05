"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { status, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      const loginUrl = pathname ? `/login?next=${encodeURIComponent(pathname)}` : "/login";
      router.replace(loginUrl);
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg gap-3 text-ink-muted">
        <Loader2 className="w-8 h-8 animate-spin text-titan-orange" />
        <span className="text-sm font-medium">در حال بررسی اطلاعات کاربری...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
