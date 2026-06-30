"use client";

import Link from "next/link";
import { getPageNumbers } from "@/lib/classic-pagination";

type ClassicPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function getPageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export function ClassicPagination({
  currentPage,
  totalPages,
  basePath,
}: ClassicPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={getPageHref(basePath, currentPage - 1)}
          className="inline-flex min-w-[42px] items-center justify-center rounded-md border border-rr-border bg-rr-surface px-3 py-2 text-sm font-medium text-rr-primary no-underline transition hover:bg-rr-elevated"
        >
          Prev
        </Link>
      ) : (
        <span className="inline-flex min-w-[42px] items-center justify-center rounded-md border border-rr-border bg-rr-surface px-3 py-2 text-sm font-medium text-rr-muted opacity-60">
          Prev
        </span>
      )}

      {pageNumbers.map((pageNumber, index) =>
        pageNumber === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex min-w-[42px] items-center justify-center px-2 py-2 text-sm text-rr-muted"
          >
            ...
          </span>
        ) : (
          <Link
            key={pageNumber}
            href={getPageHref(basePath, pageNumber)}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            className={
              pageNumber === currentPage
                ? "inline-flex min-w-[42px] items-center justify-center rounded-md border border-transparent bg-rr-green px-3 py-2 text-sm font-medium text-rr-on-accent no-underline"
                : "inline-flex min-w-[42px] items-center justify-center rounded-md border border-rr-border bg-rr-surface px-3 py-2 text-sm font-medium text-rr-primary no-underline transition hover:bg-rr-elevated"
            }
          >
            {pageNumber}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={getPageHref(basePath, currentPage + 1)}
          className="inline-flex min-w-[42px] items-center justify-center rounded-md border border-rr-border bg-rr-surface px-3 py-2 text-sm font-medium text-rr-primary no-underline transition hover:bg-rr-elevated"
        >
          Next
        </Link>
      ) : (
        <span className="inline-flex min-w-[42px] items-center justify-center rounded-md border border-rr-border bg-rr-surface px-3 py-2 text-sm font-medium text-rr-muted opacity-60">
          Next
        </span>
      )}
    </nav>
  );
}
