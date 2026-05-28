"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/animations";
import { BLUR_NEUTRAL } from "@/lib/images";
import { AboutMissionVision } from "@/components/sections/about/AboutMissionVision";
import { AboutPrinciples } from "@/components/sections/about/AboutPrinciples";

const VALUES = [
  "Compromiso con el aprendizaje permanente",
  "Transparencia y ética institucional",
  "Innovación pedagógica con propósito social",
  "Desarrollo integral y sostenible del estudiante",
];

const STATS = [
  { value: "20+", label: "Años de trayectoria" },
  { value: "500+", label: "Estudiantes egresados" },
  { value: "15", label: "Niveles y cursos activos" },
  { value: "98%", label: "Satisfacción estudiantil" },
];

export function About() {
  return (
    <section
      id="nosotros"
      aria-labelledby="about-heading"
      className="py-24 lg:py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* Text column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-school-violet mb-4"
            >
              Nuestra historia
            </motion.span>

            <motion.h2
              id="about-heading"
              variants={fadeInUp}
              className="text-(length:--text-4xl) font-heading font-bold leading-[1.15] tracking-[-0.02em] text-foreground mb-6 text-balance"
            >
              Más de dos décadas construyendo futuros
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed mb-6">
              El Instituto Las Violetas nació con la convicción de que los
              establecimientos educacionales sólidos son el pilar de las
              comunidades prósperas. Desde nuestros inicios, hemos trabajado con
              dedicación para ofrecer formación de calidad y acompañarte en tu
              trayectoria académica.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed mb-8">
              Nuestra trayectoria está marcada por la confianza de quienes
              eligen ser parte de esta comunidad educativa, y por el compromiso
              constante de mejorar, crecer e innovar en beneficio de nuestros
              estudiantes.
            </motion.p>

            <motion.ul
              variants={staggerContainer}
              className="space-y-3"
              aria-label="Valores institucionales"
            >
              {VALUES.map((value) => (
                <motion.li
                  key={value}
                  variants={fadeInLeft}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <CheckCircle2
                    size={18}
                    className="text-school-gold shrink-0"
                    aria-hidden="true"
                  />
                  {value}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Image + stats column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex flex-col gap-6"
          >
            {/* Photograph */}
            <motion.div
              variants={fadeInRight}
              className="relative w-full aspect-3/2 rounded-2xl overflow-hidden shadow-lg shadow-black/10 bg-school-neutral"
            >
              <Image
                src="/nosotros-historia.webp"
                alt="Equipo docente del Instituto Las Violetas en actividad institucional"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                quality={80}
                placeholder="blur"
                blurDataURL={BLUR_NEUTRAL}
              />
              {/* Subtle violet tint strip at bottom for contrast */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-school-violet/30 to-transparent"
              />
            </motion.div>

            {/* Stats grid */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="bg-school-neutral rounded-xl p-5 border border-border/50 hover:border-school-gold/40 hover:shadow-sm transition-all duration-300"
                >
                  <p
                    className="text-(length:--text-3xl) font-heading font-bold text-school-violet tracking-[-0.02em] mb-0.5"
                    aria-label={`${stat.value} ${stat.label}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>

        <AboutMissionVision />
        <AboutPrinciples />
      </div>
    </section>
  );
}
