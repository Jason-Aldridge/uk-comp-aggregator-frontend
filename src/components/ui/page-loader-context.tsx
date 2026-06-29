"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PageLoaderOverlay } from "@/components/ui/PageLoaderOverlay";

type PageLoaderContextValue = {
  isLoading: boolean;
  startLoading: (nextHref: string) => void;
  finishLoading: () => void;
};

const PageLoaderContext = createContext<PageLoaderContextValue | null>(null);

export function PageLoaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const startLoading = useCallback(
    (nextHref: string) => {
      const qs = searchParams.toString();
      const currentHref = qs ? `${pathname}?${qs}` : pathname;

      if (nextHref === currentHref) {
        return;
      }

      pendingHrefRef.current = nextHref;
      setIsLoading(true);

      clearSafetyTimer();
      safetyTimerRef.current = window.setTimeout(() => {
        pendingHrefRef.current = null;
        safetyTimerRef.current = null;
        setIsLoading(false);
      }, 5000);
    },
    [clearSafetyTimer, pathname, searchParams],
  );

  const finishLoading = useCallback(() => {
    pendingHrefRef.current = null;
    clearSafetyTimer();
    setIsLoading(false);
  }, [clearSafetyTimer]);

  useEffect(() => {
    if (!pendingHrefRef.current) {
      return;
    }

    const qs = searchParams.toString();
    const currentHref = qs ? `${pathname}?${qs}` : pathname;

    if (pendingHrefRef.current === currentHref) {
      pendingHrefRef.current = null;
      clearSafetyTimer();
      setIsLoading(false);
    }
  }, [clearSafetyTimer, pathname, searchParams]);

  useEffect(() => {
    return () => {
      clearSafetyTimer();
    };
  }, [clearSafetyTimer]);

  const value = useMemo(
    () => ({
      isLoading,
      startLoading,
      finishLoading,
    }),
    [finishLoading, isLoading, startLoading],
  );

  return (
    <PageLoaderContext.Provider value={value}>
      {children}
      {isLoading ? <PageLoaderOverlay /> : null}
    </PageLoaderContext.Provider>
  );
}

export function usePageLoader() {
  const context = useContext(PageLoaderContext);

  if (!context) {
    throw new Error("usePageLoader must be used within PageLoaderProvider");
  }

  return context;
}
