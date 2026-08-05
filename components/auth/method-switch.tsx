"use client";

import { cn } from "@/lib/utils";

export type LoginMethod = "password" | "otp";

interface MethodSwitchProps {
  activeMethod: LoginMethod;
  onMethodChange: (method: LoginMethod) => void;
}

export function MethodSwitch({
  activeMethod,
  onMethodChange,
}: MethodSwitchProps) {
  return (
    <div className="mb-[22px] flex gap-2">
      <button
        type="button"
        className={cn(
          "flex-1 rounded-[10px] border-[1.5px] py-[9px] text-[13px] font-semibold transition-all duration-200 ease-in-out",
          activeMethod === "password"
            ? "border-primary bg-tint text-primary-dark"
            : "border-border text-ink-soft",
        )}
        onClick={() => onMethodChange("password")}
        aria-pressed={activeMethod === "password"}
      >
        ورود با رمز عبور
      </button>
      <button
        type="button"
        className={cn(
          "flex-1 rounded-[10px] border-[1.5px] py-[9px] text-[13px] font-semibold transition-all duration-200 ease-in-out",
          activeMethod === "otp"
            ? "border-primary bg-tint text-primary-dark"
            : "border-border text-ink-soft",
        )}
        onClick={() => onMethodChange("otp")}
        aria-pressed={activeMethod === "otp"}
      >
        ورود با کد تایید
      </button>
    </div>
  );
}
