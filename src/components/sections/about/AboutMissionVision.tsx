"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { fadeInUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/animations";
import { cn } from "@/lib/utils";

type TabId = "vision" | "mision";

const TABS: {
  id: TabId;
  label: string;
  Icon: typeof Eye;
  title: string;
  body: string;
}[] = [
  {
    id: "vision",
    label: "Visión",
    Icon: Eye,
    title: "Visión institucional",
    body: "Nuestro establecimiento busca el desarrollo de un proyecto educativo para jóvenes y adultos, inclusivo y sustentable, que respeta y valora la diversidad, entregándote una formación que te permita fortalecer tu desarrollo personal y social.",
  },
  {
    id: "mision",
    label: "Misión",
    Icon: Target,
    title: "Misión institucional",
    body: "Fortalecer tus potencialidades para facilitarte el acceso a mayores posibilidades de desarrollo personal e inclusión social, mejores oportunidades para tu emprendimiento y educación permanente.",
  },
];

export function AboutMissionVision() {
  const baseId = useId();
  const [active, setActive] = useState<TabId>("vision");
  const current = TABS.find((t) => t.id === active)!;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="mt-20 lg:mt-24"
      aria-labelledby={`${baseId}-heading`}
    >
      <motion.div variants={fadeInUp} className="text-center mb-10">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-school-violet mb-4">
          Proyecto educativo (PEI)
        </span>
        <h3
          id={`${baseId}-heading`}
          className="text-(length:--text-3xl) font-heading font-bold tracking-[-0.02em] text-foreground text-balance"
        >
          Misión y visión
        </h3>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Los pilares que orientan nuestra labor formativa con jóvenes y adultos
          en Coquimbo.
        </p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="max-w-3xl mx-auto"
      >
        <div
          role="tablist"
          aria-label="Misión y visión institucional"
          className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-school-neutral border border-border/60"
        >
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-school-gold focus-visible:ring-offset-2",
                  isActive
                    ? "bg-school-violet text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                )}
              >
                <tab.Icon size={18} aria-hidden="true" />
                <span className="font-heading tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            role="tabpanel"
            id={`${baseId}-panel-${current.id}`}
            aria-labelledby={`${baseId}-tab-${current.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-6 rounded-2xl border border-border/60 bg-background p-8 lg:p-10 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-11 h-11 rounded-xl bg-school-violet/10 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <current.Icon size={22} className="text-school-violet" />
              </div>
              <h4 className="text-(length:--text-xl) font-heading font-bold text-foreground pt-1.5">
                {current.title}
              </h4>
            </div>
            <p className="text-muted-foreground leading-relaxed">{current.body}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
