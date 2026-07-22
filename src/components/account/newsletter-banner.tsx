"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthClientError } from "@/lib/auth-client";

type NewsletterState = "subscribed" | "pending" | "not_subscribed";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function newsletterRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/newsletter${path}`, {
    ...init,
    credentials: "same-origin",
  });

  if (!response.ok) {
    const raw = await response.text();
    let message = `HTTP ${response.status}`;

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { message?: string };
        message = parsed.message ?? message;
      } catch {
        message = raw;
      }
    }

    throw new AuthClientError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function NewsletterBanner() {
  const [state, setState] = useState<NewsletterState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setActionError("");
      try {
        const response = await newsletterRequest<{ state: NewsletterState }>("/me");
        if (mounted) {
          setState(response.state);
        }
      } catch (error) {
        if (mounted) {
          if (!(error instanceof AuthClientError && error.status === 401)) {
            setActionError(getErrorMessage(error, "Failed to load subscription state."));
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubscribe() {
    setIsActing(true);
    setActionError("");
    try {
      await newsletterRequest<{ state: NewsletterState }>("/me/subscribe", {
        method: "POST",
      });
      const response = await newsletterRequest<{ state: NewsletterState }>("/me");
      setState(response.state);
    } catch (error) {
      setActionError(getErrorMessage(error, "Failed to subscribe."));
    } finally {
      setIsActing(false);
    }
  }

  if (isLoading || state === null) {
    return null;
  }

  if (state === "subscribed" || state === "pending") {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rr-border bg-rr-surface p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="mb-1 text-base font-medium text-rr-primary">
            Weekly newsletter
          </h3>
          <p className="text-sm text-rr-secondary">
            Get the most undersold competitions every Friday.
          </p>
          {actionError ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {actionError}
            </p>
          ) : null}
        </div>
        <div className="shrink-0">
          <Button onClick={handleSubscribe} disabled={isActing}>
            {isActing ? "Processing..." : "Subscribe"}
          </Button>
        </div>
      </div>
    </div>
  );
}
