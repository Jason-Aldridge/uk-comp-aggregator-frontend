"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SCROLL_FLAG = "rr-scroll-top-on-nav";

export function ScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let flagged = false;
    try {
      flagged = window.sessionStorage.getItem(SCROLL_FLAG) === "1";
      window.sessionStorage.removeItem(SCROLL_FLAG);
    } catch {}
    if (!flagged) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, searchParams]);

  return null;
}