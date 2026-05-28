"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Noticia } from "@prisma/client";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { useAdminPageRefresh } from "@/hooks/useAdminPageRefresh";
import { adminFieldClass, adminInputBase } from "@/lib/admin-form-styles";
import { toDateInputValue } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

type NoticiaFormProps = {
  noticia?: Noticia;
  mode?: "create" | "edit";
};

export function NoticiaForm({ noticia, mode = "create" }: NoticiaFormProps) {
  const router = useRouter();
  const { refreshAdminPage } = useAdminPageRefresh();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const isEdit = mode === "edit" && noticia;

  const defaultFecha = noticia
    ? toDateInputValue(noticia.fecha)
    : toDateInputValue(new Date());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const url = isEdit ? `/api/noticias/${noticia.id}` : "/api/noticias";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, { method, body: data });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Error al guardar");
      }

      if (!isEdit) {
        if (formRef.current) {
          formRef.current.reset();
        }
        setFileKey((k) => k + 1);
      }

      setMessage(
        isEdit
          ? "Noticia actualizada correctamente."
          : "Noticia publicada. Las imágenes se sincronizaron con la galería."
      );

      if (isEdit) {
        await refreshAdminPage();
        router.push("/admin/noticias");
      } else {
        await refreshAdminPage();
      }
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
          defaultValue: noticia?.titulo ?? "",
        }}
      />

      <AdminFormField
        label="Fecha de publicación"
        name="fecha"
        as="input"
        required
        hint="Elige la fecha histórica o actual que debe mostrarse en el sitio."
        inputProps={{
          type: "date",
          required: true,
          defaultValue: defaultFecha,
        }}
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
          defaultValue: noticia?.contenido ?? "",
        }}
      />

      <div className="space-y-2">
        <label htmlFor="portada" className="block text-sm font-medium">
          Imagen de portada {isEdit && "(opcional, reemplaza la actual)"}
        </label>
        <input
          key={`portada-${fileKey}`}
          id="portada"
          name="portada"
          type="file"
          accept="image/*"
          className={cn(
            adminFieldClass("idle", adminInputBase),
            "py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-school-violet/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-school-violet"
          )}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Resolución recomendada: 1200×630px (relación ~19:9). Formatos: WEBP,
          PNG, JPG. Máx. 10MB.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="imagenes" className="block text-sm font-medium">
          Imágenes o videos adicionales
        </label>
        <input
          key={`imagenes-${fileKey}`}
          id="imagenes"
          name="imagenes"
          type="file"
          accept="image/*,video/*"
          multiple
          className={cn(
            adminFieldClass("idle", adminInputBase),
            "py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-school-violet/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-school-violet"
          )}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Fotos: 1200×630px recomendado. Videos: 1920×1080px (16:9), MP4, máx.
          50MB. Se sincronizan con la galería global.
        </p>
      </div>

      {isEdit && noticia?.portadaUrl && (
        <p className="text-xs text-muted-foreground">
          Portada actual registrada en el sistema.
        </p>
      )}

      {message && (
        <p
          className={`text-sm ${message.includes("Error") || message.includes("error") ? "text-destructive" : "text-school-violet"}`}
          role="status"
        >
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-school-violet text-white text-sm font-semibold hover:bg-school-violet/90 disabled:opacity-60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
        >
          {loading
            ? "Guardando…"
            : isEdit
              ? "Guardar cambios"
              : "Publicar noticia"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={() => router.push("/admin/noticias")}
            className="px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-school-neutral transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
