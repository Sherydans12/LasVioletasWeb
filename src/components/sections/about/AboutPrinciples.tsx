"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import {
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/animations";
import { BLUR_NEUTRAL } from "@/lib/images";

const PILLARS = [
  {
    id: "consonancia",
    Icon: GraduationCap,
    title: "Consonancia Educativa",
    description:
      "Una educación que responde a tus intereses y necesidades, alineada con los requerimientos de la sociedad y las Políticas Educacionales del Ministerio de Educación (Mineduc).",
  },
  {
    id: "integral",
    Icon: Sparkles,
    title: "Formación Integral",
    description:
      "Promovemos un pensamiento creativo, original, reflexivo, riguroso y crítico. Una formación cívica, ética y moral basada en el respeto mutuo, la solidaridad y la excelencia.",
  },
];

export function AboutPrinciples() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="mt-20 lg:mt-24 pt-20 lg:pt-24 border-t border-border/50"
      aria-labelledby="principles-heading"
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div variants={fadeInLeft}>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-school-violet mb-4">
            Principios y valores
          </span>
          <h3
            id="principles-heading"
            className="text-(length:--text-3xl) font-heading font-bold tracking-[-0.02em] text-foreground mb-4 text-balance"
          >
            Los pilares del CEIA
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Nuestro ideario se traduce en prácticas concretas que acompañan tu
            proceso formativo con rigor, inclusión y sentido comunitario.
          </p>

          <ul className="space-y-6" aria-label="Pilares fundamentales">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.id}
                className="flex gap-4 rounded-xl border border-border/50 bg-school-neutral/80 p-5 hover:border-school-gold/40 hover:shadow-sm transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-lg bg-school-violet/10 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <pillar.Icon size={20} className="text-school-violet" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1.5">
                    {pillar.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.figure
          variants={fadeInRight}
          className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-lg shadow-black/10 bg-school-neutral"
        >
          <Image
            src="/nosotros-valores.webp"
            alt="Comunidad educativa del CEIA Las Violetas — valores y principios institucionales"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover object-center"
            quality={80}
            placeholder="blur"
            blurDataURL={BLUR_NEUTRAL}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 ring-1 ring-inset ring-school-violet/10 rounded-2xl"
          />
        </motion.figure>
      </div>
    </motion.div>
  );
}
