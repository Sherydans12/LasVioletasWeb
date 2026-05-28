import { formatStorageUsedDisplay, getStorageStats } from "@/lib/storage";
import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";

export async function StorageQuotaWidget() {
  const stats = await getStorageStats();
  const usedDisplay = formatStorageUsedDisplay(stats);
  const isCritical = stats.percentUsed >= 90;
  const availablePercent = (100 - stats.percentUsed).toFixed(1);

  return (
    <aside
      className="rounded-2xl border border-school-violet/10 bg-school-neutral/80 p-5 shadow-sm"
      aria-labelledby="storage-quota-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-school-violet/10 flex items-center justify-center shrink-0">
          <HardDrive size={20} className="text-school-violet" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2
            id="storage-quota-heading"
            className="font-heading font-semibold text-sm text-foreground leading-tight"
          >
            Almacenamiento VPS
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Plan {stats.limitGb.toFixed(0)} GB contratado
          </p>
        </div>
      </div>

      <div className="mb-3">
        <p
          className={`text-lg font-heading font-bold tabular-nums tracking-tight ${
            isCritical ? "text-destructive" : "text-foreground"
          }`}
        >
          {usedDisplay.amount}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            {usedDisplay.unit} / {stats.limitGb.toFixed(0)} GB
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">espacio utilizado</p>
      </div>

      <Progress
        value={stats.percentUsed}
        className="h-2"
        indicatorClassName={
          isCritical ? "bg-destructive" : "bg-school-gold"
        }
      />

      <p
        className={`text-xs mt-3 leading-relaxed text-pretty ${
          isCritical ? "text-destructive/90 font-medium" : "text-muted-foreground"
        }`}
      >
        {isCritical
          ? "Espacio crítico: libera archivos o contacta soporte antes de nuevas subidas."
          : `${availablePercent}% disponible para noticias, galería y documentos.`}
      </p>
    </aside>
  );
}
