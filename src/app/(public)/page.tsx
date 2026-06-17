import { Suspense } from "react";
import { CompetitionGrid } from "@/components/competitions/competition-grid";
import { CompetitionSection } from "@/components/home/competition-section";
import { CommunitySection } from "@/components/home/community-section";
import { Hero, type HeroStats } from "@/components/home/hero";
import { FilterBar } from "@/components/layout/filter-bar";
import { getCompetitions, getStats, getTopOpportunities } from "@/lib/api";
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

  let topOpportunities: Competition[] = [];
  let topPrizes: Competition[] = [];
  let undersold: Competition[] = [];
  let bestValue: Competition[] = [];
  let endingToday: Competition[] = [];
  let stats: HeroStats = {
    competitionsCount: 0,
    operatorsCount: 0,
    lastUpdatedAt: null,
  };

  try {
    const [
      topOpportunitiesResult,
      topPrizesResult,
      undersoldResult,
      bestValueResult,
      endingTodayResult,
      statsResult,
    ] = await Promise.all([
      getTopOpportunities({ limit: 8 }),
      getCompetitions({
        minPrizeValue: 5000,
        category: "cars,houses,bikes",
        sortBy: "prizeValue",
        sortOrder: "desc",
        limit: 8,
      }),
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

    topOpportunities = topOpportunitiesResult as Competition[];
    topPrizes = topPrizesResult as Competition[];
    undersold = undersoldResult as Competition[];
    bestValue = bestValueResult as Competition[];
    endingToday = endingTodayResult as Competition[];
    stats = statsResult;
  } catch {
    topOpportunities = [];
    topPrizes = [];
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
        titleStart="Top"
        titleAccent="Opportunities"
        subtitle="Best chances to win right now"
        viewAllHref="/competitions?sortBy=percentSold&sortOrder=asc&closing=3days"
        competitions={topOpportunities}
      />
      <CompetitionSection
        titleStart="Top Prizes"
        titleAccent="right now"
        subtitle="The biggest draws right now — cars, homes and bikes worth winning"
        viewAllHref="/competitions?sortBy=percentSold&sortOrder=asc&closing=3days"
        competitions={topPrizes}
      />
      <CompetitionSection
        titleStart="Most undersold"
        titleAccent="ending soon"
        subtitle="Low ticket sales, closing within 3 days — your best odds right now"
        viewAllHref="/competitions?sortBy=percentSold&sortOrder=asc&closing=3days"
        competitions={undersold}
      />
      <CompetitionSection
        titleStart="Selling"
        titleAccent="fast"
        subtitle="These competitions are almost gone — very few tickets left, so act fast"
        viewAllHref="/competitions?sortBy=percentSold&sortOrder=asc&closing=3days"
        competitions={bestValue}
      />
      <CompetitionSection
        titleStart="Ending"
        titleAccent="today"
        subtitle="Last chance — these draws close tonight"
        viewAllHref="/competitions?sortBy=percentSold&sortOrder=asc&closing=3days"
        competitions={endingToday}
        accentTone="red"
      />
      <CommunitySection />
    </main>
  );
}
