"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BLUR_NEUTRAL } from "@/lib/images";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/animations";

const GALLERY = [
  {
    src: "/infraestructura-aula.webp",
    alt: "Sala de clases del Instituto Las Violetas, con mobiliario moderno y equipamiento adecuado para adultos",
    label: "Salas de clases",
  },
  {
    src: "/infraestructura-patio.webp",
    alt: "Área exterior y patio del Instituto Las Violetas, espacio de convivencia estudiantil",
    label: "Áreas exteriores",
  },
  {
    src: "/nosotros-valores.webp",
    alt: "Fachada institucional del Instituto Las Violetas, establecimiento educacional en Chile",
    label: "Fachada institucional",
  },
];

export function Infrastructure() {
  return (
    <section
      id="instalaciones"
      aria-labelledby="infra-heading"
      className="py-24 lg:py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mb-12 lg:mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-school-violet mb-4"
          >
            Nuestro establecimiento
          </motion.span>
          <motion.h2
            id="infra-heading"
            variants={fadeInUp}
            className="text-(length:--text-4xl) font-heading font-bold leading-[1.15] tracking-[-0.02em] text-foreground max-w-xl text-balance"
          >
            Instalaciones pensadas para el aprendizaje
          </motion.h2>
        </motion.div>

        {/*
          Asymmetric gallery — lg: 3-col left + 2-col right stack
          lg:items-start prevents the grid row from stretching figures
          past their natural aspect-ratio height.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 lg:items-start">

          {/* ── Large image — left (3 cols) ──────────────────────────── */}
          <motion.figure
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-3 group relative aspect-4/3 overflow-hidden rounded-2xl shadow-md bg-school-violet/10"
          >
            <Image
              src={GALLERY[0].src}
              alt={GALLERY[0].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              quality={80}
              placeholder="blur"
              blurDataURL={BLUR_NEUTRAL}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent pointer-events-none"
            />
            <figcaption className="absolute bottom-4 left-4 text-sm font-semibold text-white drop-shadow-sm">
              {GALLERY[0].label}
            </figcaption>
          </motion.figure>

          {/* ── Right column — 2 stacked images (2 cols) ─────────────── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-2 flex flex-col gap-4 lg:gap-5"
          >
            {GALLERY.slice(1).map((item) => (
              <motion.figure
                key={item.src}
                variants={fadeInRight}
                className="group relative aspect-3/2 overflow-hidden rounded-2xl shadow-md bg-school-violet/10"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                  quality={80}
                  placeholder="blur"
                  blurDataURL={BLUR_NEUTRAL}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent pointer-events-none"
                />
                <figcaption className="absolute bottom-3 left-4 text-sm font-semibold text-white drop-shadow-sm">
                  {item.label}
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
