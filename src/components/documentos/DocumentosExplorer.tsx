"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { NAV_ICONS } from "@/lib/nav-icons";
import { formatFileSize } from "@/lib/file-utils";
import type { CategoriaDocumento, Documento } from "@prisma/client";
import { cn } from "@/lib/utils";

type CategoriaWithDocs = CategoriaDocumento & {
  documentos: Documento[];
};

function formatLabel(mimeType: string | null, url: string) {
  if (mimeType?.includes("pdf")) return "PDF";
  if (mimeType?.includes("spreadsheet")) return "XLSX";
  if (mimeType?.includes("word") || url.endsWith(".docx")) return "DOCX";
  const ext = url.split(".").pop()?.toUpperCase();
  return ext ?? "Archivo";
}

export function DocumentosExplorer({
  categorias,
}: {
  categorias: CategoriaWithDocs[];
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    if (categorias.length === 1) return new Set([categorias[0].id]);
    return new Set();
  });

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {categorias.map((cat) => {
        const isOpen = openIds.has(cat.id);

        return (
          <section
            key={cat.id}
            className="rounded-2xl border border-border/60 bg-background overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(cat.id)}
              aria-expanded={isOpen}
              aria-controls={`panel-${cat.id}`}
              className="flex w-full items-center gap-3 px-6 py-4 bg-school-violet/5 border-b border-border/50 text-left hover:bg-school-violet/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
            >
              <div className="w-10 h-10 rounded-lg bg-school-violet/10 flex items-center justify-center shrink-0">
                <NAV_ICONS.documentos className="text-school-violet" size={20} />
              </div>
              <h2 className="font-heading font-semibold text-lg text-foreground flex-1">
                {cat.nombre}
              </h2>
              <span className="text-xs text-muted-foreground tabular-nums">
                {cat.documentos.length}{" "}
                {cat.documentos.length === 1 ? "archivo" : "archivos"}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-school-violet transition-transform shrink-0",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>

            <div
              id={`panel-${cat.id}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <ul className="divide-y divide-border/40 overflow-hidden min-h-0">
                {cat.documentos.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex flex-wrap items-center gap-4 px-6 py-4 hover:bg-school-neutral/60 transition-colors"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-medium text-foreground">{doc.nombre}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatLabel(doc.mimeType, doc.archivoUrl)} ·{" "}
                        {formatFileSize(doc.tamanoBytes)} ·{" "}
                        {new Date(doc.fecha).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    <a
                      href={doc.archivoUrl}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-school-gold text-school-violet text-sm font-semibold hover:bg-school-gold-light transition-colors"
                    >
                      <Download size={16} aria-hidden />
                      Descargar
                    </a>
                  </li>
                ))}
                {cat.documentos.length === 0 && (
                  <li className="px-6 py-6 text-sm text-muted-foreground text-center">
                    Sin archivos en esta carpeta.
                  </li>
                )}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
