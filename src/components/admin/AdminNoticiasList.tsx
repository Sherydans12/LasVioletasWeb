"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Noticia } from "@prisma/client";
import { deleteNoticia } from "@/app/admin/noticias/actions";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { PaginationNav } from "@/components/shared/PaginationNav";
import type { PaginationMeta } from "@/lib/pagination";
type AdminNoticiasListProps = {
  noticias: Noticia[];
  meta: PaginationMeta;
};

export function AdminNoticiasList({ noticias, meta }: AdminNoticiasListProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Noticia | null>(null);
  const [, startTransition] = useTransition();

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setPendingId(confirmTarget.id);
    setError(null);

    const result = await deleteNoticia(confirmTarget.id);
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

  if (noticias.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay noticias publicadas.
      </p>
    );
  }

  return (
    <>
      {error && (
        <p className="text-sm text-destructive mb-4" role="alert">
          {error}
        </p>
      )}

      <ConfirmDeleteDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open && !pendingId) setConfirmTarget(null);
        }}
        title="¿Eliminar esta noticia?"
        description={
          confirmTarget
            ? `Se borrará "${confirmTarget.titulo}" junto con su portada y archivos en storage/noticias/. Esta acción no se puede deshacer.`
            : ""
        }
        loading={pendingId !== null}
        onConfirm={handleConfirmDelete}
      />

      <ul className="space-y-4 text-sm">
        {noticias.map((n) => {
          const deleting = pendingId === n.id;
          return (
            <li
              key={n.id}
              className={`border-b border-border/40 pb-3 last:border-0 ${deleting ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground line-clamp-2">
                    {n.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.fecha).toLocaleDateString("es-CL")}
                  </p>
                  <Link
                    href={`/admin/noticias/${n.id}/edit`}
                    className="text-xs text-school-violet hover:text-school-gold mt-2 inline-block font-medium"
                  >
                    Editar →
                  </Link>
                </div>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setConfirmTarget(n)}
                  aria-label={`Eliminar noticia ${n.titulo}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <PaginationNav basePath="/admin/noticias" meta={meta} className="mt-4" />
    </>
  );
}
