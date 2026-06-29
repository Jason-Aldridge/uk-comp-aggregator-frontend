"use client";

import Link from "next/link";
import { usePageLoader } from "@/components/ui/page-loader-context";

type AccentTone = "green" | "red";

type SectionHeaderProps = {
  titleStart: string;
  titleAccent: string;
  subtitle: string;
  viewAllHref: string;
  accentTone?: AccentTone;
};

const accentToneClassMap: Record<AccentTone, string> = {
  green: "text-rr-green",
  red: "text-[#991b1b] dark:text-[#fca5a5]",
};

export function SectionHeader({
  titleStart,
  titleAccent,
  subtitle,
  viewAllHref,
  accentTone = "green",
}: SectionHeaderProps) {
  const { startLoading } = usePageLoader();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-rr-primary">
          {titleStart}{" "}
          <span className={accentToneClassMap[accentTone]}>{titleAccent}</span>
        </h2>
        <p className="mt-1 text-sm text-rr-muted">{subtitle}</p>
      </div>

      <Link
        href={viewAllHref}
        className="shrink-0 text-sm font-medium text-rr-green no-underline transition-opacity hover:opacity-80"
        onClick={() => startLoading(viewAllHref)}
      >
        View All →
      </Link>
    </div>
  );
}