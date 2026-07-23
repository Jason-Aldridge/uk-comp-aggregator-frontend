"use client";

import type { ReactNode } from "react";
import { trackOperatorClick } from "@/lib/api";
import { pushEvent } from "@/lib/analytics";
import { getAnonIdForTracking } from "@/lib/anon-id";

type Props = {
  operatorId: string;
  operator: string;
  href: string;
  className?: string;
  children: ReactNode;
};

export function TrackedOperatorLink({
  operatorId,
  operator,
  href,
  className,
  children,
}: Props) {
  const handleClick = () => {
    getAnonIdForTracking();
    pushEvent("outbound_click", {
      operator,
      source: "operator_profile",
      competition: null,
    });
    void trackOperatorClick(operatorId, "operator_profile").catch(
      () => undefined,
    );
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
