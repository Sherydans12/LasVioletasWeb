import { AdminShell } from "@/components/admin/AdminShell";
import { AdminGaleriaSkeleton } from "@/components/admin/skeletons/AdminGaleriaSkeleton";

export default function AdminGaleriaLoading() {
  return (
    <AdminShell title="Galería multimedia">
      <AdminGaleriaSkeleton />
    </AdminShell>
  );
}
