"use client";

import { hasConsent } from "@/lib/consent";

type AnalyticsParams = Record<string, unknown>;

export function pushEvent(event: string, params: AnalyticsParams = {}) {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !hasConsent()
  ) {
    return;
  }

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push({
    event,
    ...params,
  });
}
