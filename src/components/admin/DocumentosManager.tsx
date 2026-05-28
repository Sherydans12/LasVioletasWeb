"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Categoria = {
  id: string;
  nombre: string;
  orden: number;
  _count?: { documentos: number };
};

export function DocumentosManager() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadCategorias = useCallback(async () => {
    const res = await fetch("/api/documentos/categorias");
    if (res.ok) {
      const data = (await res.json()) as Categoria[];
      setCategorias(data);
      if (!categoriaId && data[0]) setCategoriaId(data[0].id);
    }
  }, [categoriaId]);

  useEffect(() => {
    void loadCategorias();
  }, [loadCategorias]);

  async function crearCategoria(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevaCategoria.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/documentos/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevaCategoria.trim() }),
      });
      if (!res.ok) throw new Error("No se pudo crear la carpeta");
      setNuevaCategoria("");
      await loadCategorias();
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function subirDocumento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!categoriaId) {
      setMessage("Selecciona o crea una categoría primero.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const data = new FormData(e.currentTarget);
    data.set("categoriaId", categoriaId);

    try {
      const res = await fetch("/api/documentos", { method: "POST", body: data });
      if (!res.ok) throw new Error("Error al subir archivo");
      e.currentTarget.reset();
      setMessage("Documento publicado.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <form
        onSubmit={crearCategoria}
        className="bg-background rounded-2xl border border-border/60 p-6 space-y-4"
      >
        <h2 className="font-heading font-semibold text-lg">Nueva carpeta</h2>
        <input
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
          placeholder="Nombre de la sección (ej. Reglamentos)"
          className="w-full rounded-lg border border-border px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-school-gold text-school-violet text-sm font-semibold"
        >
          Crear categoría
        </button>
        <ul className="text-sm space-y-2 pt-2 border-t border-border/50">
          {categorias.map((c) => (
            <li key={c.id} className="flex justify-between text-muted-foreground">
              <span>{c.nombre}</span>
              <span>{c._count?.documentos ?? 0} archivos</span>
            </li>
          ))}
        </ul>
      </form>

      <form
        onSubmit={subirDocumento}
        className="bg-background rounded-2xl border border-border/60 p-6 space-y-4"
      >
        <h2 className="font-heading font-semibold text-lg">Subir documento</h2>
        <div>
          <label htmlFor="categoriaId" className="block text-sm font-medium mb-2">
            Carpeta
          </label>
          <select
            id="categoriaId"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2 text-sm"
          >
            <option value="">Seleccionar…</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium mb-2">
            Nombre visible
          </label>
          <input
            id="nombre"
            name="nombre"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm"
            placeholder="Ej. Reglamento interno 2026"
          />
        </div>
        <div>
          <label htmlFor="archivo" className="block text-sm font-medium mb-2">
            Archivo (PDF, Word…)
          </label>
          <input
            id="archivo"
            name="archivo"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword"
            required
            className="w-full text-sm"
          />
        </div>
        {message && <p className="text-sm text-school-violet">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-school-violet text-white text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Subiendo…" : "Publicar documento"}
        </button>
      </form>
    </div>
  );
}
