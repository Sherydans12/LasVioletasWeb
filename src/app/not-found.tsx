import type { Metadata } from "next";
import { NotFoundView } from "@/components/errors/NotFoundView";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description:
    "El recurso solicitado no está disponible en el sitio del Instituto Las Violetas.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function NotFound() {
  return <NotFoundView />;
}
