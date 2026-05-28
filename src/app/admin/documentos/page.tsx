import { AdminShell } from "@/components/admin/AdminShell";
import { DocumentosManager } from "@/components/admin/DocumentosManager";

export default function AdminDocumentosPage() {
  return (
    <AdminShell title="Documentos oficiales">
      <DocumentosManager />
    </AdminShell>
  );
}
