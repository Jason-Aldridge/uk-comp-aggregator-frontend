"use client";

import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/cn";

type SaveHeartProps = {
  competitionId: string;
  className?: string;
  iconSize?: number;
};

export function SaveHeart({
  competitionId,
  className,
  iconSize = 20,
}: SaveHeartProps) {
  const { status } = useAuth();
  const { isLoading, isSaved, openSignInModal, toggle } = useWishlist();

  const isAuthenticated = status === "authenticated";
  const isBusy = status === "loading" || (isAuthenticated && isLoading);
  const saved = isAuthenticated && isSaved(competitionId);
  const label = isAuthenticated
    ? saved
      ? "Remove from wishlist"
      : "Save to wishlist"
    : "Sign in to save competition";

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isBusy) {
      return;
    }

    if (!isAuthenticated) {
      openSignInModal(event.currentTarget);
      return;
    }

    await toggle(competitionId);
  }

  function handleMouseDown(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  const Icon = saved ? IconHeartFilled : IconHeart;

  return (
    <Button
      variant="icon"
      aria-pressed={saved}
      aria-label={label}
      title={label}
      onClick={(event) => {
        void handleClick(event);
      }}
      onMouseDown={handleMouseDown}
      className={cn(
        "border-rr-border bg-rr-surface text-rr-primary shadow-sm hover:border-rr-green-border hover:bg-rr-elevated hover:text-rr-green",
        saved && "border-rr-green-border bg-rr-green-bg text-rr-green hover:border-rr-green hover:bg-rr-green-bg hover:text-rr-green",
        className,
      )}
    >
      <Icon size={iconSize} />
    </Button>
  );
}
