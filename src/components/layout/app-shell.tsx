"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { GtmLoader } from "@/components/layout/gtm-loader";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ConsentProvider } from "@/contexts/consent-context";
import { AnonIdSync } from "@/components/layout/anon-id-sync";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ConsentProvider>
        <AnonIdSync />
        <GtmLoader />
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </ConsentProvider>
    </ThemeProvider>
  );
}
