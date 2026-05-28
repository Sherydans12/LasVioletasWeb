import { AdminShell } from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDocumentosLoading() {
  return (
    <AdminShell title="Documentos oficiales">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-background rounded-2xl border border-border/60 p-6 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="bg-background rounded-2xl border border-border/60 p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-40 rounded-lg" />
        </div>
      </div>
    </AdminShell>
  );
}
