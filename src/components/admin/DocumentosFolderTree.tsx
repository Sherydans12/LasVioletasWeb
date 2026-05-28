"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Pencil,
  Trash2,
} from "lucide-react";
import type { CategoriaDocumento, Documento } from "@prisma/client";
import { CategoriaEditDialog } from "@/components/admin/CategoriaEditDialog";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { DocumentoEditDialog } from "@/components/admin/DocumentoEditDialog";
import {
  deleteCategoria,
  deleteDocumento,
  renameCategoria,
  updateDocumento,
} from "@/app/admin/documentos/actions";
import { useAdminPageRefresh } from "@/hooks/useAdminPageRefresh";
import { formatFileSize } from "@/lib/file-utils";
import type { StorageQuotaInfo } from "@/lib/storage-quota";
import { cn } from "@/lib/utils";

type CategoriaWithDocs = CategoriaDocumento & {
  documentos: Documento[];
};

function fileExtension(url: string, mimeType: string | null): string {
  const fromUrl = url.split(".").pop()?.toLowerCase();
  if (fromUrl && fromUrl.length <= 5) return fromUrl.toUpperCase();
  if (mimeType?.includes("pdf")) return "PDF";
  if (mimeType?.includes("spreadsheet")) return "XLSX";
  if (mimeType?.includes("word")) return "DOCX";
  return "FILE";
}

export function DocumentosFolderTree({
  categorias,
  storage,
  onMutated,
}: {
  categorias: CategoriaWithDocs[];
  storage: StorageQuotaInfo;
  onMutated?: () => void | Promise<void>;
}) {
  const { refreshAdminPage } = useAdminPageRefresh();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [confirmDocTarget, setConfirmDocTarget] = useState<Documento | null>(null);
  const [confirmCatTarget, setConfirmCatTarget] = useState<CategoriaWithDocs | null>(
    null
  );
  const [editCatTarget, setEditCatTarget] = useState<CategoriaWithDocs | null>(null);
  const [editDocTarget, setEditDocTarget] = useState<Documento | null>(null);
  const [editCatError, setEditCatError] = useState<string | null>(null);
  const [editDocError, setEditDocError] = useState<string | null>(null);

  function toggleFolder(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleConfirmDeleteDocumento() {
    if (!confirmDocTarget) return;

    setPendingId(confirmDocTarget.id);
    setError(null);
    const result = await deleteDocumento(confirmDocTarget.id);
    if (!result.ok) {
      setError(result.error);
      setPendingId(null);
      return;
    }

    setConfirmDocTarget(null);
    await refreshAdminPage(onMutated);
    setPendingId(null);
  }

  async function handleConfirmDeleteCategoria() {
    if (!confirmCatTarget) return;

    setPendingId(confirmCatTarget.id);
    setError(null);
    const result = await deleteCategoria(confirmCatTarget.id);
    if (!result.ok) {
      setError(result.error);
      setPendingId(null);
      return;
    }

    setConfirmCatTarget(null);
    await refreshAdminPage(onMutated);
    setPendingId(null);
  }

  async function handleRenameCategoria(nombre: string) {
    if (!editCatTarget) return;

    setPendingId(editCatTarget.id);
    setEditCatError(null);
    const result = await renameCategoria(editCatTarget.id, nombre);
    if (!result.ok) {
      setEditCatError(result.error);
      setPendingId(null);
      return;
    }

    setEditCatTarget(null);
    await refreshAdminPage(onMutated);
    setPendingId(null);
  }

  async function handleUpdateDocumento(formData: FormData) {
    if (!editDocTarget) return;

    setPendingId(editDocTarget.id);
    setEditDocError(null);
    const result = await updateDocumento(editDocTarget.id, formData);
    if (!result.ok) {
      setEditDocError(result.error);
      setPendingId(null);
      return;
    }

    setEditDocTarget(null);
    await refreshAdminPage(onMutated);
    setPendingId(null);
  }

  if (categorias.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Crea una carpeta para comenzar a organizar documentos.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <ConfirmDeleteDialog
        open={confirmDocTarget !== null}
        onOpenChange={(open) => {
          if (!open && !pendingId) setConfirmDocTarget(null);
        }}
        title="¿Eliminar este documento?"
        description={
          confirmDocTarget
            ? `Se borrará "${confirmDocTarget.nombre}" del disco y de la carpeta. Esta acción no se puede deshacer.`
            : ""
        }
        loading={pendingId !== null && confirmDocTarget?.id === pendingId}
        onConfirm={handleConfirmDeleteDocumento}
      />

      <ConfirmDeleteDialog
        open={confirmCatTarget !== null}
        onOpenChange={(open) => {
          if (!open && !pendingId) setConfirmCatTarget(null);
        }}
        title="¿Eliminar esta carpeta?"
        description={
          confirmCatTarget
            ? confirmCatTarget.documentos.length > 0
              ? `Se borrará la carpeta "${confirmCatTarget.nombre}" junto con ${confirmCatTarget.documentos.length} archivo(s) en disco. Esta acción no se puede deshacer.`
              : `Se borrará la carpeta vacía "${confirmCatTarget.nombre}". Esta acción no se puede deshacer.`
            : ""
        }
        loading={pendingId !== null && confirmCatTarget?.id === pendingId}
        onConfirm={handleConfirmDeleteCategoria}
      />

      <CategoriaEditDialog
        open={editCatTarget !== null}
        nombre={editCatTarget?.nombre ?? ""}
        onOpenChange={(open) => {
          if (!open && !pendingId) {
            setEditCatTarget(null);
            setEditCatError(null);
          }
        }}
        onConfirm={handleRenameCategoria}
        loading={pendingId !== null && editCatTarget?.id === pendingId}
        error={editCatError}
      />

      <DocumentoEditDialog
        open={editDocTarget !== null}
        documento={editDocTarget}
        storage={storage}
        onOpenChange={(open) => {
          if (!open && !pendingId) {
            setEditDocTarget(null);
            setEditDocError(null);
          }
        }}
        onConfirm={handleUpdateDocumento}
        loading={pendingId !== null && editDocTarget?.id === pendingId}
        error={editDocError}
      />

      <ul className="space-y-2">
        {categorias.map((cat) => {
          const count = cat.documentos.length;
          const isOpen = expanded.has(cat.id);
          const label = count === 1 ? "1 archivo" : `${count} archivos`;
          const catBusy = pendingId === cat.id;

          return (
            <li
              key={cat.id}
              className={cn(
                "rounded-xl border border-school-violet/10 bg-background overflow-hidden",
                catBusy && "opacity-60"
              )}
            >
              <div className="flex items-center gap-1 pr-2">
                <button
                  type="button"
                  onClick={() => toggleFolder(cat.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3 text-left hover:bg-school-neutral/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
                  aria-expanded={isOpen}
                >
                  {isOpen ? (
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-school-violet"
                      aria-hidden
                    />
                  ) : (
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-school-violet"
                      aria-hidden
                    />
                  )}
                  <Folder className="h-4 w-4 shrink-0 text-school-gold" aria-hidden />
                  <span className="font-medium text-foreground flex-1 truncate">
                    {cat.nombre}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    ({label})
                  </span>
                </button>

                <button
                  type="button"
                  disabled={catBusy}
                  onClick={() => {
                    setEditCatError(null);
                    setEditCatTarget(cat);
                  }}
                  aria-label={`Renombrar carpeta ${cat.nombre}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-school-violet/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold disabled:opacity-40"
                >
                  <Pencil className="h-4 w-4 text-school-violet" aria-hidden />
                </button>
                <button
                  type="button"
                  disabled={catBusy}
                  onClick={() => setConfirmCatTarget(cat)}
                  aria-label={`Eliminar carpeta ${cat.nombre}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                </button>
              </div>

              {isOpen && count > 0 && (
                <ul className="border-t border-border/40 pl-6 pr-2 py-2 space-y-1">
                  {cat.documentos.map((doc) => {
                    const ext = fileExtension(doc.archivoUrl, doc.mimeType);
                    const deleting = pendingId === doc.id;

                    return (
                      <li
                        key={doc.id}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-2 text-sm",
                          deleting && "opacity-50"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">
                            {doc.nombre}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            .{ext.toLowerCase()} · {formatFileSize(doc.tamanoBytes)}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => {
                            setEditDocError(null);
                            setEditDocTarget(doc);
                          }}
                          aria-label={`Editar ${doc.nombre}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-school-violet/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold disabled:opacity-40"
                        >
                          <Pencil className="h-4 w-4 text-school-violet" aria-hidden />
                        </button>
                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => setConfirmDocTarget(doc)}
                          aria-label={`Eliminar ${doc.nombre}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {isOpen && count === 0 && (
                <p className="pl-6 pr-4 pb-3 text-xs text-muted-foreground">
                  Carpeta vacía.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
