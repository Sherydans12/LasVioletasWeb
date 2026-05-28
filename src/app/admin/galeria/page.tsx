import { AdminShell } from "@/components/admin/AdminShell";
import { GaleriaForm } from "@/components/admin/GaleriaForm";
import { GaleriaMediaGrid } from "@/components/admin/GaleriaMediaGrid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  let media: Awaited<ReturnType<typeof prisma.media.findMany>> = [];
  try {
    media = await prisma.media.findMany({
      orderBy: { fecha: "desc" },
    });
  } catch {
    media = [];
  }

  return (
    <AdminShell title="Galería multimedia">
      <section aria-label="Subir archivos">
        <GaleriaForm />
      </section>

      <div
        className="my-10 border-t border-school-violet/10"
        role="separator"
        aria-hidden
      />

      <section aria-labelledby="galeria-medios-heading" className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="galeria-medios-heading"
            className="text-xl font-semibold text-school-violet"
          >
            Galería de medios
          </h2>
          <p className="text-sm text-muted-foreground">
            {media.length === 1
              ? "1 recurso"
              : `${media.length} recursos`}
          </p>
        </div>

        <GaleriaMediaGrid items={media} />
      </section>
    </AdminShell>
  );
}
