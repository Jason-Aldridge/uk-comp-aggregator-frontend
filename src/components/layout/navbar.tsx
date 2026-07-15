"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconMenu2, IconMoon, IconSun, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/contexts/auth-context";
import { CompetitionSearch } from "@/components/layout/competition-search";
import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";

function getInitials(value: string): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "?";

  const first = parts[0]?.[0] ?? "";
  const second = (parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1]) ?? "";

  return (first + second).toUpperCase() || "?";
}

export function Navbar() {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompetitionsActive =
    pathname === "/competitions" || pathname.startsWith("/competitions/");
  const isOperatorsActive = pathname === "/operators" || pathname.startsWith("/operators/");
  const isReviewsActive = pathname === "/reviews" || pathname.startsWith("/reviews/");
  const isBlogActive = pathname === "/blog" || pathname.startsWith("/blog/");

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const onChange = () => {
      if (media.matches) setMenuOpen(false);
    };

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const label = user?.displayName?.trim() || user?.email || "";
  const initials = label ? getInitials(label.includes("@") ? label.split("@")[0] : label) : "";
  const showAuthButtons = false;

  return (
    <div className="relative">
      <div className="mt-2 bg-rr-surface">
        <nav className="flex h-[52px] items-center gap-3 px-5">
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2.5 text-rr-primary no-underline"
            aria-label="RaffleRadar home"
          >
            <span className="relative block h-11 w-11 shrink-0">
              <Image
                src="/logo-dark.svg"
                alt="RaffleRadar"
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 dark:hidden"
                priority
              />
              <Image
                src="/logo-light.svg"
                alt="RaffleRadar"
                width={44}
                height={44}
                className="hidden h-11 w-11 shrink-0 dark:block"
                priority
              />
            </span>
            <span className="text-sm font-semibold tracking-[-0.3px] sm:text-base">
              RAFFLE<span className="text-rr-green">RADAR</span>
            </span>
          </Link>

          <div className="hidden min-w-0 sm:block sm:flex-1 max-w-[420px] md:max-w-[520px]">
            <CompetitionSearch />
          </div>

          <div className="hidden md:ml-8 md:flex md:gap-1 ml-4">
          <Link
            href="/competitions"
            aria-current={isCompetitionsActive ? "page" : undefined}
            className={cn(
              "text-sm px-3 py-2 rounded-md no-underline whitespace-nowrap",
              isCompetitionsActive
                ? "bg-rr-green text-rr-on-accent"
                : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
            )}
          >
            Competitions
          </Link>
          <Link
            href="/operators"
            aria-current={isOperatorsActive ? "page" : undefined}
            className={cn(
              "text-sm px-3 py-2 rounded-md no-underline whitespace-nowrap",
              isOperatorsActive
                ? "bg-rr-green text-rr-on-accent"
                : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
            )}
          >
            Operators
          </Link>
          <Link
            href="/reviews"
            aria-current={isReviewsActive ? "page" : undefined}
            className={cn(
              "text-sm px-3 py-2 rounded-md no-underline whitespace-nowrap",
              isReviewsActive
                ? "bg-rr-green text-rr-on-accent"
                : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
            )}
          >
            Reviews
          </Link>
          <Link
            href="/blog"
            aria-current={isBlogActive ? "page" : undefined}
            className={cn(
              "text-sm px-3 py-2 rounded-md no-underline whitespace-nowrap",
              isBlogActive
                ? "bg-rr-green text-rr-on-accent"
                : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
            )}
          >
            Blog
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline whitespace-nowrap"
          >
            How it works
          </Link>
        </div>

          <div className="ml-auto shrink-0 flex items-center gap-2">
          <Button
            variant="icon"
            className="shrink-0 cursor-pointer"
            aria-label="Toggle theme"
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            <IconSun size={18} className="hidden dark:block" />
            <IconMoon size={18} className="block dark:hidden" />
          </Button>

          <Button
            variant="icon"
            className="shrink-0 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-rr-green-bg border-2 border-rr-green text-rr-green flex items-center justify-center text-xs font-medium">
                {initials}
              </div>
              <span className="hidden sm:inline text-sm text-rr-secondary whitespace-nowrap">
                {user.displayName || user.email}
              </span>
            </div>
          ) : showAuthButtons ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="secondary" className="text-sm">Log in</Button>
              <Button variant="primary" className="text-sm">Sign up</Button>
            </div>
          ) : null}
          </div>
        </nav>

        <div className="w-full min-w-0 max-w-full px-4 pb-3 sm:hidden">
          <CompetitionSearch />
        </div>
      </div>

      {menuOpen ? (
        <div className="absolute left-0 right-0 top-full bg-rr-surface md:hidden z-50 shadow-lg border-t border-rr-border">
          <div className="flex flex-col gap-1 px-5 py-3">
            <Link
              href="/competitions"
              aria-current={isCompetitionsActive ? "page" : undefined}
              className={cn(
                "text-sm px-3 py-2 rounded-md no-underline",
                isCompetitionsActive
                  ? "bg-rr-green text-rr-on-accent"
                  : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
              )}
              onClick={() => setMenuOpen(false)}
            >
              Competitions
            </Link>
            <Link
              href="/operators"
              aria-current={isOperatorsActive ? "page" : undefined}
              className={cn(
                "text-sm px-3 py-2 rounded-md no-underline",
                isOperatorsActive
                  ? "bg-rr-green text-rr-on-accent"
                  : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
              )}
              onClick={() => setMenuOpen(false)}
            >
              Operators
            </Link>
            <Link
              href="/reviews"
              aria-current={isReviewsActive ? "page" : undefined}
              className={cn(
                "text-sm px-3 py-2 rounded-md no-underline",
                isReviewsActive
                  ? "bg-rr-green text-rr-on-accent"
                  : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
              )}
              onClick={() => setMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link
              href="/blog"
              aria-current={isBlogActive ? "page" : undefined}
              className={cn(
                "text-sm px-3 py-2 rounded-md no-underline",
                isBlogActive
                  ? "bg-rr-green text-rr-on-accent"
                  : "text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary",
              )}
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </Link>

            {!user && showAuthButtons ? (
              <div className="mt-2 grid gap-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-start text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
