import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import {
  contentTypeFromFilename,
  isUploadCategory,
  resolveStoredFilePath,
  safeUploadFilename,
} from "@/lib/upload-paths";

type RouteContext = { params: Promise<{ dir: string; file: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { dir, file } = await context.params;

  if (!isUploadCategory(dir)) {
    return NextResponse.json({ error: "Categoría no válida" }, { status: 404 });
  }

  let safeName: string;
  try {
    safeName = safeUploadFilename(file);
  } catch {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  try {
    const filePath = resolveStoredFilePath(dir, safeName);
    const buffer = await readFile(filePath);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentTypeFromFilename(safeName),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "No se pudo leer el archivo" },
      { status: 500 }
    );
  }
}
