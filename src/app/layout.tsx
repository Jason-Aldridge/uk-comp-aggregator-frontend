import "@fontsource/inter/latin.css";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { FilterBar } from "@/components/layout/filter-bar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <Suspense fallback={null}>
              <FilterBar />
            </Suspense>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
