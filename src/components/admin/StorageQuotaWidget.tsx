import { getStorageStats } from "@/lib/storage";
import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";

export async function StorageQuotaWidget() {
  const stats = await getStorageStats();
  const isCritical = stats.percentUsed >= 90;

  return (
    <aside
      className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
      aria-labelledby="storage-quota-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-school-violet/10 flex items-center justify-center">
          <HardDrive size={20} className="text-school-violet" aria-hidden />
        </div>
        <div>
          <h2
            id="storage-quota-heading"
            className="font-heading font-semibold text-base text-foreground"
          >
            Almacenamiento VPS
          </h2>
          <p className="text-xs text-muted-foreground">
            Plan contratado: {stats.limitGb.toFixed(0)} GB
          </p>
        </div>
      </div>

      <p
        className={`text-sm font-medium mb-3 ${isCritical ? "text-destructive" : "text-foreground"}`}
      >
        {stats.usedGb.toFixed(2)} GB utilizados de {stats.limitGb.toFixed(0)} GB
      </p>

      <Progress
        value={stats.percentUsed}
        indicatorClassName={
          isCritical ? "bg-destructive" : "bg-school-gold"
        }
      />

      <p className="text-xs text-muted-foreground mt-3">
        {isCritical
          ? "Espacio crítico: libera archivos o contacta soporte antes de nuevas subidas."
          : `${(100 - stats.percentUsed).toFixed(1)}% disponible para noticias, galería y documentos.`}
      </p>
    </aside>
  );
}
