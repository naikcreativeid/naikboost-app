import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "NaikBoost - Algorithm Boost Service untuk Bisnis & Creator Serius",
  description:
    "Tingkatkan engagement Instagram, TikTok, YouTube, dan Facebook bisnismu. Layanan boost yang aman, cepat, dan bergaransi. Bagian dari NaikGroup.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
