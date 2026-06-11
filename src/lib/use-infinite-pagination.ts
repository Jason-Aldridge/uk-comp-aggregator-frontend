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
  const resetKey = `${items.length}:${pageSize}`;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const previousResetKeyRef = useRef(resetKey);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  if (previousResetKeyRef.current !== resetKey) {
    previousResetKeyRef.current = resetKey;
    if (visibleCount !== pageSize) {
      setVisibleCount(pageSize);
    }
  }

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