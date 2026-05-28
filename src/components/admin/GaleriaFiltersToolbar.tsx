"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { buildGalleryQueryString, type GalleryFilterType } from "@/lib/galeria-filters";
import { adminInputBase } from "@/lib/admin-form-styles";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS: { value: GalleryFilterType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "image", label: "Imágenes" },
  { value: "video", label: "Videos" },
];

export function GaleriaFiltersToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const currentType = (searchParams.get("type") as GalleryFilterType) || "all";

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);
  const limit = Number.parseInt(searchParams.get("limit") ?? "12", 10) || 12;

  const applyFilters = useCallback(
    (nextQ: string, nextType: GalleryFilterType) => {
      const href =
        "/admin/galeria" +
        buildGalleryQueryString({
          q: nextQ,
          type: nextType === "all" ? undefined : nextType,
          page: 1,
          limit,
        });
      router.push(href);
    },
    [router, limit]
  );

  useEffect(() => {
    const urlQ = searchParams.get("q") ?? "";
    if (query.trim() === urlQ.trim()) return;

    const timer = window.setTimeout(() => {
      applyFilters(query, currentType);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [query, currentType, searchParams, applyFilters]);

  function onTypeChange(type: GalleryFilterType) {
    applyFilters(query, type);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilters(query, currentType);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
        <label htmlFor="galeria-search" className="sr-only">
          Buscar por nombre de archivo
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="galeria-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre de archivo…"
          className={cn(adminInputBase, "w-full pl-10")}
        />
      </form>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onTypeChange(opt.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold",
              currentType === opt.value
                ? "bg-school-violet text-white"
                : "border border-border/60 bg-school-neutral text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
