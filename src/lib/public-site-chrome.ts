import { HIDDEN_LOGIN_PATH } from "@/lib/auth-routes";

/**
 * Rutas que nunca deben mostrar TopHeader / Navbar públicos.
 * Incluye panel admin, login oculto y cualquier vista servida por `not-found`
 * (la supresión por contexto cubre 404 anidados, p. ej. `/noticias/id-inválido`).
 */
export function isPublicChromeExcludedPath(pathname: string | null): boolean {
  if (!pathname) return true;

  if (pathname === HIDDEN_LOGIN_PATH || pathname.startsWith(`${HIDDEN_LOGIN_PATH}/`)) {
    return true;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return true;
  }

  return false;
}
