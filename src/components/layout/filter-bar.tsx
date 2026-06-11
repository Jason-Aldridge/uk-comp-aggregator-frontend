"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/cn";

export type FilterOption = {
  value: string;
  label: string;
};

const defaultCategoryOptions: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "cars", label: "Cars" },
  { value: "cash", label: "Cash" },
  { value: "watches", label: "Watches" },
  { value: "tech", label: "Tech" },
  { value: "holidays", label: "Holidays" },
  { value: "bikes", label: "Bikes" },
];

const defaultClosingOptions: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "3d", label: "3 days" },
  { value: "5d", label: "5 days" },
];

const defaultSortOptions: FilterOption[] = [
  { value: "best", label: "Best value" },
  { value: "ending", label: "Ending soon" },
  { value: "tickets", label: "Most tickets left" },
  { value: "price", label: "Lowest price" },
];

type FilterBarProps = {
  categoryOptions?: FilterOption[];
  closingOptions?: FilterOption[];
  sortOptions?: FilterOption[];
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

  const category = searchParams.get("category") ?? "all";
  const closing = searchParams.get("closing") ?? "";
  const sort = searchParams.get("sort") ?? "best";

  const showCategory = categoryOpts.length > 0;
  const showClosing = closingOpts.length > 0;
  const showSort = sortOpts.length > 0;

  const isSortOpen = showSort && sortOpen;

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());

    if (value) next.set(key, value);
    else next.delete(key);

    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const sortLabel = useMemo(() => {
    const selected = sortOpts.find((opt) => opt.value === sort);
    return selected?.label ?? "Best value";
  }, [sort, sortOpts]);

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
                const isActive = opt.value === category;

                const value = opt.value === "all" ? "" : opt.value;

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
                    onClick={() => setParam("category", value)}
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
                      onClick={() =>
                        setParam("closing", isActive ? "" : opt.value)
                      }
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
                      const isActive = opt.value === sort;
                      const value = opt.value === "best" ? "" : opt.value;

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
                            setParam("sort", value);
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