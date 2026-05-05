import Link from "next/link";

import { TopupWizard } from "@/components/dashboard/topup-wizard";
import { Button } from "@/components/ui/button";

export default function TopupPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Top Up Saldo
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Isi saldo secara manual
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Transfer ke rekening tujuan, upload bukti, lalu tunggu tim kami verifikasi.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard/topup/history">Lihat Status Top Up</Link>
        </Button>
      </div>

      <TopupWizard />
    </div>
  );
}
