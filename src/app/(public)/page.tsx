import { Suspense } from "react";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { CompetitionGridClient } from "@/components/competitions/competition-grid-client";
import { Hero } from "@/components/home/hero";
import { FilterBar } from "@/components/layout/filter-bar";
import { getCompetitions } from "@/lib/api";
import type { Competition } from "@/types/competition";

type HomePageSearchParams = {
  category?: string;
  closing?: string;
  sortBy?: string;
  sortOrder?: string;
};

function getFeaturedIds(competitions: Competition[]) {
  return competitions
    .filter(
      (competition) =>
        competition.valueRatio !== null && competition.valueRatio !== undefined,
    )
    .sort((a, b) => Number(b.valueRatio ?? 0) - Number(a.valueRatio ?? 0))
    .slice(0, 3)
    .map((competition) => competition.id);
}

function HomeSections() {
  return (
    <>
      <Hero />
      <CompetitionGrid />
    </>
  );
}

function FilteredGrid({ competitions }: { competitions: Competition[] }) {
  const featuredIds = getFeaturedIds(competitions);

  return (
    <CompetitionGridClient
      competitions={competitions}
      featuredIds={featuredIds}
      pageSize={20}
    />
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<HomePageSearchParams>;
}) {
  const params = await searchParams;
  const hasFilters = !!(
    params.category ||
    params.closing ||
    params.sortBy ||
    params.sortOrder
  );

  if (hasFilters) {
    let competitions: Competition[] = [];

    try {
      competitions = (await getCompetitions({
        category: params.category,
        closing: params.closing,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        limit: 500,
      })) as Competition[];
    } catch {
      competitions = [];
    }

    return (
      <main>
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
        <FilteredGrid competitions={competitions} />
      </main>
    );
  }

  return (
    <main>
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      <HomeSections />
    </main>
  );
}
