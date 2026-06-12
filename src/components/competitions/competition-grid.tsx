import { CompetitionGridClient } from "@/components/competitions/competition-grid-client";
import { getCompetitions } from "@/lib/api";
import type { GetCompetitionsParams } from "@/lib/api";
import type { Competition } from "@/types/competition";

function getFeaturedIds(competitions: Competition[]) {
  return competitions
    .filter((competition) => competition.valueRatio !== null && competition.valueRatio !== undefined)
    .sort((a, b) => Number(b.valueRatio ?? 0) - Number(a.valueRatio ?? 0))
    .slice(0, 3)
    .map((competition) => competition.id);
}

export async function CompetitionGrid({
  params,
}: {
  params?: GetCompetitionsParams;
} = {}) {
  let competitions: Competition[] = [];

  try {
    competitions = (await getCompetitions({
      limit: 500,
      ...params,
    })) as Competition[];
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