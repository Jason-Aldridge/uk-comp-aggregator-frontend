"use client";

import { useEffect } from "react";
import { useConsent } from "@/contexts/consent-context";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GTM_SCRIPT_ID = "rr-gtm-script";

let hasInjectedGtm = false;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function GtmLoader() {
  const { accepted } = useConsent();

  useEffect(() => {
    if (
      !accepted ||
      !GTM_ID ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return;
    }

    const existingScript = document.getElementById(GTM_SCRIPT_ID);

    if (existingScript || hasInjectedGtm) {
      hasInjectedGtm = true;
      window.dataLayer = window.dataLayer ?? [];
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });

    const script = document.createElement("script");
    script.id = GTM_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

    document.head.appendChild(script);
    hasInjectedGtm = true;
  }, [accepted]);

  return null;
}
