import { CompetitionGridClient } from "@/components/competitions/competition-grid-client";
import { getMostUndersold, getTopOpportunities } from "@/lib/api";
import type { Competition } from "@/types/competition";

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

export async function SectionGrid({
  section,
  category,
  closing,
  freeOnly,
  operator,
  minPrizeValue,
}: {
  section: "most-undersold" | "top-opportunities";
  category?: string;
  closing?: string;
  freeOnly?: boolean;
  operator?: string;
  minPrizeValue?: number;
}) {
  let competitions: Competition[] = [];

  try {
    if (section === "most-undersold") {
      competitions = (await getMostUndersold({
        limit: 500,
        excludeGames: true,
        category,
        closing,
        freeOnly,
        operator,
        minPrizeValue,
      })) as Competition[];
    } else {
      competitions = (await getTopOpportunities({
        limit: 500,
        excludeGames: true,
        category,
        closing,
        freeOnly,
        operator,
        minPrizeValue,
      })) as Competition[];
    }
  } catch {
    competitions = [];
  }

  const featuredIds = getFeaturedIds(competitions);

  return (
    <CompetitionGridClient
      competitions={competitions}
      featuredIds={featuredIds}
      pageSize={20}
    />
  );
}
