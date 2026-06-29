import "@fontsource/inter/latin.css";
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { PageLoaderProvider } from "@/components/ui/page-loader-context";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "RaffleRadar",
  description: "Find the best UK prize draws in one place.",
  icons: {
    icon: "/favnew.svg",
    shortcut: "/favnew.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <PageLoaderProvider>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </PageLoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
