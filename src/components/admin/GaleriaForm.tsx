"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GaleriaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/media", { method: "POST", body: data });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Error al subir");
      }
      e.currentTarget.reset();
      setMessage("Archivo agregado a la galería.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-background rounded-2xl border border-border/60 p-6 space-y-4 max-w-xl"
    >
      <div>
        <label htmlFor="archivo" className="block text-sm font-medium mb-2">
          Foto o video
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept="image/*,video/*"
          required
          className="w-full text-sm"
        />
      </div>
      <div>
        <label htmlFor="tipo" className="block text-sm font-medium mb-2">
          Tipo (opcional)
        </label>
        <select
          id="tipo"
          name="tipo"
          className="w-full rounded-lg border border-border px-4 py-2 text-sm"
          defaultValue=""
        >
          <option value="">Detectar automáticamente</option>
          <option value="image">Foto</option>
          <option value="video">Video</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input name="destacado" type="checkbox" value="true" />
        Mostrar en carrusel de inicio (destacado)
      </label>
      {message && <p className="text-sm text-school-violet">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-school-violet text-white text-sm font-semibold disabled:opacity-60"
      >
        {loading ? "Subiendo…" : "Subir a galería"}
      </button>
    </form>
  );
}
