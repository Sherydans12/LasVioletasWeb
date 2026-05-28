import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PublicEmptyStateProps = {
  icon: LucideIcon;
  message: string;
  className?: string;
};

export function PublicEmptyState({
  icon: Icon,
  message,
  className,
}: PublicEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 md:py-28 min-h-[320px] md:min-h-[400px]",
        className
      )}
      role="status"
    >
      <Icon
        size={72}
        strokeWidth={1.25}
        className="text-school-violet/20 mb-6"
        aria-hidden
      />
      <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed text-pretty">
        {message}
      </p>
    </div>
  );
}
