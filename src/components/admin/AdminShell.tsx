import { signOut } from "@/auth";
import type { ReactNode } from "react";
import { StorageQuotaWidget } from "@/components/admin/StorageQuotaWidget";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-school-neutral flex">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-border/80 bg-background">
        <div className="px-5 py-6 border-b border-border/60">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-school-violet/80 mb-1">
            Instituto Las Violetas
          </p>
          <p className="font-heading text-lg font-bold text-foreground leading-tight text-balance">
            Administración
          </p>
        </div>
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <AdminSidebarNav />
        </div>
        <div className="px-4 pb-6">
          <StorageQuotaWidget />
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-school-violet text-white border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70 lg:hidden">
                Panel de administración
              </p>
              <h1 className="font-heading text-xl font-bold text-balance">{title}</h1>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-sm px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
          <div className="lg:hidden max-w-6xl mx-auto px-4 pb-4 overflow-x-auto">
            <AdminSidebarNav orientation="horizontal" />
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
          <div className="lg:hidden mb-8">
            <StorageQuotaWidget />
          </div>
          <div className="min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
