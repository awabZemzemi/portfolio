import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { siteOrigin } from "@/config/site";
import { profile } from "@/config/portfolio";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-bricolage" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], display: "swap", variable: "--font-plex-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-plex-mono" });

const title = `${profile.name} — AI Engineering Portfolio`;
export const metadata: Metadata = {
  title,
  description: profile.introduction,
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  alternates: siteOrigin ? { canonical: "/" } : undefined,
  authors: [{ name: profile.name }],
  openGraph: { type: "website", title, description: profile.introduction, siteName: profile.name, url: siteOrigin ? "/" : undefined },
  twitter: { card: "summary", title, description: profile.introduction },
};
export const viewport: Viewport = { themeColor: "#121713", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
