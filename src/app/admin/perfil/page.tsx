import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminProfileForm } from "@/components/admin/AdminProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminPerfilPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin");
  }

  return (
    <AdminShell title="Mi perfil">
      <AdminProfileForm currentEmail={session.user.email} />
    </AdminShell>
  );
}
