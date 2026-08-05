import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "auth" | "form";
}

export function Card({ className, variant = "auth", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-surface shadow-md",
        variant === "auth" && "rounded-[20px] p-2",
        variant === "form" && "rounded-[20px] px-[30px] py-[30px] pb-[26px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-[22px] py-5 pb-[26px] max-[420px]:px-4 max-[420px]:py-[18px] max-[420px]:pb-[22px]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHead({
  className,
  title,
  description,
}: {
  className?: string;
  title: string;
  description: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="mb-2 text-[22px] font-extrabold text-ink">{title}</h1>
      <p className="text-sm text-ink-faint">{description}</p>
    </div>
  );
}
