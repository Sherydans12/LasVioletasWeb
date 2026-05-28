/**
 * Centralized contact & institutional data for Instituto Las Violetas.
 * Update this file to propagate changes across Navbar, Footer,
 * Contact section, OrganizationSchema, GoogleMaps, and TopHeader.
 */

export const CONTACT = {
  address: {
    street: "Las Violetas 1159",
    city: "Coquimbo",
    region: "Región de Coquimbo",
    country: "Chile",
    full: "Las Violetas 1159, Coquimbo, Región de Coquimbo",
    /** Google Maps embed coordinates [lat, lng] — JSON-LD y iframe embebido */
    coords: [-29.9859, -71.3379] as [number, number],
    /** Enlace oficial «Abrir en Google Maps» (topbar, badge del mapa en Contacto) */
    mapsLink: "https://maps.app.goo.gl/TtRGrZLeCBKny1Cw9",
  },
  email: "contacto@colegiolasvioletas.cl",
  phones: {
    /** Primary WhatsApp / mobile */
    primary: {
      display: "+56 9 6394 5549",
      href: "tel:+56963945549",
      wa: "https://wa.me/56963945549?text=Hola%2C%20me%20interesa%20obtener%20información%20sobre%20la%20matrícula%202026.",
    },
    /** Secondary mobile */
    secondary: {
      display: "+56 9 5859 1463",
      href: "tel:+56958591463",
    },
    /** Fixed landline (area code 51 = Coquimbo) */
    landline: {
      display: "(51) 2 266090",
      href: "tel:+56512266090",
    },
  },
  social: {
    instagram: "https://www.instagram.com/colegiolasvioletas/",
    facebook:
      "https://www.facebook.com/ColegioLasVioletas/?locale=es_LA",
  },
} as const;
