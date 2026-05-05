"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistance } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type OrdersTableItem = {
  id: string;
  created_at: string;
  target: string;
  quantity: number;
  price_total: number;
  status: string;
  start_count: number | null;
  remains: number | null;
  irvankede_order_id: string | null;
  notes: string | null;
  service: {
    name: string;
    refill_days: number;
  } | null;
  can_refill: boolean;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function truncateTarget(target: string) {
  return target.length > 36 ? `${target.slice(0, 36)}...` : target;
}

export function OrdersTable({ orders }: { orders: OrdersTableItem[] }) {
  const [activeOrder, setActiveOrder] = useState<OrdersTableItem | null>(null);
  const [refillOrder, setRefillOrder] = useState<OrdersTableItem | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-4 font-medium">ID</th>
              <th className="pb-4 font-medium">Tanggal</th>
              <th className="pb-4 font-medium">Layanan</th>
              <th className="pb-4 font-medium">Target</th>
              <th className="pb-4 font-medium">Jumlah</th>
              <th className="pb-4 font-medium">Biaya</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 align-top last:border-b-0">
                <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-600">
                  {formatDistance(new Date(order.created_at), new Date(), {
                    addSuffix: true,
                    locale: localeId,
                  })}
                </td>
                <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                  {order.service?.name || "Layanan"}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-600">{truncateTarget(order.target)}</td>
                <td className="py-4 pr-4 text-sm text-slate-600">
                  {order.quantity.toLocaleString("id-ID")}
                </td>
                <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                  {formatRupiah(order.price_total)}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setActiveOrder(order)}
                    >
                      Detail
                    </Button>
                    {order.can_refill ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => setRefillOrder(order)}
                      >
                        Refill
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!activeOrder} onOpenChange={(open) => !open && setActiveOrder(null)}>
        <DialogContent className="rounded-[2rem]">
          {activeOrder ? (
            <>
              <DialogHeader>
                <DialogTitle>Detail Pesanan</DialogTitle>
                <DialogDescription>
                  Ringkasan lengkap untuk pesanan #{activeOrder.id.slice(0, 8)}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 text-sm text-slate-600">
                <div>
                  <p className="text-slate-500">Layanan</p>
                  <p className="font-semibold text-slate-950">{activeOrder.service?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Target</p>
                  <p className="break-all font-semibold text-slate-950">{activeOrder.target}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Jumlah</p>
                    <p className="font-semibold text-slate-950">
                      {activeOrder.quantity.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Biaya</p>
                    <p className="font-semibold text-slate-950">
                      {formatRupiah(activeOrder.price_total)}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Start count</p>
                    <p className="font-semibold text-slate-950">
                      {activeOrder.start_count?.toLocaleString("id-ID") || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Sisa</p>
                    <p className="font-semibold text-slate-950">
                      {activeOrder.remains?.toLocaleString("id-ID") || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={activeOrder.status} />
                  <Button asChild className="rounded-full bg-brand text-white hover:bg-brand-600">
                    <Link href={`/dashboard/orders/${activeOrder.id}`}>Buka halaman detail</Link>
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={!!refillOrder} onOpenChange={(open) => !open && setRefillOrder(null)}>
        <DialogContent className="rounded-[2rem]">
          {refillOrder ? (
            <>
              <DialogHeader>
                <DialogTitle>Refill Garansi</DialogTitle>
                <DialogDescription>
                  Pesanan ini memenuhi syarat refill. Kamu bisa lanjut dari halaman detail pesanan.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm text-slate-600">
                <p>
                  Layanan <span className="font-semibold text-slate-950">{refillOrder.service?.name}</span> masih punya masa garansi refill.
                </p>
                <Button asChild className="rounded-full bg-brand text-white hover:bg-brand-600">
                  <Link href={`/dashboard/orders/${refillOrder.id}`}>Lihat detail pesanan</Link>
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
