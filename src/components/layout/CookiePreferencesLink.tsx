"use client";

import { useConsent } from "@/contexts/consent-context";

export function CookiePreferencesLink() {
  const { reopen } = useConsent();

  return (
    <button
      type="button"
      onClick={reopen}
      className="w-fit cursor-pointer bg-transparent p-0 text-sm text-rr-secondary underline underline-offset-4 transition-colors hover:text-rr-primary"
    >
      Cookie preferences
    </button>
  );
}
