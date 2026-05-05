import { ProcessGuestOrderButton, RejectGuestOrderForm } from "@/components/admin/action-forms";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { createClient } from "@/lib/supabase/server";

type GuestOrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string | null;
  customer_whatsapp: string;
  target: string;
  total_price: number;
  status: string;
  admin_notes: string | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default async function AdminGuestOrdersPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("guest_orders")
    .select("id, created_at, customer_name, customer_email, customer_whatsapp, target, total_price, status, admin_notes")
    .in("status", ["waiting_payment", "payment_review"])
    .order("created_at", { ascending: true })
    .limit(50);

  const rows = ((data || []) as GuestOrderRow[]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Guest Orders
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Approval guest order
        </h2>
      </div>

      <div className="grid gap-5">
        {rows.map((row) => (
          <div key={row.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-950">{row.customer_name}</h3>
                  <StatusBadge status={row.status === "waiting_payment" ? "pending" : "processing"} />
                </div>
                <p className="text-sm text-slate-500">{row.customer_email || "-"}</p>
                <p className="text-sm text-slate-500">{row.customer_whatsapp}</p>
                <p className="text-sm text-slate-600">Target: {row.target}</p>
                <p className="text-lg font-black text-slate-950">{formatRupiah(row.total_price)}</p>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <ProcessGuestOrderButton guestOrderId={row.id} />
                <RejectGuestOrderForm guestOrderId={row.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
