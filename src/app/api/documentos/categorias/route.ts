import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeDocs = searchParams.get("include") === "documentos";

  try {
    const categorias = await prisma.categoriaDocumento.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: includeDocs
        ? { documentos: { orderBy: { fecha: "desc" } } }
        : { _count: { select: { documentos: true } } },
    });
    return NextResponse.json(categorias);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = (await request.json()) as { nombre?: string; orden?: number };
    const nombre = body.nombre?.trim();
    if (!nombre) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    const categoria = await prisma.categoriaDocumento.create({
      data: { nombre, orden: body.orden ?? 0 },
    });

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/documentos");
    revalidatePath("/documentos");

    return NextResponse.json(categoria, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear la categoría" },
      { status: 500 }
    );
  }
}
