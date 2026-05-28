import { FileText, Download } from "lucide-react";
import { formatFileSize } from "@/lib/uploads";
import type { CategoriaDocumento, Documento } from "@prisma/client";

type CategoriaWithDocs = CategoriaDocumento & {
  documentos: Documento[];
};

function formatLabel(mimeType: string | null, url: string) {
  if (mimeType?.includes("pdf")) return "PDF";
  if (mimeType?.includes("word") || url.endsWith(".docx")) return "Word";
  const ext = url.split(".").pop()?.toUpperCase();
  return ext ?? "Archivo";
}

export function DocumentosExplorer({
  categorias,
}: {
  categorias: CategoriaWithDocs[];
}) {
  if (categorias.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16">
        Los documentos oficiales se publicarán pronto desde el panel de
        administración.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {categorias.map((cat) => (
        <section
          key={cat.id}
          aria-labelledby={`cat-${cat.id}`}
          className="rounded-2xl border border-border/60 bg-background overflow-hidden shadow-sm"
        >
          <header className="flex items-center gap-3 px-6 py-4 bg-school-violet/5 border-b border-border/50">
            <div className="w-10 h-10 rounded-lg bg-school-violet/10 flex items-center justify-center">
              <FileText className="text-school-violet" size={20} />
            </div>
            <h2
              id={`cat-${cat.id}`}
              className="font-heading font-semibold text-lg text-foreground"
            >
              {cat.nombre}
            </h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {cat.documentos.length}{" "}
              {cat.documentos.length === 1 ? "archivo" : "archivos"}
            </span>
          </header>

          <ul className="divide-y divide-border/40">
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
          </ul>
        </section>
      ))}
    </div>
  );
}
