import { formatDistance } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { AdminOverviewCards } from "@/components/admin/admin-overview-cards";
import { createClient } from "@/lib/supabase/server";
import { getBalance } from "@/lib/api/irvankede";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default async function AdminOverviewPage() {
  const supabase = createClient();
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);

  const [
    customersResult,
    ordersTodayResult,
    revenueTodayResult,
    topupsResult,
    guestOrdersResult,
    ticketsResult,
    recentOrders,
    recentTopups,
    recentTickets,
    irvanKedeBalance,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startToday.toISOString()),
    supabase
      .from("orders")
      .select("price_total")
      .gte("created_at", startToday.toISOString()),
    supabase.from("topups").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("guest_orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["waiting_payment", "payment_review"]),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("orders")
      .select("id, created_at, status, price_total, profiles:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("topups")
      .select("id, created_at, amount, sender_name")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("support_tickets")
      .select("id, created_at, subject, status")
      .order("created_at", { ascending: false })
      .limit(3),
    getBalance().catch(() => ({ balance: "Tidak tersedia" })),
  ]);

  const revenueToday = (revenueTodayResult.data || []).reduce(
    (sum, item) => sum + (item.price_total || 0),
    0,
  );

  const activities = [
    ...((recentOrders.data || []).map((item) => ({
      id: `order-${item.id}`,
      time: item.created_at,
      text: `Order baru masuk dengan nilai ${formatRupiah(item.price_total || 0)}.`,
    })) as { id: string; time: string; text: string }[]),
    ...((recentTopups.data || []).map((item) => ({
      id: `topup-${item.id}`,
      time: item.created_at,
      text: `Top up baru ${formatRupiah(item.amount || 0)} dari ${item.sender_name}.`,
    })) as { id: string; time: string; text: string }[]),
    ...((recentTickets.data || []).map((item) => ({
      id: `ticket-${item.id}`,
      time: item.created_at,
      text: `Tiket support baru: ${item.subject}.`,
    })) as { id: string; time: string; text: string }[]),
  ]
    .sort((a, b) => +new Date(b.time) - +new Date(a.time))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <AdminOverviewCards
        customers={customersResult.count || 0}
        ordersToday={ordersTodayResult.count || 0}
        revenueToday={revenueToday}
        irvanKedeBalance={String(irvanKedeBalance.balance || "0")}
        pendingTopups={topupsResult.count || 0}
        pendingGuestOrders={guestOrdersResult.count || 0}
        openTickets={ticketsResult.count || 0}
      />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Aktivitas terbaru</h2>
        <div className="mt-6 space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">{activity.text}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatDistance(new Date(activity.time), new Date(), {
                  addSuffix: true,
                  locale: localeId,
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
