import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GuestOrderSuccessPage({
  searchParams,
}: {
  searchParams?: { order_id?: string };
}) {
  const orderId = searchParams?.order_id || "-";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-500" />
        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
          Pesanan kamu udah masuk!
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Tim kami akan verifikasi pembayaran dalam 1x24 jam. Setelah disetujui,
          followers akan mulai masuk dalam 6-24 jam.
        </p>

        <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Order ID</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{orderId}</p>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-brand-200 bg-brand-50 p-5 text-left">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-brand-700" />
            <div>
              <p className="font-semibold text-brand-900">
                Kami juga udah bikinin akun NaikBoost untuk kamu
              </p>
              <p className="mt-2 text-sm leading-7 text-brand-900/90">
                Cek email kamu untuk info login. Order berikutnya bisa pakai saldo,
                jadi prosesnya lebih cepat dan lebih hemat.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-full bg-brand text-white hover:bg-brand-600">
            <Link href="/login">Cek Email</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/track/${orderId}`}>Tracking Pesanan</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
