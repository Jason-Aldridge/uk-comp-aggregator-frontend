"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { AuthClientError, authRequest } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailBanner() {
  const { user, status } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  if (status === "loading" || !user || user.emailVerified) {
    return null;
  }

  async function handleResend() {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      await authRequest("/resend-verification", {
        method: "POST",
        body: {},
      });
      setResendSuccess(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);

      const interval = window.setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            window.clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof AuthClientError && err.status === 429) {
        setResendError("Please wait a moment before requesting another email.");
      } else {
        setResendError("We could not send the email. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div
      className={cn(
        "w-full border-b px-4 py-3",
        "border-rr-border bg-rr-elevated",
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="mt-0.5 shrink-0 sm:mt-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-rr-primary"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.25-7.25a.75.75 0 000-1.5H8.5a.75.75 0 000 1.5h4.75z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-rr-primary">
            Please verify your email address to access all features.
          </p>
        </div>

        <div className="flex items-center gap-3 pl-8 sm:pl-0">
          {resendSuccess && !resendError ? (
            <span className="text-sm text-green-600 dark:text-green-400">
              Email sent!
            </span>
          ) : null}

          {resendError ? (
            <span className="text-sm text-red-600 dark:text-red-400">
              {resendError}
            </span>
          ) : null}

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className={cn(
              "text-sm font-medium underline-offset-2 hover:underline",
              "text-rr-secondary hover:text-rr-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline",
            )}
          >
            {isResending
              ? "Sending..."
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend email"}
          </button>

          <Link
            href="/settings"
            className="text-sm font-medium text-rr-secondary underline-offset-2 hover:text-rr-primary hover:underline"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
