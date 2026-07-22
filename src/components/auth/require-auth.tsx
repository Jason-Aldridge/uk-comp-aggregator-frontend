"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== "unauthenticated") {
      return;
    }

    const next = pathname && pathname.startsWith("/") ? pathname : "/";
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [pathname, router, status]);

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
