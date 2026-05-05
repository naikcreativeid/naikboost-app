import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://naikboost.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "NaikBoost",
    template: "%s | NaikBoost",
  },
  description:
    "Tingkatkan engagement Instagram, TikTok, YouTube, dan Facebook bisnismu. Layanan boost yang aman, cepat, dan bergaransi. Bagian dari NaikGroup.",
  applicationName: "NaikBoost",
  keywords: [
    "NaikBoost",
    "social media boost",
    "instagram followers",
    "tiktok views",
    "youtube subscribers",
    "jasa engagement",
  ],
  openGraph: {
    title: "NaikBoost",
    description:
      "Algorithm Boost Service untuk Bisnis & Creator Serius. Aman, cepat, dan mudah dipakai.",
    url: appUrl,
    siteName: "NaikBoost",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NaikBoost",
    description:
      "Algorithm Boost Service untuk Bisnis & Creator Serius. Aman, cepat, dan mudah dipakai.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
