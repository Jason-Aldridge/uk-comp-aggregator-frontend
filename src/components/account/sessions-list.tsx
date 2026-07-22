"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { AuthClientError, authFetch, authFetchJson } from "@/lib/auth-client";
import { cn } from "@/lib/cn";
import { getUserAgentLabel } from "@/lib/user-agent";

type SessionItem = {
  id: string;
  userAgent: string | null;
  createdAt: string;
  lastUsedAt: string;
  current: boolean;
};

const cardClass = "rounded-2xl border border-rr-border bg-rr-surface p-6";
const titleClass = "mb-1 text-base font-medium text-rr-primary";
const subtitleClass = "text-sm text-rr-secondary";

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function SessionsList() {
  const router = useRouter();
  const { logout } = useAuth();

  const [items, setItems] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [revokeError, setRevokeError] = useState("");
  const [revokingIds, setRevokingIds] = useState<Record<string, boolean>>({});
  const [isSigningOutEverywhere, setIsSigningOutEverywhere] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await authFetchJson<SessionItem[]>("/sessions");
        if (!cancelled) {
          setItems(response);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(getErrorMessage(error, "Failed to load active devices."));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasOtherSessions = useMemo(() => items.some((item) => !item.current), [items]);

  async function revokeSession(id: string) {
    setRevokeError("");
    setRevokingIds((current) => ({ ...current, [id]: true }));

    try {
      await authFetch(`/sessions/${encodeURIComponent(id)}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      if (error instanceof AuthClientError) {
        setRevokeError(error.message || "Failed to revoke session.");
      } else {
        setRevokeError("Failed to revoke session.");
      }
    } finally {
      setRevokingIds((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    }
  }

  async function signOutEverywhere() {
    setRevokeError("");

    const confirmed = window.confirm(
      "Sign out everywhere will also sign out this device. Continue?",
    );
    if (!confirmed) {
      return;
    }

    setIsSigningOutEverywhere(true);

    try {
      await authFetch("/logout-all", { method: "POST" });
      await logout();
      router.replace("/");
    } catch (error) {
      if (error instanceof AuthClientError) {
        setRevokeError(error.message || "Failed to sign out everywhere.");
      } else {
        setRevokeError("Failed to sign out everywhere.");
      }
    } finally {
      setIsSigningOutEverywhere(false);
    }
  }

  return (
    <section className={cardClass}>
      <h3 className={titleClass}>Active devices</h3>
      <p className={subtitleClass}>
        Revoke sessions on other devices. The current device cannot be revoked here.
      </p>

      <div className="mt-4 space-y-3">
        {isLoading ? <div className="text-sm text-rr-secondary">Loading...</div> : null}

        {loadError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
          >
            {loadError}
          </div>
        ) : null}

        {revokeError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
          >
            {revokeError}
          </div>
        ) : null}

        {!isLoading && !loadError ? (
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-sm text-rr-secondary">No active sessions found.</div>
            ) : (
              <div className="divide-y divide-rr-border rounded-2xl border border-rr-border">
                {items.map((item) => {
                  const isRevoking = Boolean(revokingIds[item.id]);
                  const deviceLabel = getUserAgentLabel(item.userAgent);

                  return (
                    <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div
                            className="min-w-0 truncate text-sm font-medium text-rr-primary"
                            title={item.userAgent?.trim() || undefined}
                          >
                            {deviceLabel}
                          </div>
                          {item.current ? (
                            <span className="rounded-full border border-rr-border bg-rr-elevated px-2 py-0.5 text-xs text-rr-secondary">
                              Current device
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 grid gap-1 text-xs text-rr-secondary sm:grid-cols-2">
                          <div>
                            <span className="text-rr-muted">Created:</span>{" "}
                            {formatDateTime(item.createdAt)}
                          </div>
                          <div>
                            <span className="text-rr-muted">Last used:</span>{" "}
                            {formatDateTime(item.lastUsedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        {!item.current ? (
                          <Button
                            variant="secondary"
                            disabled={isRevoking}
                            onClick={() => revokeSession(item.id)}
                            className={cn(isRevoking ? "opacity-70" : "")}
                          >
                            {isRevoking ? "Revoking..." : "Revoke"}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button
                variant="secondary"
                onClick={signOutEverywhere}
                disabled={isSigningOutEverywhere || !hasOtherSessions}
              >
                {isSigningOutEverywhere ? "Signing out..." : "Sign out everywhere"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
