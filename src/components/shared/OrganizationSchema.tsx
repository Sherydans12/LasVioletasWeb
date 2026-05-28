import { CONTACT } from "@/lib/contact";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://colegiolasvioletas.cl";

const schema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Instituto Las Violetas",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-institucional.png`,
  description:
    "Establecimiento educacional para adultos en Coquimbo, Chile. Nivelación y validación de estudios básicos y medios. Matrícula 2026 disponible.",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: CONTACT.phones.primary.display,
      contactType: "admissions",
      areaServed: "CL",
      availableLanguage: "Spanish",
    },
    {
      "@type": "ContactPoint",
      email: CONTACT.email,
      contactType: "customer service",
      areaServed: "CL",
      availableLanguage: "Spanish",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.city,
    addressRegion: CONTACT.address.region,
    addressCountry: "CL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CONTACT.address.coords[0],
    longitude: CONTACT.address.coords[1],
  },
  sameAs: [CONTACT.social.instagram, CONTACT.social.facebook],
};

export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
