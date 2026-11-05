import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";

// Self-hosted so the build does not depend on Google Fonts responding well.
const nunito = localFont({ src: "./fonts/Nunito-Variable-latin.woff2", weight: "200 1000", variable: "--font-nunito", display: "swap" });
const nunitoSans = localFont({ src: "./fonts/NunitoSans-Variable-latin.woff2", weight: "200 1000", variable: "--font-nunito-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Vivo — Get your time back without letting go of your business", template: "%s · Vivo" },
  description: "Vivo builds and operates a dedicated nearshore team plus a technology command center for U.S. owner-operators in Home Services, NEMT / Student Transportation, and 3PL / Logistics.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Vivo",
    title: "Vivo — Get your time back without letting go of your business",
    description: "Vivo builds and operates a dedicated nearshore team plus a technology command center for U.S. owner-operators in Home Services, NEMT / Student Transportation, and 3PL / Logistics.",
    images: [{ url: OG_IMAGE, alt: "Vivo" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${nunitoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
