"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function NotFoundView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-school-violet px-6 py-16 text-center">
      <Link
        href="/"
        className="mb-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-school-gold rounded-lg"
        aria-label="Instituto Las Violetas — Ir al inicio"
      >
        <div className="relative h-16 w-16 mx-auto opacity-90 hover:opacity-100 transition-opacity">
          <Image
            src="/logo-institucional.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden
            priority
          />
        </div>
      </Link>

      <main
        id="main-content"
        className="max-w-lg w-full"
        aria-labelledby="not-found-heading"
      >
        <p
          className="font-heading text-[clamp(5rem,18vw,9rem)] font-bold leading-none tracking-tight text-school-gold/35 select-none mb-6"
          aria-hidden="true"
        >
          404
        </p>

        <h1 id="not-found-heading" className="sr-only">
          Error 404 — Página no encontrada
        </h1>

        <h2 className="font-heading text-(length:--text-3xl) sm:text-(length:--text-4xl) font-bold text-white tracking-[-0.02em] mb-4 text-balance">
          Página no encontrada
        </h2>

        <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-10 text-pretty">
          El recurso que buscas no está disponible, cambió de ubicación o se
          encuentra en mantención institucional.
        </p>

        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] min-w-[200px] px-8 py-3.5 rounded-lg bg-school-gold text-school-violet font-semibold text-sm shadow-lg shadow-black/20 hover:bg-school-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white transition-colors duration-200"
          >
            Volver al Inicio
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
