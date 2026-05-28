/**
 * Ejecutar manualmente: npx tsx scripts/seed-admin.ts
 * Crea el admin inicial si la tabla está vacía (usa ADMIN_EMAIL / ADMIN_PASSWORD).
 */
import { ensureInitialAdmin } from "../src/lib/admin-seed";

ensureInitialAdmin()
  .then(() => {
    console.info("Seed de administrador finalizado.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
