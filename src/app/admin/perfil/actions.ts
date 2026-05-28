"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  isStrongPassword,
  PASSWORD_POLICY_MESSAGE,
} from "@/lib/password-policy";

type ActionResult = { ok: true } | { ok: false; error: string };

async function getSessionAdminId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function updateAdminEmailAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const adminId = await getSessionAdminId();
  if (!adminId) return { ok: false, error: "Sesión no válida." };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newEmail = String(formData.get("newEmail") ?? "").trim().toLowerCase();

  if (!currentPassword || !newEmail) {
    return { ok: false, error: "Completa todos los campos." };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return { ok: false, error: "Usuario no encontrado." };

    const passwordOk = await bcrypt.compare(
      currentPassword,
      admin.passwordHash
    );
    if (!passwordOk) {
      return { ok: false, error: "La contraseña actual no es correcta." };
    }

    const exists = await prisma.admin.findFirst({
      where: { email: newEmail, NOT: { id: adminId } },
    });
    if (exists) {
      return { ok: false, error: "Ese correo ya está registrado." };
    }

    await prisma.admin.update({
      where: { id: adminId },
      data: { email: newEmail },
    });

    revalidatePath("/admin/perfil");
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo actualizar el correo." };
  }
}

export async function updateAdminPasswordAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const adminId = await getSessionAdminId();
  if (!adminId) return { ok: false, error: "Sesión no válida." };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { ok: false, error: "Completa todos los campos." };
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, error: "Las contraseñas nuevas no coinciden." };
  }

  if (!isStrongPassword(newPassword)) {
    return { ok: false, error: PASSWORD_POLICY_MESSAGE };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return { ok: false, error: "Usuario no encontrado." };

    const passwordOk = await bcrypt.compare(
      currentPassword,
      admin.passwordHash
    );
    if (!passwordOk) {
      return { ok: false, error: "La contraseña actual no es correcta." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash },
    });

    revalidatePath("/admin/perfil");
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo actualizar la contraseña." };
  }
}
