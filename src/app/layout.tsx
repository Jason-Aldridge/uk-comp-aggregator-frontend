import "@fontsource/inter/latin.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark font-sans">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
