"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { adminFieldClass, adminInputBase } from "@/lib/admin-form-styles";
import { cn } from "@/lib/utils";

export function NoticiaForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = formRef.current;
    if (!form) return;

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
      if (formRef.current) {
        formRef.current.reset();
      }
      setFileKey((k) => k + 1);
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
      ref={formRef}
      onSubmit={onSubmit}
      className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6 lg:p-8 space-y-6 max-w-2xl"
    >
      <AdminFormField
        label="Título"
        name="titulo"
        required
        validate={(v) => v.trim().length >= 3}
        inputProps={{
          placeholder: "Ej. Jornada de matrícula abierta",
        }}
      />

      <AdminFormField
        label="Fecha"
        name="fecha"
        as="input"
        inputProps={{ type: "date" }}
      />

      <AdminFormField
        label="Contenido"
        name="contenido"
        as="textarea"
        required
        validate={(v) => v.trim().length >= 10}
        inputProps={{
          rows: 8,
          placeholder: "Escribe el detalle de la actividad o noticia...",
        }}
      />

      <div className="space-y-2">
        <label htmlFor="portada" className="block text-sm font-medium">
          Imagen de portada
        </label>
        <input
          key={`portada-${fileKey}`}
          id="portada"
          name="portada"
          type="file"
          accept="image/*"
          className={cn(adminFieldClass("idle", adminInputBase), "py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-school-violet/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-school-violet")}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="imagenes" className="block text-sm font-medium">
          Imágenes adicionales (galería automática)
        </label>
        <input
          key={`imagenes-${fileKey}`}
          id="imagenes"
          name="imagenes"
          type="file"
          accept="image/*,video/*"
          multiple
          className={cn(adminFieldClass("idle", adminInputBase), "py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-school-violet/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-school-violet")}
        />
        <p className="text-xs text-muted-foreground text-pretty">
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
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-school-violet text-white text-sm font-semibold hover:bg-school-violet/90 disabled:opacity-60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
      >
        {loading ? "Publicando…" : "Publicar noticia"}
      </button>
    </form>
  );
}
