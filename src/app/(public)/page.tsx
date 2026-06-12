import { Suspense } from "react";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { CompetitionSection } from "@/components/home/competition-section";
import { CommunitySection } from "@/components/home/community-section";
import { Hero, type HeroStats } from "@/components/home/hero";
import { FilterBar } from "@/components/layout/filter-bar";
import { getCompetitions, getStats } from "@/lib/api";
import type { Competition } from "@/types/competition";

type HomePageSearchParams = {
  category?: string;
  closing?: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<HomePageSearchParams>;
}) {
  const params = await searchParams;
  const hasFilters = !!(params.category || params.closing || params.sortBy);

  if (hasFilters) {
    return (
      <main>
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
        <CompetitionGrid
          params={{
            category: params.category,
            closing: params.closing,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
            limit: 500,
          }}
        />
      </main>
    );
  }

  let undersold: Competition[] = [];
  let bestValue: Competition[] = [];
  let endingToday: Competition[] = [];
  let stats: HeroStats = {
    competitionsCount: 0,
    operatorsCount: 0,
    lastUpdatedAt: null,
  };

  try {
    const [undersoldResult, bestValueResult, endingTodayResult, statsResult] =
      await Promise.all([
        getCompetitions({
          sortBy: "percentSold",
          sortOrder: "asc",
          closing: "3days",
          limit: 4,
        }),
        getCompetitions({
          sortBy: "valueRatio",
          sortOrder: "desc",
          limit: 4,
        }),
        getCompetitions({
          sortBy: "endsAt",
          sortOrder: "asc",
          closing: "today",
          limit: 4,
        }),
        getStats(),
      ]);

    undersold = undersoldResult as Competition[];
    bestValue = bestValueResult as Competition[];
    endingToday = endingTodayResult as Competition[];
    stats = statsResult;
  } catch {
    undersold = [];
    bestValue = [];
    endingToday = [];
  }

  return (
    <main>
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      <Hero stats={stats} />
      <CompetitionSection
        titleStart="Most undersold"
        titleAccent="ending soon"
        subtitle="Low ticket sales, closing within 3 days — your best odds right now"
        viewAllHref="/competitions?sortBy=percentSold&sortOrder=asc&closing=3days"
        competitions={undersold}
      />
      <CompetitionSection
        titleStart="Best value"
        titleAccent="right now"
        subtitle="Highest prize-to-ticket-cost ratio across all operators"
        viewAllHref="/competitions?sortBy=valueRatio&sortOrder=desc"
        competitions={bestValue}
      />
      <CompetitionSection
        titleStart="Ending"
        titleAccent="today"
        subtitle="Last chance — these draws close tonight"
        viewAllHref="/competitions?sortBy=endsAt&sortOrder=asc&closing=today"
        competitions={endingToday}
        accentTone="red"
      />
      <CommunitySection />
    </main>
  );
}
