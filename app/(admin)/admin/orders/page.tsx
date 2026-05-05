import { SyncOrdersButton } from "@/components/admin/action-forms";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { createClient } from "@/lib/supabase/server";

type AdminOrdersPageProps = {
  searchParams?: {
    status?: string;
    platform?: string;
    q?: string;
  };
};

type AdminOrderRow = {
  id: string;
  created_at: string;
  target: string;
  price_total: number;
  quantity: number;
  status: string;
  profiles: { full_name: string | null; email: string } | null;
  services: { name: string; platform: string } | null;
};

type AdminOrderRawRow = Omit<AdminOrderRow, "profiles" | "services"> & {
  profiles: { full_name: string | null; email: string } | { full_name: string | null; email: string }[] | null;
  services: { name: string; platform: string } | { name: string; platform: string }[] | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const supabase = createClient();
  const status = searchParams?.status || "all";
  const platform = searchParams?.platform || "all";
  const query = searchParams?.q?.trim() || "";

  let request = supabase
    .from("orders")
    .select(
      "id, created_at, target, price_total, quantity, status, profiles:profiles(full_name, email), services:services(name, platform)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") request = request.eq("status", status);
  if (query) request = request.ilike("target", `%${query}%`);

  const { data } = await request;
  let rows = ((data || []) as AdminOrderRawRow[]).map((row) => ({
    ...row,
    profiles: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles,
    services: Array.isArray(row.services) ? row.services[0] : row.services,
  })) as AdminOrderRow[];

  if (platform !== "all") {
    rows = rows.filter((row) => row.services?.platform === platform);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Semua Pesanan
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Monitoring semua order customer
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <SyncOrdersButton />
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-4 font-medium">Order</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Layanan</th>
                <th className="pb-4 font-medium">Target</th>
                <th className="pb-4 font-medium">Jumlah</th>
                <th className="pb-4 font-medium">Biaya</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                    #{row.id.slice(0, 8)}
                  </td>
                  <td className="py-4 pr-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-950">{row.profiles?.full_name || "-"}</p>
                    <p>{row.profiles?.email || "-"}</p>
                  </td>
                  <td className="py-4 pr-4 text-sm text-slate-600">
                    {row.services?.name || "-"}
                  </td>
                  <td className="py-4 pr-4 text-sm text-slate-600">{row.target}</td>
                  <td className="py-4 pr-4 text-sm text-slate-600">
                    {row.quantity.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                    {formatRupiah(row.price_total)}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
