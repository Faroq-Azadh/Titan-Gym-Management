import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label = "یا ادامه با", className }: DividerProps) {
  return (
    <div
      className={cn(
        "my-6 flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
        className,
      )}
    >
      <span className="text-[12.5px] font-semibold text-ink-faint">{label}</span>
    </div>
  );
}
