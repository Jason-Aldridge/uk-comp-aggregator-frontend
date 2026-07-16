"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { confirmNewsletterSubscription, unsubscribeFromNewsletter } from "@/lib/api";
import { cn } from "@/lib/cn";

type NewsletterAction = "confirm" | "unsubscribe";

type NewsletterTokenActionCardProps = {
  action: NewsletterAction;
  token?: string;
};

const errorBoxClass =
  "mt-4 rounded-xl border border-red-500/30 bg-rr-elevated px-4 py-3 text-sm text-red-600 dark:border-red-500/40 dark:text-red-400";

const buttonCopy = {
  confirm: {
    idle: "Confirm subscription",
    pending: "Confirming...",
    title: "Confirm your newsletter signup",
    description: "Click below to confirm your email subscription.",
    successTitle: "You're subscribed",
    successMessage: "Your subscription is confirmed. Your first email will arrive on Friday.",
    missingTitle: "Missing confirmation link",
    missingMessage:
      "This confirmation link is incomplete. Please subscribe again from the competitions page.",
    errorMessage:
      "This confirmation link is invalid or has expired. Please subscribe again from the competitions page.",
    buttonVariant: "primary" as const,
  },
  unsubscribe: {
    idle: "Unsubscribe",
    pending: "Unsubscribing...",
    title: "Unsubscribe from the newsletter",
    description: "Click below to stop receiving newsletter emails.",
    successTitle: "You're unsubscribed",
    successMessage:
      "You have been unsubscribed and will not receive any more newsletter emails.",
    missingTitle: "Missing unsubscribe link",
    missingMessage:
      "This unsubscribe link is incomplete. Please use the latest unsubscribe link from one of our emails.",
    errorMessage:
      "This unsubscribe link is invalid or has expired. Please use the latest unsubscribe link from one of our emails.",
    buttonVariant: "secondary" as const,
  },
};

export function NewsletterTokenActionCard({
  action,
  token,
}: NewsletterTokenActionCardProps) {
  const copy = buttonCopy[action];
  const normalizedToken = token?.trim() ?? "";
  const hasToken = normalizedToken.length > 0;
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  async function handleAction() {
    if (!hasToken || status === "pending") {
      return;
    }

    setStatus("pending");

    try {
      if (action === "confirm") {
        await confirmNewsletterSubscription(normalizedToken);
      } else {
        await unsubscribeFromNewsletter(normalizedToken);
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="bg-rr-bg">
      <section className="py-14 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-[640px]">
            <div className="rounded-[28px] bg-rr-elevated/70 p-1.5 shadow-sm sm:p-2">
              <div className="rounded-[24px] border border-rr-border bg-rr-surface px-5 py-6 sm:px-7 sm:py-7">
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-rr-green">
                  Newsletter
                </p>

                {status === "success" ? (
                  <>
                    <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-rr-primary sm:text-4xl">
                      {copy.successTitle}
                    </h1>
                    <p className="mt-3 text-[15.5px] leading-7 text-rr-secondary">
                      {copy.successMessage}
                    </p>
                  </>
                ) : !hasToken ? (
                  <>
                    <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-rr-primary sm:text-4xl">
                      {copy.missingTitle}
                    </h1>
                    <p className="mt-3 text-[15.5px] leading-7 text-rr-secondary">
                      {copy.missingMessage}
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-rr-primary sm:text-4xl">
                      {copy.title}
                    </h1>
                    <p className="mt-3 text-[15.5px] leading-7 text-rr-secondary">
                      {copy.description}
                    </p>

                    {status === "error" ? (
                      <div className={errorBoxClass}>
                        {copy.errorMessage}
                      </div>
                    ) : null}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button
                        type="button"
                        variant={copy.buttonVariant}
                        className="h-11 px-5"
                        onClick={handleAction}
                        disabled={status === "pending"}
                      >
                        {status === "pending" ? copy.pending : copy.idle}
                      </Button>
                    </div>
                  </>
                )}

                {status !== "idle" || !hasToken ? (
                  <div className="mt-6">
                    <Link
                      href="/competitions"
                      className={cn(
                        "inline-flex h-11 items-center justify-center rounded-md border border-rr-border bg-rr-surface px-4 text-sm font-medium text-rr-secondary no-underline transition-colors",
                        "hover:bg-rr-elevated hover:text-rr-primary",
                      )}
                    >
                      Back to competitions
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
