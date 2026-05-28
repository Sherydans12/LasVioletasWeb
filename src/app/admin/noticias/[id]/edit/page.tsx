import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NoticiaForm } from "@/components/admin/NoticiaForm";
import { getNoticiaById } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditNoticiaPage({ params }: PageProps) {
  const { id } = await params;
  const noticia = await getNoticiaById(id);
  if (!noticia) notFound();

  return (
    <AdminShell title="Editar noticia">
      <Link
        href="/admin/noticias"
        className="text-sm text-school-violet hover:text-school-gold mb-6 inline-block"
      >
        ← Volver a noticias
      </Link>
      <NoticiaForm noticia={noticia} mode="edit" />
    </AdminShell>
  );
}
