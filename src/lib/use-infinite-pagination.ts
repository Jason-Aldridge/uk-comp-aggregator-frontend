"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type UseInfinitePaginationOptions<T> = {
  items: T[];
  pageSize?: number;
  rootMargin?: string;
};

export function useInfinitePagination<T>({
  items,
  pageSize = 20,
  rootMargin = "600px 0px",
}: UseInfinitePaginationOptions<T>) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setVisibleCount((current) => (current === pageSize ? current : pageSize));
    });

    return () => {
      cancelled = true;
    };
  }, [items.length, pageSize]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    if (visibleCount >= items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        setVisibleCount((current) => Math.min(current + pageSize, items.length));
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [items.length, pageSize, rootMargin, visibleCount]);

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  return {
    visibleItems,
    visibleCount,
    hasMore,
    loadMoreRef,
  };
}