"use client";

import { Button } from "@/components/ui/button";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

type Provider = "google" | "facebook";

function getProviderUrl(provider: Provider) {
  return `${apiUrl}/auth/${provider}`;
}

export function SocialButtons() {
  function handleClick(provider: Provider) {
    if (!apiUrl) {
      return;
    }

    window.location.href = getProviderUrl(provider);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-rr-border" />
        <span className="text-xs uppercase tracking-[0.16em] text-rr-muted">
          or
        </span>
        <div className="h-px flex-1 bg-rr-border" />
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="secondary"
          className="h-11 w-full justify-center"
          onClick={() => handleClick("google")}
          disabled={!apiUrl}
        >
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="h-11 w-full justify-center"
          onClick={() => handleClick("facebook")}
          disabled={!apiUrl}
        >
          Continue with Facebook
        </Button>
      </div>
    </div>
  );
}
