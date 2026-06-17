import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { FilterBar } from "@/components/layout/filter-bar";

type CompetitionsPageSearchParams = {
  category?: string;
  closing?: string;
  sortBy?: string;
  sortOrder?: string;
  minPrizeValue?: string;
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

  const closing = params.closing ?? "3days";
  const sortBy = params.sortBy ?? "percentSold";
  const sortOrder =
    (params.sortOrder as "asc" | "desc" | undefined) ??
    defaultSortOrderBySortBy[sortBy] ??
    "asc";

  if (!params.closing || !params.sortBy || !params.sortOrder) {
    const nextParams = new URLSearchParams();

    if (params.category) nextParams.set("category", params.category);
    if (params.minPrizeValue) nextParams.set("minPrizeValue", params.minPrizeValue);

    nextParams.set("closing", closing);
    nextParams.set("sortBy", sortBy);
    nextParams.set("sortOrder", sortOrder);

    redirect(`/competitions?${nextParams.toString()}`);
  }

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
          closing,
          sortBy,
          sortOrder,
          minPrizeValue: params.minPrizeValue ? Number(params.minPrizeValue) : undefined,
          limit: 500,
        }}
      />
    </main>
  );
}