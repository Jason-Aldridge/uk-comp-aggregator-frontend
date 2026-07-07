import "@fontsource/inter/latin.css";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "RaffleRadar",
  description: "Find the best UK prize draws in one place.",
  icons: {
    icon: "/favnew.svg",
    shortcut: "/favnew.svg",
  },
};

const themeInitScript = `try{const storedTheme=window.localStorage.getItem("theme");const theme=storedTheme==="light"||storedTheme==="dark"?storedTheme:"dark";document.documentElement.classList.toggle("dark",theme==="dark");}catch{document.documentElement.classList.add("dark");}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans dark" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
