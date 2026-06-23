"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

export type FilterOption = {
  value: string;
  label: string;
};

export type SortOption = {
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const defaultCategoryOptions: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "cars", label: "Cars" },
  { value: "houses", label: "Houses" },
  { value: "bikes", label: "Bikes" },
  { value: "watches", label: "Watches" },
  { value: "cash", label: "Cash" },
  { value: "tech", label: "Tech" },
  { value: "other", label: "Other" },
  { value: "free", label: "Free" },
];

const defaultClosingOptions: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "3days", label: "3 days" },
  { value: "5days", label: "5 days" },
];

const defaultSortOptions: SortOption[] = [
  { label: "Best value", sortBy: "bestValue", sortOrder: "desc" },
  { label: "Best odds", sortBy: "percentSold", sortOrder: "asc" },
  { label: "Selling fast", sortBy: "percentSold", sortOrder: "desc" },
  { label: "Top prizes", sortBy: "prizeValue", sortOrder: "desc" },
  { label: "Ending soon", sortBy: "endsAt", sortOrder: "asc" },
  { label: "Most tickets left", sortBy: "ticketsLeft", sortOrder: "desc" },
  { label: "Lowest price", sortBy: "ticketPrice", sortOrder: "asc" },
];

type FilterBarProps = {
  categoryOptions?: FilterOption[];
  closingOptions?: FilterOption[];
  sortOptions?: SortOption[];
  className?: string;
};

export function FilterBar({
  categoryOptions,
  closingOptions,
  sortOptions,
  className,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sortOpen, setSortOpen] = useState(false);
  const sortWrapRef = useRef<HTMLDivElement | null>(null);

  const categoryOpts = categoryOptions ?? defaultCategoryOptions;
  const closingOpts = closingOptions ?? defaultClosingOptions;
  const sortOpts = sortOptions ?? defaultSortOptions;

  const freeOnly = searchParams.get("freeOnly") === "true";
  const category = freeOnly ? "free" : (searchParams.get("category") ?? "all");
  const currentClosing = searchParams.get("closing");
  const closing = currentClosing ?? "";
  const sortBy = searchParams.get("sortBy") ?? "bestValue";
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc";

  const showCategory = categoryOpts.length > 0;
  const showClosing = closingOpts.length > 0;
  const showSort = sortOpts.length > 0;

  const isSortOpen = showSort && sortOpen;

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      params.delete("excludeInstant");
      params.delete("excludeFree");
      params.delete("page");

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      params.delete("excludeInstant");
      params.delete("excludeFree");
      params.delete("page");

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const handleClosingClick = useCallback(
    (value: string) => {
      updateParam("closing", currentClosing === value ? null : value);
    },
    [currentClosing, updateParam],
  );

  const activeSort = useMemo(() => {
    return (
      sortOpts.find(
        (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder,
      ) ?? sortOpts[0]
    );
  }, [sortBy, sortOrder, sortOpts]);

  const sortLabel = activeSort?.label ?? "Best value";

  useEffect(() => {
    if (!isSortOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const wrap = sortWrapRef.current;
      if (!wrap) return;
      if (e.target instanceof Node && !wrap.contains(e.target)) {
        setSortOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSortOpen]);

  return (
    <div className={cn("border-b border-rr-border bg-rr-surface", className)}>
      <div className="container py-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          {showCategory ? (
            <div className="flex flex-wrap gap-[5px] flex-1">
              {categoryOpts.map((opt) => {
                const current = category === "all" ? "all" : category;
                const isActive = opt.value === current;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition cursor-pointer",
                      isActive
                        ? "bg-rr-green text-rr-on-accent border border-transparent"
                        : "bg-transparent border border-rr-border text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
                    )}
                    aria-pressed={isActive}
                    onClick={() => {
                      if (opt.value === "all") {
                        updateParams({ category: null, freeOnly: null });
                        return;
                      }

                      if (opt.value === "free") {
                        updateParams({
                          category: null,
                          freeOnly: isActive ? null : "true",
                          excludeInstant: null,
                          excludeFree: null,
                        });
                        return;
                      }

                      updateParams({
                        category: isActive ? null : opt.value,
                        freeOnly: null,
                      });
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className={cn("flex flex-col gap-2 md:flex-row md:items-center md:gap-[5px]", showCategory ? "md:flex-shrink-0" : "")}
          >
            {showClosing ? (
              <div className="flex items-center gap-[5px] flex-wrap">
                <span className="text-sm text-rr-muted">Closing:</span>
                {closingOpts.map((opt) => {
                  const isActive = opt.value === closing;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium transition cursor-pointer",
                        isActive
                          ? "bg-rr-green text-rr-on-accent border border-transparent"
                          : "bg-transparent border border-rr-border text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
                      )}
                      aria-pressed={isActive}
                      onClick={() => handleClosingClick(opt.value)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {showSort ? (
              <div ref={sortWrapRef} className="relative min-w-0">
                <button
                  type="button"
                  className={cn(
                    "h-9 w-full md:w-[220px] rounded-[7px] px-2.5 bg-rr-elevated text-sm text-rr-secondary outline-none border border-transparent cursor-pointer",
                    isSortOpen ? "border-rr-border" : "hover:border-rr-border",
                  )}
                  aria-label="Sort"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  onClick={() => setSortOpen((v) => !v)}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate">{sortLabel}</span>
                    <IconChevronDown size={14} className="text-rr-muted" />
                  </span>
                </button>

                {isSortOpen ? (
                  <div
                    className="absolute right-0 z-50 mt-1 w-full md:w-[220px] rounded-md border border-rr-border bg-rr-surface p-1"
                    role="listbox"
                    aria-label="Sort options"
                  >
                    {sortOpts.map((opt) => {
                      const isActive =
                        opt.sortBy === sortBy && opt.sortOrder === sortOrder;

                      return (
                        <button
                          key={`${opt.sortBy}:${opt.sortOrder}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          className={cn(
                            "w-full text-left rounded px-2.5 py-2 text-sm transition cursor-pointer",
                            isActive
                              ? "bg-rr-elevated text-rr-primary"
                              : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
                          )}
                          onClick={() => {
                            updateParams({
                              sortBy: opt.sortBy,
                              sortOrder: opt.sortOrder,
                            });
                            setSortOpen(false);
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}