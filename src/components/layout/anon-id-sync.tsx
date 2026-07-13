"use client";

import { useEffect } from "react";
import { useConsent } from "@/contexts/consent-context";
import { clearAnonId } from "@/lib/anon-id";

export function AnonIdSync() {
  const { accepted } = useConsent();

  useEffect(() => {
    if (!accepted) {
      clearAnonId();
    }
  }, [accepted]);

  return null;
}
