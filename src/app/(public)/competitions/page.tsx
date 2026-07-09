import { Suspense } from "react";
import { IconArrowLeft, IconX } from "@tabler/icons-react";
import { RadarLoader } from "@/components/ui/RadarLoader";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { FilterBar } from "@/components/layout/filter-bar";
import { getCompetitions } from "@/lib/api";
import type { Competition } from "@/types/competition";

type CompetitionsPageSearchParams = {
  category?: string;
  closing?: string;
  sortBy?: string;
  sortOrder?: string;
  operator?: string;
  minPrizeValue?: string;
  freeOnly?: string;
  excludeInstant?: string;
  excludeFree?: string;
};

function formatOperatorLabel(slug: string) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CompetitionsPage({
  searchParams,
}: {
  searchParams: Promise<CompetitionsPageSearchParams>;
}) {
  const params = await searchParams;
  const suspenseKey = JSON.stringify(params);
  const operatorSlug = params.operator?.trim() || undefined;
  const includesGamesCategory =
    params.category?.split(",").some((value) => value.trim().toLowerCase() === "games") ??
    false;

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
    if (operatorSlug) nextParams.set("operator", operatorSlug);
    if (params.minPrizeValue) nextParams.set("minPrizeValue", params.minPrizeValue);
    if (params.freeOnly) nextParams.set("freeOnly", params.freeOnly);
    if (params.excludeInstant) nextParams.set("excludeInstant", params.excludeInstant);
    if (params.excludeFree) nextParams.set("excludeFree", params.excludeFree);

    nextParams.set("closing", params.closing ?? "3days");
    nextParams.set("sortBy", sortBy);
    nextParams.set("sortOrder", sortOrder);

    redirect(`/competitions?${nextParams.toString()}`);
  }

  let operatorLabel = operatorSlug ? formatOperatorLabel(operatorSlug) : null;

  if (operatorSlug) {
    try {
      const operatorMatches = (await getCompetitions({
        category: params.category,
        closing,
        operator: operatorSlug,
        sortBy,
        sortOrder,
        minPrizeValue: params.minPrizeValue ? Number(params.minPrizeValue) : undefined,
        freeOnly: params.freeOnly === "true",
        excludeInstant: params.excludeInstant === "true",
        excludeFree: params.excludeFree === "true",
        excludeGames: !includesGamesCategory,
        limit: 1,
      })) as Competition[];

      operatorLabel = operatorMatches[0]?.operator?.name ?? operatorLabel;
    } catch {
      operatorLabel = operatorLabel ?? formatOperatorLabel(operatorSlug);
    }
  }

  const resetOperatorParams = new URLSearchParams();
  if (params.category) resetOperatorParams.set("category", params.category);
  if (params.closing) resetOperatorParams.set("closing", params.closing);
  if (params.sortBy) resetOperatorParams.set("sortBy", params.sortBy);
  if (params.sortOrder) resetOperatorParams.set("sortOrder", params.sortOrder);
  if (params.minPrizeValue) resetOperatorParams.set("minPrizeValue", params.minPrizeValue);
  if (params.freeOnly) resetOperatorParams.set("freeOnly", params.freeOnly);
  if (params.excludeInstant) resetOperatorParams.set("excludeInstant", params.excludeInstant);
  if (params.excludeFree) resetOperatorParams.set("excludeFree", params.excludeFree);
  const resetOperatorHref = resetOperatorParams.toString()
    ? `/competitions?${resetOperatorParams.toString()}`
    : "/competitions";

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

          {operatorSlug && operatorLabel ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[10px] border border-rr-border bg-rr-surface px-3 py-2 text-sm text-rr-secondary">
              <span>
                Showing: <span className="font-medium text-rr-primary">{operatorLabel}</span> competitions
              </span>
              <Link
                href={resetOperatorHref}
                className="inline-flex items-center gap-1 rounded-full border border-rr-border px-2 py-1 text-xs text-rr-secondary no-underline transition-colors hover:bg-rr-elevated hover:text-rr-primary"
              >
                <IconX size={12} />
                Clear
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <Suspense
        key={suspenseKey}
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center bg-rr-bg">
            <RadarLoader size="lg" />
          </div>
        }
      >
        <CompetitionGrid
          params={{
            category: params.category,
            closing,
            operator: operatorSlug,
            sortBy,
            sortOrder,
            minPrizeValue: params.minPrizeValue ? Number(params.minPrizeValue) : undefined,
            freeOnly: params.freeOnly === "true",
            excludeInstant: params.excludeInstant === "true",
            excludeFree: params.excludeFree === "true",
            excludeGames: !includesGamesCategory,
            limit: 500,
          }}
        />
      </Suspense>
    </main>
  );
}
