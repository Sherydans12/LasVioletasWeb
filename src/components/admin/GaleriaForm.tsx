"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { adminFieldClass, adminInputBase } from "@/lib/admin-form-styles";
import { cn } from "@/lib/utils";

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
      className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6 space-y-4 max-w-xl"
    >
      <div className="space-y-2">
        <label htmlFor="archivo" className="block text-sm font-medium">
          Foto o video <span className="text-school-gold">*</span>
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept="image/*,video/*"
          required
          className={cn(
            adminFieldClass("idle", adminInputBase),
            "py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-school-violet/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-school-violet"
          )}
        />
      </div>

      <AdminFormField label="Tipo (opcional)" name="tipo" as="select" inputProps={{ defaultValue: "" }}>
        <option value="">Detectar automáticamente</option>
        <option value="image">Foto</option>
        <option value="video">Video</option>
      </AdminFormField>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          name="destacado"
          type="checkbox"
          value="true"
          className="rounded border-border text-school-violet focus:ring-school-gold/40"
        />
        Mostrar en carrusel de inicio (destacado)
      </label>

      {message && (
        <p
          className={`text-sm ${message.includes("Error") ? "text-destructive" : "text-school-violet"}`}
          role="status"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-school-violet text-white text-sm font-semibold hover:bg-school-violet/90 disabled:opacity-60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
      >
        {loading ? "Subiendo…" : "Subir a galería"}
      </button>
    </form>
  );
}
