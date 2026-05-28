"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Media } from "@prisma/client";

type MediaPreviewLightboxProps = {
  item: Media | null;
  onClose: () => void;
  /** `public` usa fondo más oscuro para la galería del sitio. */
  variant?: "admin" | "public";
};

export function MediaPreviewLightbox({
  item,
  onClose,
  variant = "admin",
}: MediaPreviewLightboxProps) {
  const backdropClass =
    variant === "public"
      ? "bg-black/95"
      : "bg-black/70 backdrop-blur-sm";
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, handleKeyDown]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa del recurso"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          <button
            type="button"
            className={`absolute inset-0 ${backdropClass}`}
            onClick={onClose}
            aria-label="Cerrar vista previa"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex max-h-[90vh] max-w-5xl flex-col items-center"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <div className="flex max-h-[85vh] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
              {item.tipo === "video" ? (
                <video
                  src={item.url}
                  controls
                  autoPlay
                  className="max-h-[85vh] max-w-full h-auto w-full"
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="max-h-[85vh] max-w-full h-auto w-full object-contain"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
