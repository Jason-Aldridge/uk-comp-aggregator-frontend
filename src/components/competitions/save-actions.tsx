"use client";

import { IconHeart, IconBell } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function SaveActions() {
  return (
    <>
      <Button variant="icon" disabled title="Save — coming soon" aria-label="Save competition">
        <IconHeart size={20} />
      </Button>
      <Button variant="icon" disabled title="Alerts — coming soon" aria-label="Set alert">
        <IconBell size={20} />
      </Button>
    </>
  );
}