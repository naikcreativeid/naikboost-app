import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistance } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type OrderDetailRow = {
  id: string;
  created_at: string;
  target: string;
  quantity: number;
  price_total: number;
  status: string;
  start_count: number | null;
  remains: number | null;
  notes: string | null;
  irvankede_order_id: string | null;
  service:
    | {
        name: string;
        category: string;
        platform: string;
        refill_days: number;
      }
    | {
        name: string;
        category: string;
        platform: string;
        refill_days: number;
      }[]
    | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function getProgress(quantity: number, remains: number | null, status: string) {
  if (typeof remains === "number") {
    const completed = Math.max(quantity - remains, 0);
    return Math.min(Math.round((completed / quantity) * 100), 100);
  }

  if (status === "success") return 100;
  if (status === "partial") return 75;
  if (status === "processing") return 60;
  if (status === "pending") return 10;
  return 0;
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: row } = await supabase
    .from("orders")
    .select(
      "id, created_at, target, quantity, price_total, status, start_count, remains, notes, irvankede_order_id, service:services(name, category, platform, refill_days)",
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row) {
    notFound();
  }

  const typedRow = row as OrderDetailRow;
  const service = Array.isArray(typedRow.service) ? typedRow.service[0] : typedRow.service;
  const orderAgeMs = Date.now() - new Date(row.created_at).getTime();
  const refillWindowMs = (service?.refill_days || 0) * 24 * 60 * 60 * 1000;
  const canRefill =
    ["success", "partial"].includes(row.status) &&
    (service?.refill_days || 0) > 0 &&
    orderAgeMs < refillWindowMs;
  const progress = getProgress(row.quantity, row.remains, row.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Detail Pesanan
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            #{row.id.slice(0, 8)}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Dibuat{" "}
            {formatDistance(new Date(row.created_at), new Date(), {
              addSuffix: true,
              locale: localeId,
            })}
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status={row.status} />
          {canRefill ? (
            <Button className="rounded-full bg-brand text-white hover:bg-brand-600">
              Refill
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Layanan</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{service?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Kategori</p>
              <p className="mt-2 font-semibold text-slate-950">{service?.category || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Target</p>
              <Link
                href={row.target}
                target="_blank"
                className="mt-2 block break-all font-semibold text-brand hover:underline"
              >
                {row.target}
              </Link>
            </div>
            <div>
              <p className="text-sm text-slate-500">Jumlah</p>
              <p className="mt-2 font-semibold text-slate-950">
                {row.quantity.toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Biaya</p>
              <p className="mt-2 font-semibold text-slate-950">{formatRupiah(row.price_total)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Order ID Provider</p>
              <p className="mt-2 font-semibold text-slate-950">{row.irvankede_order_id || "-"}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Progress</span>
              <span className="font-semibold text-slate-950">{progress}%</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-brand" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {row.notes ? (
            <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Catatan</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{row.notes}</p>
            </div>
          ) : null}
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Info tambahan</h3>
          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Start count</p>
              <p className="mt-1 font-semibold text-slate-950">
                {row.start_count?.toLocaleString("id-ID") || "-"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Sisa</p>
              <p className="mt-1 font-semibold text-slate-950">
                {row.remains?.toLocaleString("id-ID") || "-"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Garansi refill</p>
              <p className="mt-1 font-semibold text-slate-950">
                {service?.refill_days ? `${service.refill_days} hari` : "Tidak ada"}
              </p>
            </div>
          </div>

          {canRefill ? (
            <div className="mt-6 rounded-[1.5rem] bg-emerald-50 p-4 text-sm text-emerald-800">
              Pesanan ini masih masuk masa garansi refill. Kamu bisa lanjut ajukan refill dari sini nanti.
            </div>
          ) : null}

          <Button asChild variant="outline" className="mt-6 w-full rounded-full">
            <Link href="/dashboard/orders">Kembali ke riwayat</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
