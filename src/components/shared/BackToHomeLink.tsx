import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BackToHomeLinkProps = {
  className?: string;
  label?: string;
  href?: string;
};

export function BackToHomeLink({
  className,
  label = "Volver al inicio",
  href = "/",
}: BackToHomeLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 -ml-3 mb-8 rounded-lg text-sm font-medium text-school-violet",
        "hover:bg-school-violet/5 hover:text-school-violet transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold",
        className
      )}
    >
      <ChevronLeft size={18} className="shrink-0" aria-hidden />
      {label}
    </Link>
  );
}
