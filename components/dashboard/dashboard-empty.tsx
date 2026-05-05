import Link from "next/link";

import { Button } from "@/components/ui/button";

export function DashboardEmpty() {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <h3 className="text-xl font-bold text-slate-950">
        Belum ada pesanan. Yuk pesan layanan pertama kamu!
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
        Begitu kamu mulai order, riwayat dan progresnya akan muncul di sini supaya
        gampang dipantau.
      </p>
      <Button asChild className="mt-6 rounded-full bg-brand text-white hover:bg-brand-600">
        <Link href="/dashboard/order">Pesan Layanan</Link>
      </Button>
    </div>
  );
}
