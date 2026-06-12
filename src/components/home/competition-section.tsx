import { CompetitionCard } from "@/components/competitions/competition-card";
import { SectionHeader } from "@/components/home/section-header";
import type { Competition } from "@/types/competition";

type CompetitionSectionProps = {
  titleStart: string;
  titleAccent: string;
  subtitle: string;
  viewAllHref: string;
  competitions: Competition[];
  accentTone?: "green" | "red";
  featuredIds?: string[];
};

export function CompetitionSection({
  titleStart,
  titleAccent,
  subtitle,
  viewAllHref,
  competitions,
  accentTone = "green",
  featuredIds = [],
}: CompetitionSectionProps) {
  if (competitions.length === 0) return null;

  const featuredSet = new Set(featuredIds);

  return (
    <section className="py-4 md:py-5">
      <div className="container">
        <SectionHeader
          titleStart={titleStart}
          titleAccent={titleAccent}
          subtitle={subtitle}
          viewAllHref={viewAllHref}
          accentTone={accentTone}
        />

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              featured={featuredSet.has(competition.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}