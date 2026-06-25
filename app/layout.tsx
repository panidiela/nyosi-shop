import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyosi — Boutique en ligne",
  description:
    "Nyosi transforme ton WhatsApp et ton Facebook en boutique — tes clients commandent sans t'envoyer un seul message.",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
