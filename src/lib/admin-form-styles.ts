import { cn } from "@/lib/utils";

export const adminInputBase =
  "w-full rounded-lg border bg-background px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-school-gold focus:ring-2 focus:ring-school-gold/25";

export const adminSelectBase =
  "w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-school-gold focus:ring-2 focus:ring-school-gold/25";

export const adminTextareaBase =
  "w-full min-h-[160px] rounded-lg border bg-background px-4 py-3 text-sm leading-relaxed resize-y transition-all duration-200 outline-none focus:border-school-gold focus:ring-2 focus:ring-school-gold/25";

export function adminFieldClass(
  state: "idle" | "valid" | "invalid",
  base = adminInputBase
) {
  return cn(
    base,
    "border-border",
    state === "valid" &&
      "border-emerald-500/60 ring-1 ring-emerald-500/20 focus:border-emerald-600 focus:ring-emerald-500/20",
    state === "invalid" &&
      "border-destructive/50 ring-1 ring-destructive/15 focus:border-destructive focus:ring-destructive/20"
  );
}
