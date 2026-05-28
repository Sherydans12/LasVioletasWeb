"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { submitContact } from "@/services/contact.service";
import type { ContactFormData } from "@/types";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/animations";
import { CONTACT } from "@/lib/contact";
import { GoogleMaps } from "@/components/shared/GoogleMaps";

const CONTACT_INFO = [
  {
    Icon: MapPin,
    label: "Dirección",
    value: CONTACT.address.full,
  },
  {
    Icon: Mail,
    label: "Correo electrónico",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    Icon: Phone,
    label: "Teléfono fijo",
    value: CONTACT.phones.landline.display,
    href: CONTACT.phones.landline.href,
  },
  {
    Icon: Phone,
    label: "Celular / WhatsApp",
    value: CONTACT.phones.primary.display,
    href: CONTACT.phones.primary.href,
  },
];

type FormStatus = "idle" | "loading" | "success" | "error";

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const result = await submitContact(form);

    if (result.error) {
      setStatus("error");
      setErrorMessage("Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.");
    } else {
      setStatus("success");
      setForm(INITIAL_FORM);
    }
  };

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="py-24 lg:py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-school-violet mb-4"
          >
            Contáctanos
          </motion.span>
          <motion.h2
            id="contact-heading"
            variants={fadeInUp}
            className="text-(length:--text-4xl) font-heading font-bold leading-[1.15] tracking-[-0.02em] text-foreground mb-4"
          >
            Estamos a tu disposición
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-(length:--text-lg) text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Consulta sobre matrícula, niveles y programas del establecimiento.
            Respondemos de lunes a viernes en horario de atención.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact info + map */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-2 space-y-6"
          >
            {CONTACT_INFO.map(({ Icon, label, value, href }) => (
              <motion.div
                key={label}
                variants={fadeInLeft}
                className="flex items-start gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl bg-school-violet/10 flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <Icon size={18} className="text-school-violet" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-sm text-foreground hover:text-school-violet transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Map embed */}
            <motion.div variants={fadeInLeft} className="pt-2">
              <GoogleMaps />
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="lg:col-span-3"
          >
            {status === "success" ? (
              <div
                role="alert"
                aria-live="polite"
                className="bg-school-violet/5 border border-school-violet/20 rounded-2xl p-8 text-center"
              >
                <p className="text-lg font-semibold text-foreground mb-2">
                  Mensaje enviado exitosamente
                </p>
                <p className="text-sm text-muted-foreground">
                  Nos pondremos en contacto contigo a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-school-violet hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
                aria-label="Formulario de contacto"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Nombre completo{" "}
                      <span aria-hidden="true" className="text-school-violet">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-school-violet/30 focus:border-school-violet transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Correo electrónico{" "}
                      <span aria-hidden="true" className="text-school-violet">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="su@correo.cl"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-school-violet/30 focus:border-school-violet transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Teléfono{" "}
                    <span className="text-muted-foreground font-normal">(opcional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+56 9 0000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-school-violet/30 focus:border-school-violet transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Mensaje{" "}
                    <span aria-hidden="true" className="text-school-violet">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-school-violet/30 focus:border-school-violet transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p role="alert" aria-live="assertive" className="text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-school-violet text-white font-semibold text-sm hover:bg-school-violet/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg min-h-[44px]"
                >
                  {status === "loading" ? (
                    <>
                      <span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar mensaje
                      <Send size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
