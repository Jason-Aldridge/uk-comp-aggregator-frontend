"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthClientError, authRequest } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

type ResetPasswordFormProps = {
  token: string;
};

const cardClass =
  "rounded-[24px] bg-rr-surface px-5 py-5 shadow-sm sm:px-7 sm:py-6";
const fieldBase =
  "w-full rounded-xl border border-transparent bg-rr-elevated text-sm text-rr-primary outline-none transition placeholder:text-rr-muted caret-rr-primary focus-visible:border-rr-green focus-visible:ring-2 focus-visible:ring-rr-green/20";
const fieldInvalid =
  "border-red-500 dark:border-red-500/70 focus-visible:border-red-500 focus-visible:ring-red-500/25";
const labelClass = "text-sm font-medium text-rr-primary";
const errorTextClass = "text-sm text-red-600 dark:text-red-400";

type SubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;
    const timeout = window.setTimeout(() => router.replace("/"), 1200);
    return () => window.clearTimeout(timeout);
  }, [isSuccess, router]);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    let nextPasswordError = "";
    let nextConfirmError = "";

    if (!token) {
      setSubmitError(
        "This reset link is invalid or has expired. Request a new one and try again.",
      );
      return;
    }

    if (!password) {
      nextPasswordError = "Enter a password.";
    } else if (password.length < 8) {
      nextPasswordError = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      nextConfirmError = "Confirm your password.";
    } else if (confirmPassword !== password) {
      nextConfirmError = "Passwords do not match.";
    }

    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    setSubmitError("");

    if (nextPasswordError || nextConfirmError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authRequest("/reset-password", {
        method: "POST",
        body: { token, password },
      });
      setIsSuccess(true);
    } catch (error) {
      if (
        error instanceof AuthClientError &&
        (error.status === 400 || error.status === 401 || error.status === 404)
      ) {
        setSubmitError(
          "This reset link is invalid or has expired. Request a new one and try again.",
        );
      } else if (error instanceof AuthClientError && error.status === 429) {
        setSubmitError(
          "Too many attempts. Please wait a moment and try again.",
        );
      } else {
        setSubmitError(
          "We could not reset your password right now. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className={cn(cardClass, "space-y-4")}>
        <h2 className="text-xl font-medium tracking-[-0.03em] text-rr-primary">
          Password updated
        </h2>
        <p className="text-sm leading-6 text-rr-secondary">
          Your password has been reset and you are now signed in.
        </p>
        <Button type="button" disabled className="w-full">
          Redirecting...
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn(cardClass, "space-y-5")}>
      <div className="space-y-1.5">
        <label htmlFor="reset-password" className={labelClass}>
          New password
        </label>
        <input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError("");
            setSubmitError("");
          }}
          className={cn(
            fieldBase,
            "h-11 px-4",
            passwordError && fieldInvalid,
          )}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "reset-password-error" : undefined}
        />
        {passwordError ? (
          <p id="reset-password-error" className={errorTextClass}>
            {passwordError}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="reset-confirm-password" className={labelClass}>
          Confirm password
        </label>
        <input
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setConfirmError("");
            setSubmitError("");
          }}
          className={cn(
            fieldBase,
            "h-11 px-4",
            confirmError && fieldInvalid,
          )}
          aria-invalid={Boolean(confirmError)}
          aria-describedby={
            confirmError ? "reset-confirm-password-error" : undefined
          }
        />
        {confirmError ? (
          <p id="reset-confirm-password-error" className={errorTextClass}>
            {confirmError}
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

      <Button
        type="submit"
        disabled={isSubmitting || !token}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Reset password"}
      </Button>
    </form>
  );
}
