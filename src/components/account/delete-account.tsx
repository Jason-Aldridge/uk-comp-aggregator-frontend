"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { AuthClientError, authFetch } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const cardClass =
  "rounded-2xl border border-[var(--vr-danger-border)] bg-[var(--vr-danger-bg)] p-6";
const titleClass = "mb-1 text-base font-medium text-[var(--vr-danger-text)]";
const subtitleClass = "text-sm text-[var(--vr-danger-text)]/90";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function DeleteAccount() {
  const router = useRouter();
  const { logout } = useAuth();

  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const canDelete = useMemo(() => confirmation.trim() === "DELETE", [confirmation]);

  async function handleDelete() {
    setDeleteError("");

    if (!canDelete) {
      return;
    }

    const confirmed = window.confirm("This cannot be undone. Delete your account?");
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await authFetch("/delete-account", { method: "DELETE" });
      await logout();
      router.replace("/");
    } catch (error) {
      if (error instanceof AuthClientError) {
        setDeleteError(error.message || "Failed to delete account.");
      } else {
        setDeleteError(getErrorMessage(error, "Failed to delete account."));
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className={cardClass}>
      <h3 className={titleClass}>Delete account</h3>
      <p className={subtitleClass}>
        Account will be closed. Saved competitions will be removed. Comments stay and will show as
        &quot;Deleted user&quot;. This cannot be undone.
      </p>

      <div className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <label
            htmlFor="delete-account-confirmation"
            className="text-sm font-medium text-[var(--vr-danger-text)]"
          >
            Type DELETE to confirm
          </label>
          <input
            id="delete-account-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className={cn(
              "h-11 w-full rounded-xl border border-[var(--vr-danger-border)] bg-rr-surface px-4 text-sm text-rr-primary outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--vr-danger-border)]/50",
            )}
            autoComplete="off"
            inputMode="text"
          />
        </div>

        {deleteError ? (
          <div
            role="alert"
            className="rounded-xl border border-[var(--vr-danger-border)] bg-rr-surface px-4 py-2.5 text-sm text-[var(--vr-danger-text)]"
          >
            {deleteError}
          </div>
        ) : null}

        <div className="flex items-center justify-end">
          <Button
            onClick={handleDelete}
            disabled={!canDelete || isDeleting}
            className="border border-transparent bg-[var(--vr-danger-text)] text-white hover:opacity-90"
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </Button>
        </div>
      </div>
    </section>
  );
}
