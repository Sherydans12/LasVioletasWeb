"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import type { Media } from "@prisma/client";

type GalleryCarouselProps = {
  items: Pick<Media, "id" | "url" | "tipo">[];
};

export function GalleryCarousel({ items }: GalleryCarouselProps) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1 || dismissed) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [items.length, next, dismissed]);

  if (items.length === 0 || dismissed) {
    return null;
  }

  const current = items[index];

  return (
    <section
      aria-labelledby="gallery-carousel-heading"
      className="py-16 lg:py-20 bg-school-violet text-white relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-school-violet via-school-violet to-black/30"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.15em] text-school-gold mb-2 block">
              Galería institucional
            </span>
            <h2
              id="gallery-carousel-heading"
              className="text-(length:--text-3xl) font-heading font-bold"
            >
              Momentos destacados
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-school-gold transition-colors"
            aria-label="Ocultar carrusel"
          >
            <X size={18} />
            Cerrar
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl aspect-21/9 max-h-[420px] bg-black/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {current.tipo === "video" ? (
                <video
                  src={current.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={current.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-school-gold hover:text-school-violet flex items-center justify-center transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-school-gold hover:text-school-violet flex items-center justify-center transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-school-gold text-school-violet font-semibold text-sm shadow-lg hover:bg-school-gold-light transition-colors"
            >
              <Images size={18} aria-hidden />
              Explorar galería completa
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
