"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(value: string) {
    setEmail(value);
    if (error) {
      setError("");
    }
  }

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

    setIsSubmitting(true);
    setError("");

    try {
      await subscribeToNewsletter(trimmedEmail);
      setIsSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't sign you up right now. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-rr-border bg-rr-surface px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="max-w-[420px]">
          <p className="text-sm font-medium text-rr-primary">
            Get weekly competition picks by email.
          </p>
          <p className="mt-1 text-sm text-rr-secondary">
            A short weekly email with standout competitions.
          </p>
        </div>

        {isSubmitted ? (
          <div
            className="w-full rounded-xl bg-rr-elevated px-4 py-3 text-sm text-rr-primary lg:max-w-[560px]"
            aria-live="polite"
          >
            If your email can be subscribed, check your inbox and click the confirmation link.
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Sign up"}
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
