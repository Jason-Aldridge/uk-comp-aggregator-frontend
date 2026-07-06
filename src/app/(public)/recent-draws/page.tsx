import { CompetitionSection } from "@/components/home/competition-section";
import { getRecentlyEnded } from "@/lib/api";
import type { Competition } from "@/types/competition";

export const revalidate = 60;

export const metadata = {
  title: "Recent Draws",
  description: "Recently ended competitions and how they sold before the draw.",
};

export default async function RecentDrawsPage() {
  let competitions: Competition[] = [];

  try {
    const result = await getRecentlyEnded(24);
    competitions = result as Competition[];
  } catch {
    competitions = [];
  }

  return (
    <main className="bg-rr-bg">
      <CompetitionSection
        titleStart="Recent"
        titleAccent="draws"
        subtitle="Just finished — how they sold before the draw"
        competitions={competitions}
        cardVariant="ended"
      />
    </main>
  );
}
