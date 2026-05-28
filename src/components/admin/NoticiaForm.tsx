"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NoticiaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/noticias", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Error al publicar");
      }
      form.reset();
      setMessage("Noticia publicada. Las imágenes se sincronizaron con la galería.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-background rounded-2xl border border-border/60 p-6 lg:p-8 space-y-6 max-w-2xl"
    >
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium mb-2">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-school-gold/50"
          placeholder="Ej. Jornada de matrícula abierta"
        />
      </div>

      <div>
        <label htmlFor="fecha" className="block text-sm font-medium mb-2">
          Fecha
        </label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          className="w-full rounded-lg border border-border px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="contenido" className="block text-sm font-medium mb-2">
          Contenido
        </label>
        <textarea
          id="contenido"
          name="contenido"
          required
          rows={8}
          className="w-full rounded-lg border border-border px-4 py-3 text-sm leading-relaxed resize-y min-h-[160px] focus:outline-none focus:ring-2 focus:ring-school-gold/50"
          placeholder="Escribe el detalle de la actividad o noticia..."
        />
      </div>

      <div>
        <label htmlFor="portada" className="block text-sm font-medium mb-2">
          Imagen de portada
        </label>
        <input
          id="portada"
          name="portada"
          type="file"
          accept="image/*"
          className="w-full text-sm"
        />
      </div>

      <div>
        <label htmlFor="imagenes" className="block text-sm font-medium mb-2">
          Imágenes adicionales (galería automática)
        </label>
        <input
          id="imagenes"
          name="imagenes"
          type="file"
          accept="image/*,video/*"
          multiple
          className="w-full text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Los archivos adjuntos se copian también a la galería general con origen
          &quot;noticia&quot;.
        </p>
      </div>

      {message && (
        <p
          className={`text-sm ${message.includes("Error") || message.includes("error") ? "text-destructive" : "text-school-violet"}`}
          role="status"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-school-violet text-white text-sm font-semibold hover:bg-school-violet/90 disabled:opacity-60 transition-colors"
      >
        {loading ? "Publicando…" : "Publicar noticia"}
      </button>
    </form>
  );
}
