import { AdminShell } from "@/components/admin/AdminShell";
import { DocumentosManager } from "@/components/admin/DocumentosManager";
import { getDocumentCategoriesForAdmin } from "@/lib/content";
import { getStorageStats } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function AdminDocumentosPage() {
  const [categorias, storage] = await Promise.all([
    getDocumentCategoriesForAdmin(),
    getStorageStats(),
  ]);

  return (
    <AdminShell title="Documentos oficiales">
      <DocumentosManager initialCategorias={categorias} storage={storage} />
    </AdminShell>
  );
}
