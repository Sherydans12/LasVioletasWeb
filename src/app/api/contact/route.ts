import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rate-limit";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  turnstileToken?: string;
};

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limited = rateLimit(`contact:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Demasiados envíos. Espera un momento." },
      { status: 429 }
    );
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstileToken(body.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Verificación de seguridad fallida" },
      { status: 403 }
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nombre, correo y mensaje son obligatorios" },
      { status: 400 }
    );
  }

  // Punto de extensión: enviar a CRM, correo o base de datos.
  return NextResponse.json(
    {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
