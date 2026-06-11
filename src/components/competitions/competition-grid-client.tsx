"use client";

import { CompetitionCard } from "@/components/competitions/competition-card";
import { useInfinitePagination } from "@/lib/use-infinite-pagination";
import type { Competition } from "@/types/competition";

type CompetitionGridClientProps = {
  competitions: Competition[];
  featuredIds: string[];
  pageSize?: number;
};

export function CompetitionGridClient({
  competitions,
  featuredIds,
  pageSize = 20,
}: CompetitionGridClientProps) {
  const { visibleItems, hasMore, loadMoreRef } = useInfinitePagination({
      items: competitions,
      pageSize,
    });

  const featuredSet = new Set(featuredIds);

  return (
    <section className="py-8 md:py-10">
      <div className="container">
        {competitions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  featured={featuredSet.has(competition.id)}
                />
              ))}
            </div>

            {hasMore ? (
              <div className="mt-6" aria-hidden="true">
                <div ref={loadMoreRef} className="h-6 w-full" />
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-xl border border-rr-border bg-rr-surface px-4 py-8 text-center text-sm text-rr-muted">
            No competitions available right now.
          </div>
        )}
      </div>
    </section>
  );
}