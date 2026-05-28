"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Folder, Trash2 } from "lucide-react";
import type { CategoriaDocumento, Documento } from "@prisma/client";
import { deleteDocumento } from "@/app/admin/documentos/actions";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { formatFileSize } from "@/lib/file-utils";
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
}: {
  categorias: CategoriaWithDocs[];
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Documento | null>(null);
  const [, startTransition] = useTransition();

  function toggleFolder(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;

    setPendingId(confirmTarget.id);
    setError(null);
    const result = await deleteDocumento(confirmTarget.id);
    if (!result.ok) {
      setError(result.error);
      setPendingId(null);
      return;
    }

    setConfirmTarget(null);
    startTransition(() => {
      router.refresh();
      setPendingId(null);
    });
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
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open && !pendingId) setConfirmTarget(null);
        }}
        title="¿Eliminar este documento?"
        description={
          confirmTarget
            ? `Se borrará "${confirmTarget.nombre}" del disco y de la carpeta. Esta acción no se puede deshacer.`
            : ""
        }
        loading={pendingId !== null}
        onConfirm={handleConfirmDelete}
      />

      <ul className="space-y-2">
        {categorias.map((cat) => {
          const count = cat.documentos.length;
          const isOpen = expanded.has(cat.id);
          const label =
            count === 1 ? "1 archivo" : `${count} archivos`;

          return (
            <li
              key={cat.id}
              className="rounded-xl border border-school-violet/10 bg-background overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFolder(cat.id)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-school-neutral/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-school-violet" aria-hidden />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-school-violet" aria-hidden />
                )}
                <Folder className="h-4 w-4 shrink-0 text-school-gold" aria-hidden />
                <span className="font-medium text-foreground flex-1">
                  {cat.nombre}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({label})
                </span>
              </button>

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
                          onClick={() => setConfirmTarget(doc)}
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
