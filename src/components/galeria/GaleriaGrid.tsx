"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Media } from "@prisma/client";
import { fadeInUp, staggerContainerFast, VIEWPORT_ONCE } from "@/lib/animations";

type Filter = "all" | "image" | "video";

export function GaleriaGrid({ items }: { items: Media[] }) {
  const [filter, setFilter] = useState<Filter>("all");

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
              variants={fadeInUp}
              className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border/50 bg-school-neutral shadow-sm"
            >
              {item.tipo === "video" ? (
                <video
                  src={item.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={item.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
            </motion.figure>
          ))}
        </motion.div>
      )}
    </>
  );
}
