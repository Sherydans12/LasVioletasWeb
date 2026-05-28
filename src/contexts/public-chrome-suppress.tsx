"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { isPublicChromeExcludedPath } from "@/lib/public-site-chrome";

type PublicChromeSuppressContextValue = {
  suppressPublicChrome: boolean;
  setSuppressPublicChrome: (value: boolean) => void;
};

const PublicChromeSuppressContext =
  createContext<PublicChromeSuppressContextValue | null>(null);

export function PublicChromeSuppressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [suppressPublicChrome, setSuppressPublicChrome] = useState(false);

  const setSuppress = useCallback((value: boolean) => {
    setSuppressPublicChrome(value);
  }, []);

  const value = useMemo(
    () => ({
      suppressPublicChrome,
      setSuppressPublicChrome: setSuppress,
    }),
    [suppressPublicChrome, setSuppress]
  );

  return (
    <PublicChromeSuppressContext.Provider value={value}>
      {children}
    </PublicChromeSuppressContext.Provider>
  );
}

function usePublicChromeSuppressContext(): PublicChromeSuppressContextValue {
  const ctx = useContext(PublicChromeSuppressContext);
  if (!ctx) {
    throw new Error(
      "usePublicChromeSuppress must be used within PublicChromeSuppressProvider"
    );
  }
  return ctx;
}

/** `true` cuando TopHeader y Navbar públicos deben renderizarse. */
export function usePublicChromeVisible(): boolean {
  const pathname = usePathname();
  const { suppressPublicChrome } = usePublicChromeSuppressContext();

  if (isPublicChromeExcludedPath(pathname)) return false;
  if (suppressPublicChrome) return false;

  return true;
}

/** Oculta TopHeader/Navbar mientras el árbol de error (404) está montado. */
export function PublicChromeSuppressor({ children }: { children: ReactNode }) {
  const { setSuppressPublicChrome } = usePublicChromeSuppressContext();

  useLayoutEffect(() => {
    setSuppressPublicChrome(true);
    return () => setSuppressPublicChrome(false);
  }, [setSuppressPublicChrome]);

  return children;
}
