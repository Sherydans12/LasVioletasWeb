import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }
  return { session, error: null };
}
