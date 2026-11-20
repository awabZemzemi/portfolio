import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile } from "@/config/portfolio";
import "./globals.css";

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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
