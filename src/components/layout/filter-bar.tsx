"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChartBar, IconChevronDown, IconClock } from "@tabler/icons-react";
import { usePageLoader } from "@/components/ui/page-loader-context";
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

const otherSubcategoryOptions: FilterOption[] = [
  { value: "other", label: "All" },
  { value: "home", label: "Home" },
  { value: "holidays", label: "Holidays" },
  { value: "collectibles", label: "Collectibles" },
  { value: "experiences", label: "Experiences" },
  { value: "sports", label: "Sports" },
  { value: "none", label: "Uncategorised" },
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
  const { startLoading } = usePageLoader();

  const [sortOpen, setSortOpen] = useState(false);
  const [closingOpen, setClosingOpen] = useState(false);
  const sortWrapRef = useRef<HTMLDivElement | null>(null);
  const closingWrapRef = useRef<HTMLDivElement | null>(null);

  const categoryOpts = categoryOptions ?? defaultCategoryOptions;
  const closingOpts = closingOptions ?? defaultClosingOptions;
  const sortOpts = sortOptions ?? defaultSortOptions;

  const freeOnly = searchParams.get("freeOnly") === "true";
  const categoryParam = searchParams.get("category");
  const currentClosing = searchParams.get("closing");
  const closing = currentClosing ?? "";
  const sortBy = searchParams.get("sortBy") ?? "bestValue";
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc";

  const showCategory = categoryOpts.length > 0;
  const showClosing = closingOpts.length > 0;
  const showSort = sortOpts.length > 0;

  const otherSubcategoryValues = new Set(
    otherSubcategoryOptions
      .map((opt) => opt.value)
      .filter((value) => value !== "other"),
  );
  const isOtherSubcategory = categoryParam ? otherSubcategoryValues.has(categoryParam) : false;
  const currentMainCategory = freeOnly ? "free" : isOtherSubcategory ? "other" : (categoryParam ?? "all");
  const currentOtherSubcategory = currentMainCategory === "other" ? (categoryParam ?? "other") : null;
  const showOtherSubcategories = currentMainCategory === "other";

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
      const nextHref = qs ? `${pathname}?${qs}` : pathname;
      const currentQs = searchParams.toString();
      const currentHref = currentQs ? `${pathname}?${currentQs}` : pathname;

      if (nextHref === currentHref) {
        return;
      }

      startLoading(nextHref);
      router.push(nextHref);
    },
    [pathname, router, searchParams, startLoading],
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
      const nextHref = qs ? `${pathname}?${qs}` : pathname;
      const currentQs = searchParams.toString();
      const currentHref = currentQs ? `${pathname}?${currentQs}` : pathname;

      if (nextHref === currentHref) {
        return;
      }

      startLoading(nextHref);
      router.push(nextHref);
    },
    [pathname, router, searchParams, startLoading],
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

  const closingLabel = useMemo(() => {
    if (!closing) return "Closing: Any";

    const match = closingOpts.find((opt) => opt.value === closing);
    return match ? `Closing: ${match.label}` : "Closing: Any";
  }, [closing, closingOpts]);

  useEffect(() => {
    if (!isSortOpen && !closingOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const sortWrap = sortWrapRef.current;
      const closingWrap = closingWrapRef.current;

      if (e.target instanceof Node) {
        if (sortWrap && sortWrap.contains(e.target)) return;
        if (closingWrap && closingWrap.contains(e.target)) return;
      }

      setSortOpen(false);
      setClosingOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSortOpen(false);
        setClosingOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closingOpen, isSortOpen]);

  return (
    <div className={cn("border-b border-rr-border bg-rr-surface", className)}>
      <div className="container py-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
          {showCategory ? (
            <div className="order-2 flex flex-wrap gap-1.5 lg:order-1 lg:flex-1 lg:gap-[5px]">
              {categoryOpts.map((opt) => {
                const isActive = opt.value === currentMainCategory;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-medium transition cursor-pointer lg:px-3 lg:py-1 lg:text-sm",
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

                      if (opt.value === "other") {
                        updateParams({
                          category:
                            currentMainCategory === "other" && categoryParam === "other"
                              ? null
                              : "other",
                          freeOnly: null,
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

          <div
            className={cn(
              "order-1 grid grid-cols-2 gap-2 lg:order-2 lg:flex lg:items-center lg:gap-[5px]",
              showCategory ? "lg:flex-shrink-0" : "",
            )}
          >
            {showSort ? (
              <div ref={sortWrapRef} className="relative min-w-0">
                <button
                  type="button"
                  className={cn(
                    "h-10 w-full rounded-xl border border-rr-border bg-rr-surface px-3 text-sm text-rr-secondary shadow-sm outline-none cursor-pointer lg:h-9 lg:w-[220px] lg:rounded-[7px] lg:border-transparent lg:bg-rr-elevated lg:px-2.5 lg:shadow-none",
                    isSortOpen ? "border-rr-border" : "hover:border-rr-border",
                  )}
                  aria-label="Sort"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  onClick={() => {
                    setClosingOpen(false);
                    setSortOpen((v) => !v);
                  }}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <IconChartBar size={16} className="shrink-0 text-rr-muted lg:hidden" />
                      <span className="truncate">{sortLabel}</span>
                    </span>
                    <IconChevronDown size={14} className="text-rr-muted" />
                  </span>
                </button>

                {isSortOpen ? (
                  <div
                    className="absolute left-0 right-0 z-50 mt-1 rounded-md border border-rr-border bg-rr-surface p-1 lg:left-auto lg:right-0 lg:w-[220px]"
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

            {showClosing ? (
              <>
                <div ref={closingWrapRef} className="relative min-w-0 lg:hidden">
                  <button
                    type="button"
                    className={cn(
                      "h-10 w-full rounded-xl border border-rr-border bg-rr-surface px-3 text-sm text-rr-secondary shadow-sm outline-none cursor-pointer",
                      closingOpen ? "border-rr-border" : "hover:border-rr-border",
                    )}
                    aria-label="Closing"
                    aria-haspopup="listbox"
                    aria-expanded={closingOpen}
                    onClick={() => {
                      setSortOpen(false);
                      setClosingOpen((v) => !v);
                    }}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <IconClock size={16} className="shrink-0 text-rr-muted" />
                        <span className="truncate">{closingLabel}</span>
                      </span>
                      <IconChevronDown size={14} className="text-rr-muted" />
                    </span>
                  </button>

                  {closingOpen ? (
                    <div
                      className="absolute left-0 right-0 z-50 mt-1 rounded-md border border-rr-border bg-rr-surface p-1"
                      role="listbox"
                      aria-label="Closing options"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={!closing}
                        className={cn(
                          "w-full text-left rounded px-2.5 py-2 text-sm transition cursor-pointer",
                          !closing
                            ? "bg-rr-elevated text-rr-primary"
                            : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
                        )}
                        onClick={() => {
                          updateParam("closing", null);
                          setClosingOpen(false);
                        }}
                      >
                        Closing: Any
                      </button>

                      {closingOpts.map((opt) => {
                        const isActive = opt.value === closing;

                        return (
                          <button
                            key={opt.value}
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
                              updateParam("closing", opt.value);
                              setClosingOpen(false);
                            }}
                          >
                            {`Closing: ${opt.label}`}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="hidden flex-wrap items-center gap-[5px] lg:flex">
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
              </>
            ) : null}
          </div>
        </div>

        {showOtherSubcategories ? (
          <div className="mt-4 flex flex-wrap gap-2 lg:mt-2 lg:gap-[6px]">
            {otherSubcategoryOptions.map((opt) => {
              const isActive = opt.value === currentOtherSubcategory;

              return (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer md:px-2.5 md:py-1",
                    isActive
                      ? "bg-rr-elevated text-rr-primary shadow-sm"
                      : "bg-rr-surface text-rr-muted hover:bg-rr-elevated hover:text-rr-primary",
                  )}
                  aria-pressed={isActive}
                  onClick={() => updateParam("category", opt.value)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
