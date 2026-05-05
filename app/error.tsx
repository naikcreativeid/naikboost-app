"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[GlobalError]", error);

  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
              Waduh, ada gangguan sebentar
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Halaman ini lagi bermasalah di sisi server. Coba muat ulang dulu ya. Kalau
              masih muncul, balik ke beranda atau hubungi tim NaikBoost.
            </p>
            {error.digest ? (
              <p className="mt-4 text-xs text-slate-400">Ref error: {error.digest}</p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                onClick={reset}
                className="rounded-full bg-brand text-white hover:bg-brand-600"
              >
                Coba Lagi
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">Balik ke Beranda</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
