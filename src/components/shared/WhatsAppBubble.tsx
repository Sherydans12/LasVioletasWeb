"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { CONTACT } from "@/lib/contact";

/** WhatsApp path icon (official proportions) */
function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Floating WhatsApp CTA with brand green (#25D366).
 * Tooltip and button share the same delayed entrance so both appear together.
 */
const FLOAT_ENTRANCE_DELAY_S = 1.2;
const FLOAT_ENTRANCE_DURATION_S = 0.4;
const FLOAT_ENTRANCE_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const TOOLTIP_EXIT_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function WhatsAppBubble() {
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const whatsappGreen = "#25D366";

  const entranceTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        delay: FLOAT_ENTRANCE_DELAY_S,
        duration: FLOAT_ENTRANCE_DURATION_S,
        ease: FLOAT_ENTRANCE_EASE,
      };

  const tooltipVariants = prefersReducedMotion
    ? {
        inactive: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
        active: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
      }
    : {
        inactive: {
          opacity: 0,
          y: 8,
          scale: 0.95,
          transition: {
            duration: 0.25,
            ease: TOOLTIP_EXIT_EASE,
            delay: 0,
          },
        },
        active: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: entranceTransition,
        },
      };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      role="complementary"
      aria-label="Contacto por WhatsApp"
    >
      {/* Dismissible tooltip */}
      <AnimatePresence>
        {tooltipVisible && (
          <motion.div
            variants={tooltipVariants}
            initial={prefersReducedMotion ? "active" : "inactive"}
            animate="active"
            exit="inactive"
            className="relative bg-white rounded-xl shadow-xl px-4 py-3 max-w-[220px] border border-border/50"
          >
            <button
              type="button"
              onClick={() => setTooltipVisible(false)}
              aria-label="Cerrar mensaje de WhatsApp"
              className="absolute -top-2 -right-2 w-5 h-5 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X size={10} />
            </button>
            <p className="text-xs font-semibold text-foreground mb-0.5">
              ¡Últimos cupos 2026!
            </p>
            <p className="text-xs text-muted-foreground leading-snug">
              Contáctanos por WhatsApp y recibe información al instante.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main bubble */}
      <motion.a
        href={CONTACT.phones.primary.wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar matrícula 2026 por WhatsApp"
        initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={entranceTransition}
        whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
        onClick={() => setTooltipVisible(false)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/25 hover:shadow-xl transition-shadow duration-200"
        style={{ backgroundColor: whatsappGreen }}
      >
        <WhatsAppIcon size={26} />
      </motion.a>
    </div>
  );
}
