import { formatDistance } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { TransactionTypeBadge, getTransactionSign } from "@/components/dashboard/transaction-type-badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type TransactionsPageProps = {
  searchParams?: {
    type?: string;
    q?: string;
  };
};

type TransactionRow = {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const type = searchParams?.type || "all";
  const query = searchParams?.q?.trim() || "";

  let request = supabase
    .from("transactions")
    .select("id, created_at, type, amount, balance_after, description")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (type !== "all") {
    request = request.eq("type", type);
  }

  if (query) {
    request = request.ilike("description", `%${query}%`);
  }

  const { data } = await request;
  const rows = ((data || []) as TransactionRow[]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Mutasi Saldo
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Semua pergerakan saldo kamu
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Lihat saldo masuk, potongan order, dan refund di satu tempat.
          </p>
        </div>

        <form className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
          <select
            name="type"
            defaultValue={type}
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none"
          >
            <option value="all">Semua Tipe</option>
            <option value="topup">Top Up</option>
            <option value="order">Pesanan</option>
            <option value="refund">Refund</option>
            <option value="adjustment">Adjustment</option>
          </select>
          <input
            name="q"
            defaultValue={query}
            placeholder="Cari keterangan..."
            className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none"
          />
          <Button type="submit" className="rounded-full bg-brand text-white hover:bg-brand-600">
            Terapkan
          </Button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        {rows.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-slate-950">Belum ada transaksi.</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Begitu kamu top up atau membuat order, mutasinya akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-4 font-medium">Tanggal</th>
                  <th className="pb-4 font-medium">Tipe</th>
                  <th className="pb-4 font-medium">Keterangan</th>
                  <th className="pb-4 font-medium">Nominal</th>
                  <th className="pb-4 font-medium">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-4 pr-4 text-sm text-slate-600">
                      {formatDistance(new Date(row.created_at), new Date(), {
                        addSuffix: true,
                        locale: localeId,
                      })}
                    </td>
                    <td className="py-4 pr-4">
                      <TransactionTypeBadge type={row.type} />
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-600">
                      {row.description || "-"}
                    </td>
                    <td className="py-4 pr-4 text-sm font-semibold text-slate-950">
                      {getTransactionSign(row.type)} {formatRupiah(Math.abs(row.amount))}
                    </td>
                    <td className="py-4 text-sm font-semibold text-slate-950">
                      {formatRupiah(row.balance_after)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
