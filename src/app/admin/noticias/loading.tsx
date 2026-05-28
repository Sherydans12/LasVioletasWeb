import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNoticiasSkeleton } from "@/components/admin/skeletons/AdminNoticiasSkeleton";

export default function AdminNoticiasLoading() {
  return (
    <AdminShell title="Noticias y actividades">
      <AdminNoticiasSkeleton />
    </AdminShell>
  );
}
