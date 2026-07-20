import type { ReactNode } from "react";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Footer } from "@/components/layout/Footer";
import { ScrollReset } from "@/components/ui/scroll-reset";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <div className="flex min-h-screen flex-col">
        <Suspense fallback={null}>
          <ScrollReset />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </AppShell>
  );
}
