import type { Metadata } from "next";

import { AppProviders } from "@/core/providers/AppProviders";
import { AppShell } from "@/core/ui/layouts/AppShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Frontend da agenda de contatos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
