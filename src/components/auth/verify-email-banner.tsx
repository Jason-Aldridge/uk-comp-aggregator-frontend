"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  AuthClientError,
  authRequestJson,
  authFetchJson,
} from "@/lib/auth-client";
import type { AuthUser } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailBanner() {
  const pathname = usePathname();
  const { user, status } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const hideOnAuthRoutes =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email" ||
    pathname === "/oauth/callback";

  if (hideOnAuthRoutes) {
    return null;
  }

  if (status === "loading" || !user || user.emailVerified) {
    return null;
  }

  async function handleResend() {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      const user = await authFetchJson<AuthUser>("/me");
      const result = await authRequestJson<{ sent: boolean; reason?: string }>("/resend-verification", {
        method: "POST",
        body: { email: user.email },
      });

      if (result.sent) {
        setResendSuccess(true);
      } else if (result.reason === "cooldown") {
        setResendError("Please wait a moment before requesting another email.");
      } else if (result.reason === "already_verified") {
        setResendError("Your email is already verified.");
      } else {
        setResendError("We could not send the email. Please try again.");
      }

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
        "w-full border-b-2 px-4 py-3",
        "border-amber-300 bg-amber-50",
        "dark:border-amber-600/40 dark:bg-amber-900/20",
        "relative overflow-hidden",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-amber-500",
        "shadow-sm",
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="mt-0.5 shrink-0 sm:mt-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-amber-700 dark:text-amber-300"
            >
              <path
                fillRule="evenodd"
                d="M2.5 4a1 1 0 011-1h13a1 1 0 011 1v12a1 1 0 01-1 1h-13a1 1 0 01-1-1V4zm2 2v8h11V6h-11z"
                clipRule="evenodd"
              />
              <path d="M3.293 6.293a1 1 0 011.414 0L10 11.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              Please verify your email to access all features.
            </p>
            <p className="text-xs text-amber-800/80 dark:text-amber-200/80">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pl-8 sm:pl-0">
          {resendSuccess && !resendError ? (
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Email sent!
            </span>
          ) : null}

          {resendError ? (
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              {resendError}
            </span>
          ) : null}

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className={cn(
              "text-sm font-medium underline-offset-2 hover:underline",
              "text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-100",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline",
            )}
          >
            {isResending
              ? "Sending..."
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend email"}
          </button>

        </div>
      </div>
    </div>
  );
}
