import { AdminShell } from "@/components/admin/AdminShell";
import { GaleriaForm } from "@/components/admin/GaleriaForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  let media: Awaited<ReturnType<typeof prisma.media.findMany>> = [];
  try {
    media = await prisma.media.findMany({
      orderBy: { fecha: "desc" },
      take: 24,
    });
  } catch {
    media = [];
  }

  return (
    <AdminShell title="Galería multimedia">
      <GaleriaForm />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <figure
            key={item.id}
            className="relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-school-neutral"
          >
            {item.tipo === "video" ? (
              <video
                src={item.url}
                className="object-cover w-full h-full"
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt=""
                className="object-cover w-full h-full"
              />
            )}
            {item.destacado && (
              <span className="absolute top-2 left-2 text-[10px] uppercase font-semibold bg-school-gold text-school-violet px-2 py-0.5 rounded-full">
                Destacado
              </span>
            )}
          </figure>
        ))}
      </div>
    </AdminShell>
  );
}
