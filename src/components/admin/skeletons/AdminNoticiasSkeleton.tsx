import { Skeleton } from "@/components/ui/skeleton";

export function AdminNoticiasSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
      <div className="bg-background rounded-2xl border border-border/60 p-6 lg:p-8 space-y-6 max-w-2xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-11 w-36 rounded-lg" />
      </div>
      <aside className="bg-background rounded-2xl border border-border/60 p-6 space-y-4">
        <Skeleton className="h-5 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 pb-3 border-b border-border/40 last:border-0">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </aside>
    </div>
  );
}
