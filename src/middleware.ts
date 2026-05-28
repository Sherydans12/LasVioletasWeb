import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { rateLimit, pruneRateLimitBuckets } from "@/lib/rate-limit";

/** Rutas antiguas eliminadas: no deben ser descubribles. */
const LEGACY_LOGIN_PATHS = ["/login", "/gestion-violetas"] as const;

const UPLOAD_POST_PATHS = new Set([
  "/api/noticias",
  "/api/media",
  "/api/documentos",
]);

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimitResponse(retryAfterSec?: number) {
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
    {
      status: 429,
      headers: retryAfterSec
        ? { "Retry-After": String(retryAfterSec) }
        : undefined,
    }
  );
}

export default auth((req) => {
  if (Math.random() < 0.01) pruneRateLimitBuckets();

  const { pathname } = req.nextUrl;

  for (const legacy of LEGACY_LOGIN_PATHS) {
    if (pathname === legacy || pathname.startsWith(`${legacy}/`)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const ip = clientIp(req);

  if (pathname.startsWith("/api/auth")) {
    const result = rateLimit(`auth:${ip}`, 20, 60_000);
    if (!result.ok) return rateLimitResponse(result.retryAfterSec);
  }

  if (req.method === "POST" && UPLOAD_POST_PATHS.has(pathname)) {
    const result = rateLimit(`upload:${ip}`, 30, 60_000);
    if (!result.ok) return rateLimitResponse(result.retryAfterSec);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/noticias",
    "/api/media",
    "/api/documentos",
  ],
};
