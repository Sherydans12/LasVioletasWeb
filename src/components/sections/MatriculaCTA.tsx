"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, VIEWPORT_ONCE } from "@/lib/animations";
import { BLUR_NEUTRAL } from "@/lib/images";

export function MatriculaCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="admision"
      aria-labelledby="matricula-heading"
      className="py-24 lg:py-32 bg-school-violet overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-school-gold mb-6"
            >
              Últimos cupos 2026 · Coquimbo
            </motion.span>

            <motion.h2
              id="matricula-heading"
              variants={fadeInUp}
              className="text-(length:--text-4xl) font-heading font-bold leading-[1.1] tracking-[-0.02em] text-white mb-6 text-balance"
            >
              Matrícula 2026
              <br />
              <span className="text-school-gold">aún disponible</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-(length:--text-lg) text-white/75 leading-relaxed mb-4"
            >
              Aún estás a tiempo de retomar tus estudios
              este año. Nuestros programas están diseñados para adaptarse a la
              vida del estudiante adulto.
            </motion.p>

            <motion.ul
              variants={staggerContainer}
              className="space-y-2 mb-10 text-sm text-white/70"
            >
              {[
                "Últimos cupos disponibles para el año 2026",
                "Sin requisito de edad máxima",
                "Horarios vespertinos y diurnos",
                "Orientación vocacional sin costo",
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={fadeInLeft}
                  className="flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-school-gold shrink-0" aria-hidden="true" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp}>
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="inline-block"
              >
                <Link
                  href="#contacto"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-school-gold text-school-violet font-semibold text-sm hover:bg-school-gold-light transition-colors duration-200 shadow-lg shadow-school-gold/20 min-h-[44px]"
                >
                  Solicitar información
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image column */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="relative"
          >
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-school-violet/20">
              <Image
                src="/matricula-cta.webp"
                alt="Estudiantes del Instituto Las Violetas en ceremonia de graduación, sosteniendo sus diplomas"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                quality={80}
                placeholder="blur"
                blurDataURL={BLUR_NEUTRAL}
              />
              {/* Subtle overlay to integrate with section background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-l from-school-violet/20 to-transparent"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ delay: 0.4, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl px-5 py-3 shadow-xl"
              aria-hidden="true"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Matrículas abiertas</p>
              <p className="text-lg font-heading font-bold text-school-violet">Año 2026</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
