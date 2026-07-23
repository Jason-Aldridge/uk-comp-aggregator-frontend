"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

type SignInModalProps = {
  isOpen: boolean;
  onClose: (options?: { restoreFocus?: boolean }) => void;
};

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.getElementById("wishlist-sign-in-primary")?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleNavigate(path: "/login" | "/register") {
    const next =
      typeof window === "undefined"
        ? "/"
        : `${window.location.pathname}${window.location.search}`;

    onClose({ restoreFocus: false });
    router.push(`${path}?next=${encodeURIComponent(next)}`);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-rr-elevated/80 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-sign-in-title"
        aria-describedby="wishlist-sign-in-description"
        className="w-full max-w-md rounded-2xl border border-rr-border bg-rr-surface p-5 shadow-lg sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="wishlist-sign-in-title"
              className="text-lg font-semibold text-rr-primary"
            >
              Save competitions
            </h2>
            <p
              id="wishlist-sign-in-description"
              className="mt-2 text-sm leading-6 text-rr-secondary"
            >
              Saving competitions needs an account. Sign in or create one to keep
              your wishlist synced across the site.
            </p>
          </div>
          <Button
            variant="icon"
            aria-label="Close sign-in dialog"
            onClick={() => onClose()}
            className="shrink-0"
          >
            <IconX size={18} />
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleNavigate("/register")}
            className="sm:min-w-[140px]"
          >
            Create account
          </Button>
          <Button
            id="wishlist-sign-in-primary"
            type="button"
            onClick={() => handleNavigate("/login")}
            className="sm:min-w-[140px]"
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
