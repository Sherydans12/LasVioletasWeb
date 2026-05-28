"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import type { Media } from "@prisma/client";
import { deleteMedia } from "@/app/admin/galeria/actions";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { MediaPreviewLightbox } from "@/components/admin/MediaPreviewLightbox";
import { cn } from "@/lib/utils";

function displayNameFromUrl(url: string): string {
  const segment = url.split("/").pop() ?? url;
  if (segment.length <= 28) return segment;
  return `${segment.slice(0, 12)}…${segment.slice(-10)}`;
}

export function GaleriaMediaGrid({ items }: { items: Media[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<Media | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Media | null>(null);
  const [, startTransition] = useTransition();

  async function handleConfirmDelete() {
    if (!confirmTarget) return;

    setPendingId(confirmTarget.id);
    setError(null);

    const result = await deleteMedia(confirmTarget.id);
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

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No hay recursos que coincidan con los filtros aplicados.
      </p>
    );
  }

  return (
    <div className="space-y-4">
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
        title="¿Eliminar este recurso?"
        description={
          confirmTarget
            ? `Se borrará "${displayNameFromUrl(confirmTarget.url)}" del disco y de la biblioteca de medios. Esta acción no se puede deshacer.`
            : ""
        }
        loading={pendingId !== null}
        onConfirm={handleConfirmDelete}
      />

      <MediaPreviewLightbox
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          const label = displayNameFromUrl(item.url);
          const fecha = new Date(item.fecha).toLocaleDateString("es-CL");
          const deleting = pendingId === item.id;

          return (
            <article
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setPreviewItem(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPreviewItem(item);
                }
              }}
              className={cn(
                "group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-school-violet/10 bg-school-neutral shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold",
                deleting && "pointer-events-none opacity-50"
              )}
            >
              {item.tipo === "video" ? (
                <video
                  src={item.url}
                  className="aspect-square h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="aspect-square h-full w-full object-cover"
                />
              )}

              {item.destacado && (
                <span className="absolute top-2 left-2 z-10 rounded-full bg-school-gold px-2 py-0.5 text-[10px] font-semibold uppercase text-school-violet">
                  Destacado
                </span>
              )}

              <div className="absolute bottom-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewItem(item);
                  }}
                  aria-label={`Ver ${label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
                >
                  <Eye className="h-4 w-4 text-school-violet" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmTarget(item);
                  }}
                  disabled={deleting}
                  aria-label={`Eliminar ${label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 shadow-sm disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
                >
                  <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                </button>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 pb-2 pt-8">
                <p className="truncate text-[11px] font-medium text-white/95">
                  {label}
                </p>
                <p className="text-[10px] text-white/75">{fecha}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
