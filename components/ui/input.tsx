import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-[12px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[13.5px] text-ink outline-none transition-all duration-200 ease-in-out placeholder:text-ink-faint focus:border-primary focus:shadow-[0_0_0_4px_var(--tint)]",
          error && "border-rose-500",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  toggle?: React.ReactNode;
  error?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, icon, toggle, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:stroke-ink-faint">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-[12px] border-[1.5px] border-border bg-surface py-[13px] pr-11 pl-3.5 text-[14.5px] text-ink outline-none transition-all duration-200 ease-in-out placeholder:text-ink-faint focus:border-primary focus:shadow-[0_0_0_4px_var(--tint)]",
            toggle && "pl-11",
            error && "border-rose-500",
            className,
          )}
          {...props}
        />
        {toggle && (
          <span className="absolute top-1/2 left-3.5 -translate-y-1/2 cursor-pointer [&_svg]:static [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:stroke-ink-faint">
            {toggle}
          </span>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
