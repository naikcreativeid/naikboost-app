import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <SearchX className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Link yang kamu buka mungkin sudah berubah, salah ketik, atau memang belum
          tersedia.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild className="rounded-full bg-brand text-white hover:bg-brand-600">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
