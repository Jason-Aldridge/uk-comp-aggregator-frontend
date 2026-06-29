"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PageLoaderOverlay } from "@/components/ui/PageLoaderOverlay";

type PageLoaderContextValue = {
  isLoading: boolean;
  startLoading: () => void;
  finishLoading: () => void;
};

const PageLoaderContext = createContext<PageLoaderContextValue | null>(null);

export function PageLoaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  const startLoading = useCallback(() => {
    startedAtRef.current = Date.now();
    setIsLoading(true);
  }, []);

  const finishLoading = useCallback(() => {
    startedAtRef.current = null;
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const elapsed = startedAtRef.current ? Date.now() - startedAtRef.current : 0;
    const remaining = Math.max(0, 220 - elapsed);
    const timer = window.setTimeout(() => {
      setIsLoading(false);
      startedAtRef.current = null;
    }, remaining);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoading, pathname, searchParams]);

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
