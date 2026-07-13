"use client";

import Link from "next/link";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/button";
import {
  type ConsentState,
  getConsentState,
  writeConsent,
} from "@/lib/consent";

type ConsentContextValue = ConsentState & {
  isBannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  reopen: () => void;
};

const defaultConsentState: ConsentContextValue = {
  accepted: false,
  hasDecided: false,
  isBannerOpen: false,
  accept: () => undefined,
  reject: () => undefined,
  reopen: () => undefined,
};

const ConsentContext = createContext<ConsentContextValue>(defaultConsentState);

function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

function ConsentBanner({
  accept,
  reject,
}: {
  accept: () => void;
  reject: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-rr-border bg-rr-elevated shadow-2xl shadow-black/30">
        <div className="p-5 sm:p-6">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-rr-green">
            Cookie settings
          </p>
          <h2 className="mt-2 text-xl font-medium tracking-[-0.02em] text-rr-primary">
            We use cookies to run the site and measure performance if you choose to allow it.
          </h2>
          <p className="mt-3 text-sm leading-6 text-rr-secondary">
            You can read the full details on our{" "}
            <Link href="/privacy" className="text-rr-green underline underline-offset-4">
              policy page
            </Link>
            .
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              variant="secondary"
              className="min-w-[150px] justify-center"
              onClick={accept}
            >
              Accept
            </Button>
            <Button
              variant="secondary"
              className="min-w-[150px] justify-center"
              onClick={reject}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const [overrideConsent, setOverrideConsent] = useState<ConsentState | null>(null);
  const [isBannerForcedOpen, setIsBannerForcedOpen] = useState(false);

  const consent = isClient ? overrideConsent ?? getConsentState() : defaultConsentState;
  const isBannerOpen = isClient ? isBannerForcedOpen || !consent.hasDecided : false;

  const applyConsent = useCallback((accepted: boolean) => {
    writeConsent(accepted);
    setOverrideConsent({
      accepted,
      hasDecided: true,
    });
    setIsBannerForcedOpen(false);
  }, []);

  const accept = useCallback(() => {
    applyConsent(true);
  }, [applyConsent]);

  const reject = useCallback(() => {
    applyConsent(false);
  }, [applyConsent]);

  const reopen = useCallback(() => {
    setIsBannerForcedOpen(true);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      accepted: consent.accepted,
      hasDecided: consent.hasDecided,
      isBannerOpen,
      accept,
      reject,
      reopen,
    }),
    [accept, consent.accepted, consent.hasDecided, isBannerOpen, reject, reopen],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {isClient && isBannerOpen ? <ConsentBanner accept={accept} reject={reject} /> : null}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}
