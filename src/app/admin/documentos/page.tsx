import { AdminShell } from "@/components/admin/AdminShell";
import { DocumentosManager } from "@/components/admin/DocumentosManager";
import { getDocumentCategoriesForAdmin } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDocumentosPage() {
  const categorias = await getDocumentCategoriesForAdmin();

  return (
    <AdminShell title="Documentos oficiales">
      <DocumentosManager initialCategorias={categorias} />
    </AdminShell>
  );
}
