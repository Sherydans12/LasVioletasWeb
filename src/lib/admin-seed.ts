import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

let seedPromise: Promise<void> | null = null;

/** Crea el primer administrador desde variables de entorno si la tabla está vacía. */
export async function ensureInitialAdmin(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed();
  }
  await seedPromise;
}

async function runSeed() {
  try {
    const count = await prisma.admin.count();
    if (count > 0) return;

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn(
        "[admin-seed] ADMIN_EMAIL y ADMIN_PASSWORD son requeridos para crear el usuario inicial."
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: { email, passwordHash },
    });

    console.info("[admin-seed] Administrador inicial creado en base de datos.");
  } catch (err) {
    console.error("[admin-seed] Error al inicializar administrador:", err);
    seedPromise = null;
  }
}
