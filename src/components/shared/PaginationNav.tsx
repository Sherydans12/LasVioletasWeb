import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/pagination";

type PaginationNavProps = {
  basePath: string;
  meta: PaginationMeta;
  className?: string;
};

function pageHref(basePath: string, page: number, limit: number) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (limit !== 12) params.set("limit", String(limit));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function PaginationNav({ basePath, meta, className }: PaginationNavProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginación"
      className={cn("flex flex-wrap items-center justify-center gap-4 mt-10", className)}
    >
      {meta.hasPrev ? (
        <Link
          href={pageHref(basePath, meta.page - 1, meta.limit)}
          className="px-4 py-2 rounded-lg border border-school-violet/20 text-sm font-medium text-school-violet hover:bg-school-violet/5 transition-colors"
        >
          ← Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm text-muted-foreground opacity-50">
          ← Anterior
        </span>
      )}

      <span className="text-sm text-muted-foreground tabular-nums">
        Página {meta.page} de {meta.totalPages}
        <span className="hidden sm:inline"> · {meta.total} elementos</span>
      </span>

      {meta.hasNext ? (
        <Link
          href={pageHref(basePath, meta.page + 1, meta.limit)}
          className="px-4 py-2 rounded-lg border border-school-violet/20 text-sm font-medium text-school-violet hover:bg-school-violet/5 transition-colors"
        >
          Siguiente →
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm text-muted-foreground opacity-50">
          Siguiente →
        </span>
      )}
    </nav>
  );
}
