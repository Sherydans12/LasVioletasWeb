"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Refresca el contenido server-rendered del panel admin (listas, cuota, layout).
 * Ejecutar tras crear o eliminar recursos.
 */
export function useAdminPageRefresh() {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const refreshAdminPage = useCallback(
    async (localUpdate?: () => void | Promise<void>) => {
      await localUpdate?.();
      startTransition(() => {
        router.refresh();
      });
    },
    [router]
  );

  return { refreshAdminPage, isRefreshing };
}
