import { Suspense } from "react";
import { IconArrowLeft, IconX } from "@tabler/icons-react";
import { RadarLoader } from "@/components/ui/RadarLoader";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { SectionGrid } from "@/components/competitions/section-grid";
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
  section?: string;
};

function formatOperatorLabel(slug: string) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const sectionBaseTitles: Record<string, string> = {
  "most-undersold": "Most Undersold",
  "top-opportunities": "Top Opportunities",
  "top-prizes": "Top Prizes",
  "selling-fast": "Selling Fast",
  "ending-today": "Ending Today",
};

const sectionDefaultSorts: Record<string, { sortBy: string; sortOrder: "asc" | "desc" }> = {
  "most-undersold": { sortBy: "percentSold", sortOrder: "asc" },
  "top-opportunities": { sortBy: "bestValue", sortOrder: "desc" },
  "top-prizes": { sortBy: "prizeValue", sortOrder: "desc" },
  "selling-fast": { sortBy: "percentSold", sortOrder: "desc" },
  "ending-today": { sortBy: "endsAt", sortOrder: "asc" },
};

const categoryLabelMap: Record<string, string> = {
  cars: "Cars",
  houses: "Houses",
  bikes: "Bikes",
  watches: "Watches",
  cash: "Cash",
  tech: "Tech",
  other: "Other",
};

function titleCaseValue(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function joinTitleLabels(values: string[]) {
  if (values.length === 0) return null;
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} & ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} & ${values[values.length - 1]}`;
}

function getCategoryTitleLabel(category?: string) {
  if (!category) return null;
  const values = category.split(",").map((value) => value.trim()).filter(Boolean);
  return joinTitleLabels(
    values.map((value) => categoryLabelMap[value.toLowerCase()] ?? titleCaseValue(value)),
  );
}

function getSortSuffix(
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  closing?: string,
  excludeInstant?: string,
  excludeFree?: string,
) {
  if (!sortBy || !sortOrder) return null;
  if (sortBy === "prizeValue") return "By Prize Value";
  if (sortBy === "bestValue" || sortBy === "valueRatio") return "By Value";
  if (sortBy === "percentSold") {
    if (
      sortOrder === "asc" &&
      closing === "today" &&
      excludeInstant === "true" &&
      excludeFree === "true"
    ) {
      return "By Most Undersold";
    }
    return sortOrder === "desc" ? "By Selling Fast" : "By Best Odds";
  }
  if (sortBy === "endsAt") return "By Ending Soon";
  if (sortBy === "ticketPrice") return "By Price";
  if (sortBy === "ticketsLeft") return "By Availability";
  return null;
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

  if ((!params.sortBy || !params.sortOrder) && !params.section) {
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
  if (params.section) resetOperatorParams.set("section", params.section);
  const resetOperatorHref = resetOperatorParams.toString()
    ? `/competitions?${resetOperatorParams.toString()}`
    : "/competitions";

  const section = params.section?.trim() || "";
  const baseTitle = sectionBaseTitles[section] ?? "All Competitions";
  const filterLabels = [
    getCategoryTitleLabel(params.category),
    operatorLabel,
    params.minPrizeValue
      ? (() => {
          const value = Number(params.minPrizeValue);
          return Number.isFinite(value)
            ? `£${value.toLocaleString("en-GB")}+`
            : null;
        })()
      : null,
    params.freeOnly === "true" ? "Free" : null,
  ].filter((value): value is string => Boolean(value));
  const sectionDefaultSort = sectionDefaultSorts[section];
  const sortMatchesSectionDefault =
    sectionDefaultSort !== undefined &&
    sectionDefaultSort.sortBy === sortBy &&
    sectionDefaultSort.sortOrder === sortOrder;
  const sortSuffix = sortMatchesSectionDefault
    ? null
    : getSortSuffix(
        sortBy,
        sortOrder,
        closing,
        params.excludeInstant,
        params.excludeFree,
      );
  const titleToneClass =
    section === "ending-today" ? "text-[#991b1b] dark:text-[#fca5a5]" : "text-rr-green";

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
              <span className={titleToneClass}>{baseTitle}</span>
              {filterLabels.length > 0 ? ` - ${filterLabels.join(" - ")}` : ""}
              {sortSuffix ? <span className="hidden sm:inline"> {sortSuffix}</span> : null}
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
        {params.section === "most-undersold" ||
        params.section === "top-opportunities" ? (
          <SectionGrid
            section={params.section}
            category={params.category}
            freeOnly={params.freeOnly === "true"}
            operator={operatorSlug}
            minPrizeValue={
              params.minPrizeValue ? Number(params.minPrizeValue) : undefined
            }
          />
        ) : (
          <CompetitionGrid
            params={{
              category: params.category,
              closing,
              operator: operatorSlug,
              sortBy,
              sortOrder,
              minPrizeValue: params.minPrizeValue
                ? Number(params.minPrizeValue)
                : undefined,
              freeOnly: params.freeOnly === "true",
              excludeInstant: params.excludeInstant === "true",
              excludeFree: params.excludeFree === "true",
              excludeGames: !includesGamesCategory,
              limit: 500,
            }}
          />
        )}
      </Suspense>
    </main>
  );
}
