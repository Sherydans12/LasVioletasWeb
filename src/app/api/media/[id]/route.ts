import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { id } = await context.params;

  try {
    const body = (await request.json()) as { destacado?: boolean };
    const media = await prisma.media.update({
      where: { id },
      data: { destacado: body.destacado },
    });
    return NextResponse.json(media);
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { id } = await context.params;

  try {
    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar" },
      { status: 500 }
    );
  }
}
