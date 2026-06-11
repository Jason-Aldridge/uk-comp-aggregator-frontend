import { Suspense } from "react";
import { FilterBar } from "@/components/layout/filter-bar";
import { Hero } from "@/components/home/hero";

export default function Page() {
  return (
    <main>
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      <Hero />
    </main>
  );
}
