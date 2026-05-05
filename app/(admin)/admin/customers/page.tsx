import { AdjustBalanceForm } from "@/components/admin/action-forms";
import { createClient } from "@/lib/supabase/server";

type CustomerRow = {
  id: string;
  full_name: string | null;
  email: string;
  whatsapp: string | null;
  balance: number;
  created_at: string;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default async function AdminCustomersPage() {
  const supabase = createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, whatsapp, balance, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (profiles || []) as CustomerRow[];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Customer
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Data customer terdaftar
        </h2>
      </div>

      <div className="grid gap-5">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[1fr_360px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Nama</p>
                <p className="mt-1 font-semibold text-slate-950">{row.full_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-semibold text-slate-950">{row.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">WhatsApp</p>
                <p className="mt-1 font-semibold text-slate-950">{row.whatsapp || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Saldo</p>
                <p className="mt-1 font-semibold text-slate-950">{formatRupiah(row.balance)}</p>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Adjust saldo manual</p>
              <div className="mt-4">
                <AdjustBalanceForm userId={row.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
