"use client";

import { IconExternalLink } from "@tabler/icons-react";
import { trackCompetitionClick } from "@/lib/api";
import { pushEvent } from "@/lib/analytics";
import { getAnonIdForTracking } from "@/lib/anon-id";

type Props = {
  competitionId: string;
  sourceUrl: string | null;
  operatorName: string;
};

export function EnterButton({ competitionId, sourceUrl, operatorName }: Props) {
  const handleClick = () => {
    getAnonIdForTracking();
    pushEvent("outbound_click", {
      operator: operatorName,
      source: "detail",
      competition: competitionId,
    });
    void trackCompetitionClick(competitionId, "detail").catch(() => undefined);
  };

  return (
    <a
      href={sourceUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex-1 bg-rr-green text-rr-on-accent font-medium rounded-lg py-3 px-4 text-center hover:opacity-90 transition-opacity flex items-center justify-center"
    >
      Enter on {operatorName}
      <IconExternalLink size={16} className="ml-2" />
    </a>
  );
}
