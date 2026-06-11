"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconMenu2, IconMoon, IconSearch, IconSun, IconX } from "@tabler/icons-react";
import { useAuth } from "@/contexts/auth-context";
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
  const { setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="relative">
      <nav className="flex h-[52px] items-center gap-3 px-5 bg-rr-surface">
        <span className="font-medium tracking-[-0.3px] text-rr-primary">
          RAFFLE<span className="text-rr-green">RADAR</span>
        </span>

        <div className="flex-1 max-w-[420px] md:max-w-[520px] min-w-0">
          <div className="flex h-9 items-center gap-2 rounded-md px-3 bg-rr-elevated">
            <IconSearch size={16} className="text-rr-muted" />
            <input
              type="text"
              placeholder="Search competitions..."
              className="w-full bg-transparent text-[13px] text-rr-primary placeholder:text-rr-muted outline-none"
            />
          </div>
        </div>

        <div className="hidden md:flex gap-1 ml-4 md:ml-8">
          <a
            href="#"
            className="text-[13px] px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline whitespace-nowrap"
          >
            Competitions
          </a>
          <a
            href="#"
            className="text-[13px] px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline whitespace-nowrap"
          >
            Operators
          </a>
          <a
            href="#"
            className="text-[13px] px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline whitespace-nowrap"
          >
            How it works
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="icon"
            className="cursor-pointer"
            aria-label="Toggle theme"
            onClick={() => {
              const isDark = document.documentElement.classList.contains("dark");
              setTheme(isDark ? "light" : "dark");
            }}
          >
            <IconSun size={18} className="hidden dark:block" />
            <IconMoon size={18} className="block dark:hidden" />
          </Button>

          <Button
            variant="icon"
            className="md:hidden"
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
              <span className="hidden sm:inline text-[13px] text-rr-secondary whitespace-nowrap">
                {user.displayName || user.email}
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="secondary" className="text-[13px]">Log in</Button>
              <Button variant="primary" className="text-[13px]">Sign up</Button>
            </div>
          )}
        </div>
      </nav>

      {menuOpen ? (
        <div className="absolute left-0 right-0 top-full bg-rr-surface md:hidden">
          <div className="flex flex-col gap-1 px-5 py-3">
            <a
              href="#"
              className="text-[13px] px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Competitions
            </a>
            <a
              href="#"
              className="text-[13px] px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Operators
            </a>
            <a
              href="#"
              className="text-[13px] px-3 py-2 rounded-md text-rr-secondary hover:bg-rr-elevated hover:text-rr-primary no-underline"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </a>

            {!user ? (
              <div className="mt-2 grid gap-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start text-[13px]"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-start text-[13px]"
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