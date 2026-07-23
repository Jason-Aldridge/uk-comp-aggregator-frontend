"use client";

import { usePathname } from "next/navigation";
import { IconBell } from "@tabler/icons-react";
import { SaveHeart } from "@/components/competitions/save-heart";
import { Button } from "@/components/ui/button";

export function SaveActions() {
  const pathname = usePathname();
  const competitionId = pathname.match(/^\/competitions\/([^/]+)/)?.[1] ?? null;

  return (
    <>
      {competitionId ? <SaveHeart competitionId={competitionId} /> : null}
      <Button variant="icon" disabled title="Alerts — coming soon" aria-label="Set alert">
        <IconBell size={20} />
      </Button>
    </>
  );
}
