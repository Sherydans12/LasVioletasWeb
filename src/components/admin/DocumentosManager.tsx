"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CategoriaDocumento, Documento } from "@prisma/client";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { DocumentosFolderTree } from "@/components/admin/DocumentosFolderTree";
import { useAdminPageRefresh } from "@/hooks/useAdminPageRefresh";
import {
  adminFieldClass,
  adminInputBase,
  adminSelectBase,
} from "@/lib/admin-form-styles";
import { cn } from "@/lib/utils";

type CategoriaWithDocs = CategoriaDocumento & {
  documentos: Documento[];
  _count?: { documentos: number };
};

type DocumentosManagerProps = {
  initialCategorias?: CategoriaWithDocs[];
};

export function DocumentosManager({
  initialCategorias = [],
}: DocumentosManagerProps) {
  const { refreshAdminPage } = useAdminPageRefresh();
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const [categorias, setCategorias] = useState<CategoriaWithDocs[]>(initialCategorias);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaTouched, setCategoriaTouched] = useState(false);
  const [categoriaId, setCategoriaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadCategorias = useCallback(async () => {
    const res = await fetch("/api/documentos/categorias?include=documentos");
    if (res.ok) {
      const data = (await res.json()) as CategoriaWithDocs[];
      setCategorias(data);
      if (!categoriaId && data[0]) setCategoriaId(data[0].id);
    }
  }, [categoriaId]);

  useEffect(() => {
    setCategorias(initialCategorias);
  }, [initialCategorias]);

  useEffect(() => {
    if (initialCategorias.length === 0) {
      void loadCategorias();
    } else if (!categoriaId && initialCategorias[0]) {
      setCategoriaId(initialCategorias[0].id);
    }
  }, [initialCategorias, categoriaId, loadCategorias]);

  const categoriaNombreValid = nuevaCategoria.trim().length >= 2;
  const categoriaFieldState = !categoriaTouched
    ? "idle"
    : categoriaNombreValid
      ? "valid"
      : "invalid";

  function clearUploadForm() {
    setSelectedFile(null);
    setFileKey((k) => k + 1);
    if (uploadFormRef.current) {
      uploadFormRef.current.reset();
    }
  }

  async function crearCategoria(e: React.FormEvent) {
    e.preventDefault();
    setCategoriaTouched(true);
    if (!categoriaNombreValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/documentos/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevaCategoria.trim() }),
      });
      if (!res.ok) throw new Error("No se pudo crear la carpeta");
      setNuevaCategoria("");
      setCategoriaTouched(false);
      await refreshAdminPage(loadCategorias);
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

    const form = uploadFormRef.current;
    if (!form) return;

    const data = new FormData(form);
    data.set("categoriaId", categoriaId);

    try {
      const res = await fetch("/api/documentos", { method: "POST", body: data });
      if (!res.ok) throw new Error("Error al subir archivo");
      clearUploadForm();
      setMessage("Documento publicado.");
      await refreshAdminPage(loadCategorias);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-2 gap-8">
        <form
          onSubmit={crearCategoria}
          className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6 space-y-4"
        >
          <h2 className="font-heading font-semibold text-lg text-balance">Nueva carpeta</h2>
          <div className="space-y-2">
            <label htmlFor="nueva-categoria" className="block text-sm font-medium">
              Nombre de la sección
            </label>
            <input
              id="nueva-categoria"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              onBlur={() => setCategoriaTouched(true)}
              placeholder="Ej. Matrículas 2026"
              className={adminFieldClass(categoriaFieldState, adminInputBase)}
              aria-invalid={categoriaTouched && !categoriaNombreValid}
            />
            {categoriaTouched && !categoriaNombreValid && (
              <p className="text-xs text-destructive/90" role="alert">
                El nombre debe tener al menos 2 caracteres.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-school-gold text-school-violet text-sm font-semibold hover:bg-school-gold-light disabled:opacity-60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
          >
            Crear categoría
          </button>
        </form>

        <form
          ref={uploadFormRef}
          onSubmit={subirDocumento}
          className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6 space-y-4"
        >
          <h2 className="font-heading font-semibold text-lg text-balance">Subir documento</h2>

          <div className="space-y-2">
            <label htmlFor="categoriaId" className="block text-sm font-medium">
              Carpeta <span className="text-school-gold">*</span>
            </label>
            <select
              id="categoriaId"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={adminFieldClass(
                categoriaId ? "valid" : "idle",
                adminSelectBase
              )}
            >
              <option value="">Seleccionar…</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <AdminFormField
            label="Nombre visible"
            name="nombre"
            validate={(v) => v.trim().length === 0 || v.trim().length >= 2}
            inputProps={{ placeholder: "Ej. Reglamento interno 2026" }}
          />

          <div className="space-y-2">
            <label htmlFor="doc-archivo" className="block text-sm font-medium">
              Archivo <span className="text-school-gold">*</span>
            </label>
            <input
              key={fileKey}
              id="doc-archivo"
              name="archivo"
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,application/pdf"
              required
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className={cn(
                adminFieldClass("idle", adminInputBase),
                "py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-school-violet/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-school-violet"
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formatos admitidos: PDF, DOCX, XLSX. Máx. 20MB.
            </p>
            {selectedFile && (
              <p className="text-xs text-muted-foreground truncate">
                Seleccionado: {selectedFile.name}
              </p>
            )}
          </div>

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
            {loading ? "Subiendo…" : "Publicar documento"}
          </button>
        </form>
      </div>

      <section
        aria-labelledby="documentos-tree-heading"
        className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6"
      >
        <h2
          id="documentos-tree-heading"
          className="font-heading font-semibold text-lg mb-4"
        >
          Carpetas y archivos
        </h2>
        <DocumentosFolderTree
          categorias={categorias}
          onMutated={loadCategorias}
        />
      </section>
    </div>
  );
}
