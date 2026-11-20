import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { profile } from "@/config/portfolio";
import "./globals.css";

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], display: "swap", variable: "--font-plex-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-plex-mono" });

const title = `${profile.name} — AI Engineering Portfolio`;
export const metadata: Metadata = {
  title,
  description: profile.introduction,
  authors: [{ name: profile.name }],
  openGraph: { type: "website", title, description: profile.introduction, siteName: profile.name },
  twitter: { card: "summary", title, description: profile.introduction },
};
export const viewport: Viewport = { themeColor: "#121713", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
