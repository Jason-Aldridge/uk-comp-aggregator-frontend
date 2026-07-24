"use client";

import type { ComponentProps } from "react";
import { useId, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useNewsletter } from "@/contexts/newsletter-context";
import { subscribeToNewsletter } from "@/lib/api";
import { cn } from "@/lib/cn";

type SubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

const fieldBase =
  "h-11 w-full rounded-xl border border-transparent bg-rr-elevated px-4 text-sm text-rr-primary outline-none transition placeholder:text-rr-muted caret-rr-primary focus-visible:border-rr-green focus-visible:ring-2 focus-visible:ring-rr-green/20";

const fieldInvalid =
  "border-red-500 dark:border-red-500/70 focus-visible:border-red-500 focus-visible:ring-red-500/25";

const errorTextClass = "text-sm text-red-600 dark:text-red-400";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function NewsletterSignupBanner() {
  const { state, isLoading, markSubscribedLocally } = useNewsletter();
  const contentId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (isLoading || state === null) {
    return null;
  }

  if (state === "subscribed" || state === "pending") {
    return null;
  }

  function handleChange(value: string) {
    setEmail(value);
    if (error) {
      setError("");
    }
  }

  const isExpanded = isMobileOpen || status === "success";

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email address.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("That email address doesn't look right.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      await subscribeToNewsletter(trimmedEmail);
      setEmail("");
      setStatus("success");
      markSubscribedLocally();
    } catch (submitError) {
      setStatus("idle");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't sign you up right now. Try again.",
      );
    }
  }

  return (
    <div className="rounded-2xl border border-rr-border bg-rr-surface px-4 py-4 sm:px-5">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left sm:hidden"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={() => setIsMobileOpen((current) => !current)}
      >
        <p className="text-sm font-medium text-rr-primary">
          Get weekly competition picks by email.
        </p>
        <IconChevronDown
          size={18}
          className={cn(
            "shrink-0 text-rr-muted transition-transform",
            isExpanded ? "rotate-180" : "",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        className={cn(
          "mt-0 flex-col gap-4 sm:mt-0 sm:flex lg:flex-row lg:items-center lg:justify-between lg:gap-6",
          isExpanded ? "mt-4 flex" : "hidden",
          "sm:mt-0 sm:flex",
        )}
      >
        <div className="hidden max-w-[420px] sm:block">
          <p className="text-sm font-medium text-rr-primary">
            Get weekly competition picks by email.
          </p>
          <p className="mt-1 text-sm text-rr-secondary">
            A short weekly email with standout competitions.
          </p>
        </div>

        {status === "success" ? (
          <div
            className="w-full rounded-xl bg-rr-elevated px-4 py-3 text-sm text-rr-primary lg:max-w-[560px]"
            aria-live="polite"
          >
            Check your email and click the link to confirm your signup. The email can take a little longer to arrive.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full lg:max-w-[560px]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => handleChange(event.target.value)}
                  className={cn(fieldBase, error && fieldInvalid)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "newsletter-signup-message" : undefined}
                />
              </div>
              <Button
                type="submit"
                className="h-11 shrink-0 px-5 sm:min-w-[132px]"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Joining..." : "Sign up"}
              </Button>
            </div>
            {error ? (
              <p
                id="newsletter-signup-message"
                className={cn(errorTextClass, "mt-2")}
                aria-live="polite"
              >
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
