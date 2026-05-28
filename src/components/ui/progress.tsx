"use client";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<"div"> & {
  value?: number;
  indicatorClassName?: string;
};

export function Progress({
  className,
  value = 0,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-school-neutral border border-border/40",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          indicatorClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
