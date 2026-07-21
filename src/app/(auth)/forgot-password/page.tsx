"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthClientError, authRequest } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const cardClass =
  "rounded-[24px] bg-rr-surface px-5 py-5 shadow-sm sm:px-7 sm:py-6";
const fieldBase =
  "w-full rounded-xl border border-transparent bg-rr-elevated text-sm text-rr-primary outline-none transition placeholder:text-rr-muted caret-rr-primary focus-visible:border-rr-green focus-visible:ring-2 focus-visible:ring-rr-green/20";
const fieldInvalid =
  "border-red-500 dark:border-red-500/70 focus-visible:border-red-500 focus-visible:ring-red-500/25";
const labelClass = "text-sm font-medium text-rr-primary";
const errorTextClass = "text-sm text-red-600 dark:text-red-400";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type SubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Enter your email address.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError("That email address doesn't look right.");
      return;
    }
    setEmailError("");
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await authRequest("/forgot-password", {
        method: "POST",
        body: { email: trimmedEmail },
      });
      setSubmittedEmail(trimmedEmail);
    } catch (error) {
      if (error instanceof AuthClientError && error.status === 429) {
        setSubmitError(
          "Too many attempts. Please wait a moment and try again.",
        );
      } else {
        setSubmitError(
          "We couldn't send a reset email right now. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="py-10 sm:py-14">
      <div className="container">
        <div className="mx-auto max-w-[560px] space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-rr-primary">
              Forgot password
            </h1>
            <p className="text-[15px] leading-7 text-rr-secondary">
              Enter your email and we will send reset instructions.
            </p>
          </div>
          {submittedEmail ? (
            <div className={cn(cardClass, "space-y-4")}>
              <h2 className="text-xl font-medium tracking-[-0.03em] text-rr-primary">
                Check your inbox
              </h2>
              <p className="text-sm leading-6 text-rr-secondary">
                If an account exists for{" "}
                <span className="font-medium text-rr-primary">
                  {submittedEmail}
                </span>
                , a password reset link has been sent.
              </p>
              <p className="text-sm leading-6 text-rr-secondary">
                Use the email to continue resetting your password.
              </p>
              <Button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Back to login
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={cn(cardClass, "space-y-5")}
            >
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                    setSubmitError("");
                  }}
                  className={cn(
                    fieldBase,
                    "h-11 px-4",
                    emailError && fieldInvalid,
                  )}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={
                    emailError ? "forgot-email-error" : undefined
                  }
                />
                {emailError ? (
                  <p id="forgot-email-error" className={errorTextClass}>
                    {emailError}
                  </p>
                ) : null}
              </div>
              {submitError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
                >
                  {submitError}
                </div>
              ) : null}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
