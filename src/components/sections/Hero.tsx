"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/animations";
import { BLUR_VIOLET } from "@/lib/images";

const HERO_IMAGE_URL = "/hero-principal.webp";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion ? {} : staggerContainer;
  const itemVariants = prefersReducedMotion ? {} : fadeInUp;
  const fadeVariants = prefersReducedMotion ? {} : fadeIn;

  return (
    <section
      aria-label="Bienvenida institucional"
      className="relative min-h-svh flex items-center overflow-hidden"
    >
      {/* Background image */}
      <Image
        src={HERO_IMAGE_URL}
        alt="Sala principal del Instituto Las Violetas, establecimiento educacional para adultos en Chile"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        quality={85}
        placeholder="blur"
        blurDataURL={BLUR_VIOLET}
      />

      {/* Violet gradient overlay — ensures WCAG AA contrast for white text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-school-violet/95 via-school-violet/80 to-school-violet/40"
      />

      {/* Subtle bottom vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-school-violet/60 via-transparent to-transparent"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          {/* Eyebrow label */}
          <motion.div variants={fadeVariants} viewport={VIEWPORT_ONCE}>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-school-gold mb-6">
              Últimos cupos disponibles — Matrícula 2026 · Coquimbo
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-(length:--text-5xl) font-bold leading-[1.1] tracking-[-0.02em] text-white mb-6 text-balance"
          >
            Tu futuro no{" "}
            <span className="text-school-gold">tiene límites.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-(length:--text-lg) text-white/80 leading-relaxed max-w-xl mb-10"
          >
            Aún estás a tiempo de nivelar tus estudios este año.
            Educación de calidad para adultos en Coquimbo, con horarios que se adaptan a tu vida.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                href="#admision"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-school-gold text-school-violet font-semibold text-sm hover:bg-school-gold-light transition-colors duration-200 shadow-lg shadow-school-gold/25 min-h-[44px]"
              >
                Matrícula 2026
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>

            <Link
              href="#nosotros"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white/40 text-white font-semibold text-sm hover:border-school-gold hover:text-school-gold transition-all duration-200 min-h-[44px]"
            >
              Conócenos
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-white/40 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-linear-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
