import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { rateLimit, pruneRateLimitBuckets } from "@/lib/rate-limit";

/** Ruta antigua eliminada: no debe ser descubrible. */
const LEGACY_LOGIN_PATH = "/login";

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

  if (pathname === LEGACY_LOGIN_PATH || pathname.startsWith(`${LEGACY_LOGIN_PATH}/`)) {
    return NextResponse.redirect(new URL("/", req.url));
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
