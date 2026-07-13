"use client";

import { hasConsent } from "@/lib/consent";

const ANON_COOKIE_NAME = "rr_anon";
const ANON_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

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

  return decodeURIComponent(value.slice(name.length + 1));
}

function writeCookieValue(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

function createAnonId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

export function getAnonIdForTracking() {
  if (!hasConsent()) {
    return null;
  }

  const existing = readCookieValue(ANON_COOKIE_NAME);

  if (existing) {
    return existing;
  }

  const anonId = createAnonId();
  writeCookieValue(ANON_COOKIE_NAME, anonId, ANON_COOKIE_MAX_AGE_SECONDS);
  return anonId;
}

export function clearAnonId() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ANON_COOKIE_NAME}=; Max-Age=0; path=/; SameSite=Lax`;
}
