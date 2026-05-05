import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-lg font-black text-white">
          NB
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
          Cek email kamu
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Kami sudah kirim email verifikasi. Kalau email tidak masuk, cek folder spam
          atau coba login langsung jika konfirmasi email dimatikan di Supabase kamu.
        </p>
        <Button asChild className="mt-8 rounded-full bg-brand text-white hover:bg-brand-600">
          <Link href="/login">Kembali ke Login</Link>
        </Button>
      </div>
    </div>
  );
}
