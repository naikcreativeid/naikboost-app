import Link from "next/link";

import { OrdersTable, type OrdersTableItem } from "@/components/dashboard/orders-table";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type OrdersPageProps = {
  searchParams?: {
    page?: string;
    status?: string;
    q?: string;
  };
};

const pageSize = 10;

type OrdersQueryRow = Omit<OrdersTableItem, "can_refill" | "service"> & {
  service:
    | {
        name: string;
        refill_days: number;
      }
    | {
        name: string;
        refill_days: number;
      }[]
    | null;
};

function isRefillEligible(order: OrdersTableItem) {
  if (!order.service?.refill_days) return false;
  if (!["success", "partial"].includes(order.status)) return false;
  const orderAgeMs = Date.now() - new Date(order.created_at).getTime();
  const refillWindowMs = order.service.refill_days * 24 * 60 * 60 * 1000;
  return orderAgeMs < refillWindowMs;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const page = Math.max(Number(searchParams?.page || "1"), 1);
  const status = searchParams?.status || "all";
  const query = searchParams?.q?.trim() || "";

  let countQuery = supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  let rowsQuery = supabase
    .from("orders")
    .select(
      "id, created_at, target, quantity, price_total, status, start_count, remains, irvankede_order_id, notes, service:services(name, refill_days)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (status !== "all") {
    countQuery = countQuery.eq("status", status);
    rowsQuery = rowsQuery.eq("status", status);
  }

  if (query) {
    countQuery = countQuery.ilike("target", `%${query}%`);
    rowsQuery = rowsQuery.ilike("target", `%${query}%`);
  }

  const [{ count }, { data: rows }] = await Promise.all([countQuery, rowsQuery]);
  const totalPages = Math.max(Math.ceil((count || 0) / pageSize), 1);

  const normalizedRows = ((rows || []) as OrdersQueryRow[]).map((row) => ({
    ...row,
    service: Array.isArray(row.service) ? row.service[0] : row.service,
  })) as OrdersTableItem[];

  const orders = normalizedRows.map((row) => ({
    ...row,
    can_refill: isRefillEligible(row),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Riwayat Pesanan
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Semua pesanan kamu
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Filter berdasarkan status atau cari target tertentu untuk mempercepat pencarian.
          </p>
        </div>

        <form className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
          <select
            name="status"
            defaultValue={status}
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="success">Success</option>
            <option value="partial">Partial</option>
            <option value="error">Error</option>
          </select>
          <input
            name="q"
            defaultValue={query}
            placeholder="Cari target..."
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none"
          />
          <Button type="submit" className="rounded-full bg-brand text-white hover:bg-brand-600">
            Terapkan
          </Button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        {orders.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-slate-950">Belum ada hasil untuk filter ini.</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Coba ubah filter atau mulai buat pesanan baru dari halaman order.
            </p>
            <Button asChild className="mt-6 rounded-full bg-brand text-white hover:bg-brand-600">
              <Link href="/dashboard/order">Pesan Layanan</Link>
            </Button>
          </div>
        ) : (
          <>
            <OrdersTable orders={orders} />
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full"
                  disabled={page <= 1}
                >
                  <Link href={`/dashboard/orders?page=${page - 1}&status=${status}&q=${encodeURIComponent(query)}`}>
                    Sebelumnya
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full"
                  disabled={page >= totalPages}
                >
                  <Link href={`/dashboard/orders?page=${page + 1}&status=${status}&q=${encodeURIComponent(query)}`}>
                    Berikutnya
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
