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