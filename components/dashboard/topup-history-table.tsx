"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type TopupHistoryItem = {
  id: string;
  created_at: string;
  transfer_date: string | null;
  amount: number;
  bank_destination: string;
  status: string;
  sender_name: string;
  proof_image_url: string | null;
  proof_signed_url: string | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function TopupStatusBadge({ status }: { status: string }) {
  const config =
    status === "approved"
      ? "bg-emerald-50 text-emerald-700"
      : status === "rejected"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";

  const label =
    status === "approved"
      ? "Approved"
      : status === "rejected"
        ? "Rejected"
        : "Pending";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config}`}>{label}</span>;
}

export function TopupHistoryTable({ items }: { items: TopupHistoryItem[] }) {
  const [activeItem, setActiveItem] = useState<TopupHistoryItem | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-4 font-medium">Tanggal</th>
              <th className="pb-4 font-medium">Nominal</th>
              <th className="pb-4 font-medium">Bank</th>
              <th className="pb-4 font-medium">Bukti</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                <td className="py-4 pr-4 text-sm text-slate-600">
                  {item.transfer_date || item.created_at.slice(0, 10)}
                </td>
                <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                  {formatRupiah(item.amount)}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-600">{item.bank_destination}</td>
                <td className="py-4 pr-4">
                  {item.proof_signed_url ? (
                    <button
                      type="button"
                      onClick={() => setActiveItem(item)}
                      className="overflow-hidden rounded-xl border border-slate-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.proof_signed_url}
                        alt="Bukti transfer"
                        className="h-14 w-14 object-cover"
                      />
                    </button>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>
                <td className="py-4 pr-4">
                  <TopupStatusBadge status={item.status} />
                </td>
                <td className="py-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setActiveItem(item)}
                    disabled={!item.proof_signed_url}
                  >
                    Lihat
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-2xl rounded-[2rem]">
          {activeItem ? (
            <>
              <DialogHeader>
                <DialogTitle>Bukti transfer</DialogTitle>
                <DialogDescription>
                  Preview bukti transfer untuk top up {formatRupiah(activeItem.amount)}.
                </DialogDescription>
              </DialogHeader>
              {activeItem.proof_signed_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeItem.proof_signed_url}
                  alt="Preview bukti transfer"
                  className="max-h-[70vh] w-full rounded-2xl object-contain"
                />
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
