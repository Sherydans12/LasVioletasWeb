"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Media } from "@prisma/client";
import { MediaPreviewLightbox } from "@/components/admin/MediaPreviewLightbox";
import { fadeInUp, staggerContainerFast, VIEWPORT_ONCE } from "@/lib/animations";

type Filter = "all" | "image" | "video";

export function GaleriaGrid({ items }: { items: Media[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [previewItem, setPreviewItem] = useState<Media | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.tipo === filter);
  }, [items, filter]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Todo" },
    { id: "image", label: "Fotos" },
    { id: "video", label: "Videos" },
  ];

  return (
    <>
      <MediaPreviewLightbox
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        variant="public"
      />

      <div
        className="flex flex-wrap gap-2 mb-10"
        role="tablist"
        aria-label="Filtrar galería"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-school-violet text-white"
                : "bg-school-neutral text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          No hay contenido en esta categoría todavía.
        </p>
      ) : (
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          animate="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((item) => (
            <motion.figure
              key={item.id}
              role="button"
              tabIndex={0}
              variants={fadeInUp}
              onClick={() => setPreviewItem(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPreviewItem(item);
                }
              }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-school-neutral shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
            >
              {item.tipo === "video" ? (
                <video
                  src={item.url}
                  className="aspect-square h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="aspect-square h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent py-3 text-center text-xs font-medium text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                Ver en pantalla completa
              </span>
            </motion.figure>
          ))}
        </motion.div>
      )}
    </>
  );
}
