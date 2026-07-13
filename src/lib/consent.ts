"use client";

export const CONSENT_COOKIE_NAME = "rr_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;

export type ConsentRecord = {
  version: number;
  timestamp: string;
  accepted: boolean;
};

export type ConsentState = {
  accepted: boolean;
  hasDecided: boolean;
};

function parseConsentRecord(value: string): ConsentRecord | null {
  try {
    const parsed = JSON.parse(value) as Partial<ConsentRecord>;

    if (
      typeof parsed.version !== "number" ||
      typeof parsed.timestamp !== "string" ||
      typeof parsed.accepted !== "boolean"
    ) {
      return null;
    }

    return {
      version: parsed.version,
      timestamp: parsed.timestamp,
      accepted: parsed.accepted,
    };
  } catch {
    return null;
  }
}

function readCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!value) {
    return null;
  }

  return value.slice(name.length + 1);
}

export function readConsentRecord(): ConsentRecord | null {
  const rawValue = readCookieValue(CONSENT_COOKIE_NAME);

  if (!rawValue) {
    return null;
  }

  return parseConsentRecord(decodeURIComponent(rawValue));
}

export function getConsentState(): ConsentState {
  const record = readConsentRecord();

  if (!record || record.version !== CONSENT_VERSION) {
    return {
      accepted: false,
      hasDecided: false,
    };
  }

  return {
    accepted: record.accepted,
    hasDecided: true,
  };
}

export function hasConsent(): boolean {
  return getConsentState().accepted;
}

export function writeConsent(accepted: boolean): ConsentRecord | null {
  if (typeof document === "undefined") {
    return null;
  }

  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    accepted,
  };

  const expires = new Date();
  expires.setDate(expires.getDate() + CONSENT_MAX_AGE_DAYS);

  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(record),
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

  return record;
}
