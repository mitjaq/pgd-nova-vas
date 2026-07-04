import type { Metadata } from "next";
import "./globals.css";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "PGD Nova vas pri Markovcih",
    template: "%s | PGD Nova vas",
  },
  description: "Prostovoljno gasilsko društvo Nova vas pri Markovcih — skupaj varujemo skupnost.",
  keywords: ["gasilci", "PGD", "Nova vas", "Markovci", "prostovoljci"],
  openGraph: {
    type: "website",
    locale: "sl_SI",
    siteName: "PGD Nova vas pri Markovcih",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sl" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
