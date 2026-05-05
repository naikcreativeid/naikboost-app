import Link from "next/link";

import { Button } from "@/components/ui/button";

type OverviewProps = {
  customers: number;
  ordersToday: number;
  revenueToday: number;
  irvanKedeBalance: string;
  pendingTopups: number;
  pendingGuestOrders: number;
  openTickets: number;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function AdminOverviewCards({
  customers,
  ordersToday,
  revenueToday,
  irvanKedeBalance,
  pendingTopups,
  pendingGuestOrders,
  openTickets,
}: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total customer</p>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {customers.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pesanan hari ini</p>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {ordersToday.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Revenue hari ini</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{formatRupiah(revenueToday)}</p>
        </div>
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] p-6 text-white shadow-sm">
          <p className="text-sm text-white/65">Saldo IrvanKede</p>
          <p className="mt-3 text-3xl font-black">{irvanKedeBalance}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            Butuh Approval
          </p>
          <p className="mt-3 text-3xl font-black text-slate-950">{pendingTopups}</p>
          <p className="mt-2 text-sm text-slate-600">Top up menunggu approval</p>
          <Button asChild className="mt-5 rounded-full bg-amber-600 text-white hover:bg-amber-700">
            <Link href="/admin/topups">Buka top up pending</Link>
          </Button>
        </div>
        <div className="rounded-[2rem] border border-brand-200 bg-brand-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">
            Guest Order
          </p>
          <p className="mt-3 text-3xl font-black text-slate-950">{pendingGuestOrders}</p>
          <p className="mt-2 text-sm text-slate-600">Guest order perlu diproses</p>
          <Button asChild className="mt-5 rounded-full bg-brand text-white hover:bg-brand-600">
            <Link href="/admin/guest-orders">Buka guest orders</Link>
          </Button>
        </div>
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Support
          </p>
          <p className="mt-3 text-3xl font-black text-slate-950">{openTickets}</p>
          <p className="mt-2 text-sm text-slate-600">Tiket belum dibalas</p>
          <Button
            asChild
            className="mt-5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Link href="/admin/tickets">Buka tiket support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
