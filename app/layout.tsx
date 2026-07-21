import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], variable: "--font-nunito", display: "swap" });
const nunitoSans = Nunito_Sans({ subsets: ["latin"], weight: ["300", "400", "600", "700", "800", "900"], variable: "--font-nunito-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Vivo — Get your time back without letting go of your business", template: "%s · Vivo" },
  description: "Vivo builds and operates a dedicated nearshore team plus a technology command center for U.S. owner-operators in Home Services, NEMT / Student Transportation, and 3PL / Logistics.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://govivo.ai"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${nunitoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
