import { Suspense } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { FilterBar } from "@/components/layout/filter-bar";

type CompetitionsPageSearchParams = {
  category?: string;
  closing?: string;
  sortBy?: string;
  sortOrder?: string;
  minPrizeValue?: string;
  freeOnly?: string;
  excludeInstant?: string;
  excludeFree?: string;
};

export default async function CompetitionsPage({
  searchParams,
}: {
  searchParams: Promise<CompetitionsPageSearchParams>;
}) {
  const params = await searchParams;

  const defaultSortOrderBySortBy: Record<string, "asc" | "desc"> = {
    bestValue: "desc",
    valueRatio: "desc",
    prizeValue: "desc",
    endsAt: "asc",
    ticketsLeft: "desc",
    ticketPrice: "asc",
    percentSold: "asc",
  };

  const closing = params.closing ?? "";
  const sortBy = params.sortBy ?? "bestValue";
  const sortOrder =
    (params.sortOrder as "asc" | "desc" | undefined) ??
    defaultSortOrderBySortBy[sortBy] ??
    "desc";

  if (!params.sortBy || !params.sortOrder) {
    const nextParams = new URLSearchParams();

    if (params.category) nextParams.set("category", params.category);
    if (params.minPrizeValue) nextParams.set("minPrizeValue", params.minPrizeValue);
    if (params.freeOnly) nextParams.set("freeOnly", params.freeOnly);
    if (params.excludeInstant) nextParams.set("excludeInstant", params.excludeInstant);
    if (params.excludeFree) nextParams.set("excludeFree", params.excludeFree);

    nextParams.set("closing", params.closing ?? "3days");
    nextParams.set("sortBy", sortBy);
    nextParams.set("sortOrder", sortOrder);

    redirect(`/competitions?${nextParams.toString()}`);
  }

  const heading = (() => {
    const isTopPrizes =
      sortBy === "prizeValue" &&
      sortOrder === "desc" &&
      params.minPrizeValue === "5000" &&
      params.category === "cars,houses,bikes";

    if (isTopPrizes) {
      return { titleStart: "Top Prizes", titleAccent: "right now", tone: "green" as const };
    }

    if (
      sortBy === "bestValue" &&
      sortOrder === "desc" &&
      closing === "today" &&
      params.excludeInstant === "true" &&
      params.excludeFree === "true"
    ) {
      return { titleStart: "Top", titleAccent: "Opportunities", tone: "green" as const };
    }

    if (
      sortBy === "percentSold" &&
      sortOrder === "asc" &&
      closing === "today" &&
      params.excludeInstant === "true" &&
      params.excludeFree === "true"
    ) {
      return { titleStart: "Most undersold", titleAccent: "ending soon", tone: "green" as const };
    }

    if (
      sortBy === "percentSold" &&
      sortOrder === "desc" &&
      params.excludeInstant === "true" &&
      params.excludeFree === "true"
    ) {
      return { titleStart: "Selling", titleAccent: "fast", tone: "green" as const };
    }

    if (
      sortBy === "endsAt" &&
      sortOrder === "asc" &&
      closing === "today" &&
      params.excludeInstant === "true" &&
      params.excludeFree === "true"
    ) {
      return { titleStart: "Ending", titleAccent: "today", tone: "red" as const };
    }

    if (sortBy === "endsAt" && sortOrder === "asc") {
      return { titleStart: "Ending", titleAccent: "soon", tone: "green" as const };
    }

    if (sortBy === "percentSold" && sortOrder === "asc") {
      return { titleStart: "Best", titleAccent: "odds", tone: "green" as const };
    }

    if ((sortBy === "bestValue" || sortBy === "valueRatio") && sortOrder === "desc") {
      return { titleStart: "Best", titleAccent: "value", tone: "green" as const };
    }

    return { titleStart: "All", titleAccent: "competitions", tone: "green" as const };
  })();

  return (
    <main>
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      <section className="pt-6">
        <div className="container">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Back to home"
              className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md border border-rr-border bg-rr-surface text-rr-secondary transition-colors hover:bg-rr-elevated hover:text-rr-primary"
            >
              <IconArrowLeft size={18} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-rr-primary">
              {heading.titleStart}{" "}
              <span
                className={
                  heading.tone === "red"
                    ? "text-[#991b1b] dark:text-[#fca5a5]"
                    : "text-rr-green"
                }
              >
                {heading.titleAccent}
              </span>
            </h1>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <CompetitionGrid
          params={{
            category: params.category,
            closing,
            sortBy,
            sortOrder,
            minPrizeValue: params.minPrizeValue ? Number(params.minPrizeValue) : undefined,
            freeOnly: params.freeOnly === "true",
            excludeInstant: params.excludeInstant === "true",
            excludeFree: params.excludeFree === "true",
            limit: 500,
          }}
        />
      </Suspense>
    </main>
  );
}
