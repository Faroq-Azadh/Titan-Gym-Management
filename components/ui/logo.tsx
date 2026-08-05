import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  href?: string;
}

function LogoMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box =
    size === "sm"
      ? "h-8 w-8 rounded-[9px] [&_svg]:h-4 [&_svg]:w-4"
      : "h-[34px] w-[34px] rounded-[10px] [&_svg]:h-[18px] [&_svg]:w-[18px]";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br from-primary to-cyan",
        box,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0F172A"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M4 12h4M16 12h4M8 7v10M16 7v10M8 12h8" />
      </svg>
    </span>
  );
}

export function Logo({ variant = "light", className, href }: LogoProps) {
  const content = (
    <>
      <LogoMark size={variant === "dark" ? "sm" : "md"} />
      <span>تیتان</span>
    </>
  );

  const classes = cn(
    "flex items-center gap-2.5 font-extrabold",
    variant === "light" && "text-xl text-white",
    variant === "dark" && "text-[19px] text-ink",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label="تیتان — صفحه اصلی">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

export function MobileLogo({ className }: { className?: string }) {
  return (
    <Logo
      variant="dark"
      className={cn("mb-8 hidden max-[980px]:flex", className)}
    />
  );
}
