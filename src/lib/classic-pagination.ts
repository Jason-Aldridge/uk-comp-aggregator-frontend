export type PaginationResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
  const safePageSize = Math.max(1, Math.floor(pageSize) || 1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const requestedPage = Number.isFinite(page) ? Math.floor(page) : 1;
  const currentPage = Math.min(totalPages, Math.max(1, requestedPage || 1));
  const start = (currentPage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    currentPage,
    totalPages,
    totalItems,
    pageSize: safePageSize,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}

export function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const safeTotalPages = Math.max(1, Math.floor(totalPages) || 1);
  const safeCurrentPage = Math.min(safeTotalPages, Math.max(1, Math.floor(currentPage) || 1));

  if (safeTotalPages <= 7) {
    return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, safeTotalPages]);

  for (let page = safeCurrentPage - 1; page <= safeCurrentPage + 1; page += 1) {
    if (page >= 1 && page <= safeTotalPages) {
      pages.add(page);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (const page of sortedPages) {
    const previous = result[result.length - 1];

    if (typeof previous === "number") {
      const gap = page - previous;

      if (gap === 2) {
        result.push(previous + 1);
      } else if (gap > 2) {
        result.push("ellipsis");
      }
    }

    result.push(page);
  }

  return result;
}
