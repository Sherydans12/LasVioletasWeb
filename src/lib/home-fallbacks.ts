/** Vista previa institucional cuando aún no hay noticias en la base de datos. */
export const PLACEHOLDER_ACTIVITIES = [
  {
    id: "preview-matricula",
    titulo: "Matrícula 2026 abierta",
    contenido:
      "Te invitamos a formar parte de nuestra comunidad educativa. Conoce los niveles disponibles y los horarios flexibles pensados para ti.",
    fecha: new Date(),
    portadaUrl: "/matricula-cta.webp",
  },
  {
    id: "preview-comunidad",
    titulo: "Comunidad educativa activa",
    contenido:
      "Pronto publicaremos registros de nuestras actividades, encuentros y proyectos que fortalecen el aprendizaje en Coquimbo.",
    fecha: new Date(),
    portadaUrl: "/nosotros-historia.webp",
  },
  {
    id: "preview-formacion",
    titulo: "Formación para tu desarrollo",
    contenido:
      "Seguimos trabajando en un espacio digital para compartir novedades, logros y momentos destacados de nuestros estudiantes.",
    fecha: new Date(),
    portadaUrl: "/nosotros-valores.webp",
  },
] as const;

/** Carrusel de demostración con imágenes locales del establecimiento. */
export const PLACEHOLDER_GALLERY = [
  { id: "preview-g1", url: "/hero-principal.webp", tipo: "image" as const },
  { id: "preview-g2", url: "/infraestructura-aula.webp", tipo: "image" as const },
  { id: "preview-g3", url: "/infraestructura-patio.webp", tipo: "image" as const },
];
