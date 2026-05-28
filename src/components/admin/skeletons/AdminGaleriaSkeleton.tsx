import { Skeleton } from "@/components/ui/skeleton";

export function AdminGaleriaSkeleton() {
  return (
    <>
      <div className="bg-background rounded-2xl border border-border/60 p-6 space-y-4 max-w-xl">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-11 w-32 rounded-lg" />
      </div>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </>
  );
}
