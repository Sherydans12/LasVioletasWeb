"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function LatestActivitiesCta() {
  return (
    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
      <Link
        href="/noticias"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-school-violet text-school-violet text-sm font-semibold hover:bg-school-violet hover:text-white transition-colors duration-300"
      >
        Ver todas las actividades
        <ArrowRight size={18} aria-hidden />
      </Link>
    </motion.div>
  );
}
