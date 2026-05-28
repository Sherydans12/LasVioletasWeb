import { CONTACT } from "@/lib/contact";

const [lat, lng] = CONTACT.address.coords;

/**
 * Google Maps embed for Las Violetas 1159, Coquimbo.
 * A grayscale CSS filter + school-violet tint overlay gives the map
 * a monochromatic look that integrates with the institutional palette
 * without making it unreadable.
 */
export function GoogleMaps() {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=es`;

  return (
    <div className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-md">
      {/* Grayscale + slight contrast boost on the map */}
      <iframe
        src={src}
        title={`Mapa de ubicación del Instituto Las Violetas — ${CONTACT.address.full}`}
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full border-0"
        style={{ filter: "grayscale(100%) contrast(1.15) brightness(1.05)" }}
      />

      {/* School-violet tint overlay — pointer-events-none so map stays interactive */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-school-violet/12 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Address badge pinned to bottom-left */}
      <a
        href={CONTACT.address.mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir ${CONTACT.address.full} en Google Maps`}
        className="absolute bottom-3 left-3 z-10 bg-school-violet text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg hover:bg-school-violet/90 transition-colors flex items-center gap-1.5"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        {CONTACT.address.full}
      </a>
    </div>
  );
}
