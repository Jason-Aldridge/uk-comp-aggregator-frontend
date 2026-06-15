import { Suspense } from "react";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { FilterBar } from "@/components/layout/filter-bar";

type CompetitionsPageSearchParams = {
  category?: string;
  closing?: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function CompetitionsPage({
  searchParams,
}: {
  searchParams: Promise<CompetitionsPageSearchParams>;
}) {
  const params = await searchParams;

  const defaultSortOrderBySortBy: Record<string, "asc" | "desc"> = {
    valueRatio: "desc",
    endsAt: "asc",
    ticketsLeft: "desc",
    ticketPrice: "asc",
    percentSold: "asc",
  };

  const sortBy = params.sortBy ?? "valueRatio";
  const sortOrder =
    (params.sortOrder as "asc" | "desc" | undefined) ??
    defaultSortOrderBySortBy[sortBy] ??
    "desc";

  const heading =
    sortBy === "valueRatio" && sortOrder === "desc"
      ? { titleStart: "Best value", titleAccent: "right now" }
      : sortBy === "endsAt" && sortOrder === "asc"
        ? { titleStart: "Ending", titleAccent: "soon" }
        : { titleStart: "All", titleAccent: "competitions" };

  return (
    <main>
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      <section className="pt-6">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-rr-primary">
            {heading.titleStart} <span className="text-rr-green">{heading.titleAccent}</span>
          </h1>
        </div>
      </section>

      <CompetitionGrid
        params={{
          category: params.category,
          closing: params.closing,
          sortBy,
          sortOrder,
          limit: 500,
        }}
      />
    </main>
  );
}