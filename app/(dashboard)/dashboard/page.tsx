import Link from "next/link";
import { formatDistance } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowRight, TrendingUp, Wallet } from "lucide-react";

import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  target: string;
  quantity: number;
  price_total: number;
  status: string;
  remains: number | null;
  created_at: string;
  service: {
    name: string;
    platform: string;
  } | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function getProgress(order: OrderRow) {
  if (typeof order.remains === "number" && order.quantity > 0) {
    const completed = Math.max(order.quantity - order.remains, 0);
    return Math.min(Math.round((completed / order.quantity) * 100), 100);
  }

  switch (order.status) {
    case "success":
      return 100;
    case "partial":
      return 75;
    case "processing":
      return 60;
    case "pending":
      return 10;
    default:
      return 0;
  }
}

function getGrowth(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 100);
}

const featuredFallbacks = [
  { id: "instagram-followers", name: "Instagram Followers", platform: "instagram" },
  { id: "tiktok-views", name: "TikTok Views", platform: "tiktok" },
  { id: "youtube-subs", name: "YouTube Subs", platform: "youtube" },
  { id: "instagram-likes", name: "Instagram Likes", platform: "instagram" },
];

export default async function DashboardHomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [
    profileResult,
    pendingTopupResult,
    totalOrdersResult,
    monthlyOrdersResult,
    recentOrdersResult,
    successOrdersResult,
    monthSuccessOrdersResult,
    featuredServicesResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, balance")
      .eq("id", user.id)
      .single(),
    supabase
      .from("topups")
      .select("amount, created_at")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart),
    supabase
      .from("orders")
      .select("id, target, quantity, price_total, status, remains, created_at, service:services(name, platform)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select("quantity")
      .eq("user_id", user.id)
      .eq("status", "success"),
    supabase
      .from("orders")
      .select("quantity, created_at")
      .eq("user_id", user.id)
      .eq("status", "success")
      .gte("created_at", previousMonthStart),
    supabase
      .from("services")
      .select("id, name, platform")
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(4),
  ]);

  const profile = profileResult.data;
  const pendingTopup = pendingTopupResult.data;
  const recentOrders = (recentOrdersResult.data as OrderRow[] | null) || [];
  const featuredServices =
    featuredServicesResult.data && featuredServicesResult.data.length > 0
      ? [
          ...featuredServicesResult.data,
          ...featuredFallbacks.filter(
            (fallback) =>
              !featuredServicesResult.data.some(
                (service) => service.name.toLowerCase() === fallback.name.toLowerCase(),
              ),
          ),
        ]
      : featuredFallbacks;

  const totalOrders = totalOrdersResult.count || 0;
  const ordersThisMonth = monthlyOrdersResult.count || 0;
  const totalDelivered = (successOrdersResult.data || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const successRecentMonths = monthSuccessOrdersResult.data || [];
  const currentMonthDelivered = successRecentMonths
    .filter((item) => new Date(item.created_at) >= new Date(monthStart))
    .reduce((sum, item) => sum + (item.quantity || 0), 0);
  const previousMonthDelivered = successRecentMonths
    .filter((item) => new Date(item.created_at) < new Date(monthStart))
    .reduce((sum, item) => sum + (item.quantity || 0), 0);
  const deliveredGrowth = getGrowth(currentMonthDelivered, previousMonthDelivered);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        {pendingTopup ? (
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            Top up <span className="font-semibold">{formatRupiah(pendingTopup.amount)}</span>{" "}
            sedang menunggu konfirmasi.
          </div>
        ) : null}
        {(profile?.balance || 0) < 50000 ? (
          <div className="rounded-[1.5rem] border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-brand-900">
            Saldo kamu menipis, top up sekarang yuk supaya order berikutnya tetap lancar.
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#2d5cf6_0%,#1737a7_100%)] p-6 text-white shadow-xl shadow-brand-200/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/70">Saldo Saat Ini</p>
              <p className="mt-3 text-3xl font-black">
                {formatRupiah(profile?.balance || 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <Button asChild className="mt-6 rounded-full bg-white text-brand hover:bg-brand-50">
            <Link href="/dashboard/topup">Top Up</Link>
          </Button>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Pesanan</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{totalOrders}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            {ordersThisMonth} pesanan bulan ini
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Followers Didapat</p>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {totalDelivered.toLocaleString("id-ID")}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {deliveredGrowth >= 0 ? "+" : ""}
            {deliveredGrowth}% dibanding bulan lalu
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Pesan Cepat</h2>
            <p className="mt-1 text-sm text-slate-500">
              Mulai dari layanan yang paling sering dipilih customer.
            </p>
          </div>
          <Link
            href="/dashboard/order"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            Lihat semua layanan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredServices.slice(0, 4).map((service) => (
            <Link
              key={service.id}
              href={`/dashboard/order?service=${service.id}`}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-lg hover:shadow-brand-100/30"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
                {service.platform}
              </p>
              <h3 className="mt-3 text-lg font-bold text-slate-950">{service.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Pesan cepat untuk dorong performa akun tanpa langkah yang ribet.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Pesanan Terbaru</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lihat progres 5 pesanan terakhir kamu di satu tempat.
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            Lihat semua
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6">
          {recentOrders.length === 0 ? (
            <DashboardEmpty />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="pb-4 font-medium">Layanan</th>
                    <th className="pb-4 font-medium">Target</th>
                    <th className="pb-4 font-medium">Jumlah</th>
                    <th className="pb-4 font-medium">Progress</th>
                    <th className="pb-4 font-medium">Biaya</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const progress = getProgress(order);

                    return (
                      <tr key={order.id} className="border-b border-slate-100 align-top last:border-b-0">
                        <td className="py-4 pr-4">
                          <p className="font-semibold text-slate-950">
                            {order.service?.name || "Layanan"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDistance(new Date(order.created_at), new Date(), {
                              addSuffix: true,
                              locale: localeId,
                            })}
                          </p>
                        </td>
                        <td className="py-4 pr-4 text-sm text-slate-600">{order.target}</td>
                        <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                          {order.quantity.toLocaleString("id-ID")}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="w-36">
                            <div className="h-2 rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full bg-brand"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">{progress}% selesai</p>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-sm font-medium text-slate-950">
                          {formatRupiah(order.price_total)}
                        </td>
                        <td className="py-4">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
