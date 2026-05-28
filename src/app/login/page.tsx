"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md bg-background rounded-2xl border border-border/60 shadow-xl p-8 lg:p-10 space-y-6"
    >
      <div className="text-center">
        <div className="relative h-16 w-16 mx-auto mb-4">
          <Image
            src="/logo-institucional.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden
          />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Acceso administrativo
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Instituto Las Violetas — panel de gestión de contenidos
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Correo institucional
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-border px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-border px-4 py-3 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-school-violet text-white font-semibold text-sm hover:bg-school-violet/90 disabled:opacity-60 transition-colors"
      >
        {loading ? "Ingresando…" : "Ingresar al panel"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-school-violet transition-colors">
          ← Volver al sitio público
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-school-neutral px-6 py-16">
      <Suspense fallback={<div className="text-muted-foreground">Cargando…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
