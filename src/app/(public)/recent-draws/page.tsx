import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
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
      <section className="pt-6">
        <div className="container">
          <Link
            href="/"
            aria-label="Back to home"
            className="inline-flex items-center gap-2 text-sm font-medium text-rr-green no-underline transition-opacity hover:opacity-80"
          >
            <IconArrowLeft size={16} />
            Back
          </Link>
        </div>
      </section>
      <CompetitionSection
        titleStart="Recent"
        titleAccent="draws"
        subtitle="Just finished — how they sold before the draw"
        competitions={competitions}
        cardVariant="ended"
        mobileLayout="grid"
      />
    </main>
  );
}
