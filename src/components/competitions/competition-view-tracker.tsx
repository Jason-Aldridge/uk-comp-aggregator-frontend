"use client";

import { useEffect } from "react";
import { pushEvent } from "@/lib/analytics";

type Props = {
  competition: string;
  operator?: string;
};

export function CompetitionViewTracker({ competition, operator }: Props) {
  useEffect(() => {
    pushEvent("view_competition", {
      competition,
      ...(operator ? { operator } : {}),
    });
  }, [competition, operator]);

  return null;
}
