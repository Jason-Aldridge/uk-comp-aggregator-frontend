"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

const SCROLL_FLAG = "rr-scroll-top-on-nav";

export function ViewAllLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
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
    try {
      window.sessionStorage.setItem(SCROLL_FLAG, "1");
    } catch {}
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  return <Link {...props} scroll onClick={handleClick} />;
}