"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type ViewAllLinkProps = ComponentProps<typeof Link>;

export function ViewAllLink({ onClick, ...props }: ViewAllLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  return <Link {...props} scroll onClick={handleClick} />;
}