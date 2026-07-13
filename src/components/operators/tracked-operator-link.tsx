"use client";

import type { ReactNode } from "react";
import { trackOperatorClick } from "@/lib/api";

type Props = {
  operatorId: string;
  href: string;
  className?: string;
  children: ReactNode;
};

export function TrackedOperatorLink({
  operatorId,
  href,
  className,
  children,
}: Props) {
  const handleClick = () => {
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
