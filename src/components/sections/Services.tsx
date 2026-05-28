"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Award,
  Building2,
  Leaf,
  Star,
  HeartHandshake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerContainerFast,
  VIEWPORT_ONCE,
} from "@/lib/animations";

const SERVICES = [
  {
    id: "niveles",
    Icon: BookOpen,
    title: "Niveles y cursos acreditados",
    description:
      "Programas de estudio oficiales que permiten completar la enseñanza básica y media con reconocimiento del Ministerio de Educación.",
  },
  {
    id: "vespertino",
    Icon: Award,
    title: "Modalidad vespertina y diurna",
    description:
      "Horarios flexibles diseñados para adultos que trabajan o tienen responsabilidades familiares, sin sacrificar la calidad académica.",
  },
  {
    id: "comunidad",
    Icon: Users,
    title: "Comunidad educativa",
    description:
      "Espacios de encuentro, intercambio y fortalecimiento del tejido social entre estudiantes, docentes y familias.",
  },
  {
    id: "multiuso",
    Icon: Building2,
    title: "Sala de computación y multiuso",
    description:
      "Laboratorio de computación equipado y salas multiuso que potencian el aprendizaje tecnológico y las actividades institucionales.",
  },
  {
    id: "sostenibilidad",
    Icon: Leaf,
    title: "Sostenibilidad",
    description:
      "Comprometidos con el medioambiente mediante prácticas responsables y proyectos de impacto ecológico en el establecimiento.",
  },
  {
    id: "excelencia",
    Icon: Star,
    title: "Gestión de excelencia",
    description:
      "Procesos transparentes, cuerpo docente profesional y estándares de calidad que garantizan confianza institucional.",
  },
];

const PIE_SERVICE = {
  id: "programa-pie",
  title: "Programa de Integración Escolar (PIE)",
  badge: "Educación Inclusiva",
  description:
    "Estrategia orientada a contribuir en la permanencia, participación y logro de los objetivos de aprendizaje de todos nuestros estudiantes. Disponemos de recursos humanos y materiales adicionales para proporcionar apoyos especializados a quienes presentan Necesidades Educativas Especiales (NEE), ya sean transitorias o permanentes, equiparando tus oportunidades de aprendizaje.",
};

export function Services() {
  return (
    <section
      id="servicios"
      aria-labelledby="services-heading"
      className="py-24 lg:py-32 bg-school-neutral"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-school-violet mb-4"
          >
            Oferta educativa
          </motion.span>
          <motion.h2
            id="services-heading"
            variants={fadeInUp}
            className="text-(length:--text-4xl) font-heading font-bold leading-[1.15] tracking-[-0.02em] text-foreground mb-4 text-balance"
          >
            Formación diseñada para ti
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-(length:--text-lg) text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Cada propuesta formativa está concebida para enriquecer el
            desarrollo personal y profesional de nuestros estudiantes adultos.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service) => (
            <motion.article
              key={service.id}
              variants={scaleIn}
              className="group bg-white rounded-2xl p-6 lg:p-8 border border-school-violet/10 shadow-sm hover:border-school-gold/35 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div
                className="w-11 h-11 rounded-xl bg-school-violet/10 flex items-center justify-center mb-5 group-hover:bg-school-violet/20 transition-colors duration-300"
                aria-hidden="true"
              >
                <service.Icon size={22} className="text-school-violet" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2 tracking-[-0.01em] text-balance">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                {service.description}
              </p>
            </motion.article>
          ))}

          <motion.article
            id={PIE_SERVICE.id}
            variants={scaleIn}
            aria-labelledby="pie-service-heading"
            className="relative overflow-hidden sm:col-span-2 lg:col-span-3 rounded-2xl border-2 border-school-violet/25 bg-linear-to-br from-school-violet/5 via-background to-school-gold/5 p-6 lg:p-8 shadow-md hover:border-school-gold/50 hover:shadow-lg transition-all duration-300"
          >
            <div
              aria-hidden="true"
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-school-violet/5 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-school-gold/10 blur-xl"
            />

            <div className="relative flex flex-col sm:flex-row sm:items-start gap-6">
              <div
                className="w-12 h-12 rounded-xl bg-school-violet flex items-center justify-center shrink-0 shadow-sm"
                aria-hidden="true"
              >
                <HeartHandshake size={24} className="text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <Badge className="mb-4 bg-school-gold/15 text-school-violet border-school-gold/30 px-3 py-1 h-auto text-xs font-semibold uppercase tracking-wider">
                  {PIE_SERVICE.badge}
                </Badge>
                <h3
                  id="pie-service-heading"
                  className="text-(length:--text-xl) font-heading font-bold text-foreground mb-3 tracking-[-0.02em] text-balance"
                >
                  {PIE_SERVICE.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {PIE_SERVICE.description}
                </p>
              </div>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
