"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Matches Tailwind `h-9` / `top-9` (2.25rem at default 16px root). */
export const TOP_HEADER_OFFSET_PX = 36;

export type SiteHeaderScrollValue = {
  /** `true` when `window.scrollY === 0` (strict page top). */
  isDocumentTop: boolean;
  /** `true` when viewport is `md` or wider (`min-width: 768px`). */
  isMdUp: boolean;
  /** TopHeader slot is active: desktop/tablet and scrolled to top. */
  showTopHeaderChrome: boolean;
};

const SiteHeaderScrollContext = createContext<SiteHeaderScrollValue | null>(
  null
);

export function SiteHeaderScrollProvider({ children }: { children: ReactNode }) {
  const [isDocumentTop, setIsDocumentTop] = useState(true);
  const [isMdUp, setIsMdUp] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const syncMd = () => setIsMdUp(mq.matches);
    syncMd();
    mq.addEventListener("change", syncMd);

    const onScroll = () => {
      setIsDocumentTop(window.scrollY === 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", syncMd);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const value = useMemo<SiteHeaderScrollValue>(
    () => ({
      isDocumentTop,
      isMdUp,
      showTopHeaderChrome: isMdUp && isDocumentTop,
    }),
    [isDocumentTop, isMdUp]
  );

  return (
    <SiteHeaderScrollContext.Provider value={value}>
      {children}
    </SiteHeaderScrollContext.Provider>
  );
}

export function useSiteHeaderScroll(): SiteHeaderScrollValue {
  const ctx = useContext(SiteHeaderScrollContext);
  if (!ctx) {
    throw new Error(
      "useSiteHeaderScroll must be used within SiteHeaderScrollProvider"
    );
  }
  return ctx;
}
