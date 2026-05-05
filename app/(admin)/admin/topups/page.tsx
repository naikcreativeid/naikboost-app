import { formatDistance } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { ApproveTopupButton, RejectTopupForm } from "@/components/admin/action-forms";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/dashboard/status-badge";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

type TopupRow = {
  id: string;
  created_at: string;
  amount: number;
  bank_destination: string;
  status: string;
  sender_name: string;
  proof_image_url: string | null;
  profiles: {
    full_name: string | null;
    email: string;
    whatsapp: string | null;
    balance: number;
  } | null;
};

type TopupRawRow = Omit<TopupRow, "profiles"> & {
  profiles:
    | {
        full_name: string | null;
        email: string;
        whatsapp: string | null;
        balance: number;
      }
    | {
        full_name: string | null;
        email: string;
        whatsapp: string | null;
        balance: number;
      }[]
    | null;
};

export default async function AdminTopupsPage() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("topups")
    .select(
      "id, created_at, amount, bank_destination, status, sender_name, proof_image_url, profiles:profiles!topups_user_id_fkey(full_name, email, whatsapp, balance)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("[AdminTopupsPage] failed", error);
  }

  const rows = ((data || []) as TopupRawRow[]).map((row) => ({
    ...row,
    profiles: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles,
  })) as TopupRow[];

  const signedRows = await Promise.all(
    rows.map(async (row) => {
      let signedUrl: string | null = null;
      if (row.proof_image_url) {
        const { data: signed } = await admin.storage
          .from("payment-proofs")
          .createSignedUrl(row.proof_image_url, 60 * 10);
        signedUrl = signed?.signedUrl || null;
      }
      return { ...row, signedUrl };
    }),
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Top Up Pending
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Approval top up customer
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Urutan paling atas adalah request paling lama supaya approval harian tetap rapi.
        </p>
      </div>

      <div className="grid gap-6">
        {signedRows.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Belum ada top up pending</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Semua request top up sudah diproses, atau data seed/pending belum masuk ke
              database.
            </p>
          </div>
        ) : (
          signedRows.map((row) => (
            <div key={row.id} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-950">
                      {row.profiles?.full_name || row.sender_name}
                    </p>
                    <p className="text-sm text-slate-500">{row.profiles?.email}</p>
                    <p className="text-sm text-slate-500">{row.profiles?.whatsapp || "-"}</p>
                  </div>
                  <StatusBadge status={row.status === "pending" ? "partial" : row.status} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Nominal</p>
                    <p className="mt-2 text-xl font-black text-slate-950">
                      {formatRupiah(row.amount)}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Bank</p>
                    <p className="mt-2 text-xl font-black text-slate-950">{row.bank_destination}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Saldo customer</p>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {formatRupiah(row.profiles?.balance || 0)}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Masuk</p>
                    <p className="mt-2 text-sm font-medium text-slate-950">
                      {formatDistance(new Date(row.created_at), new Date(), {
                        addSuffix: true,
                        locale: localeId,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {row.signedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.signedUrl}
                    alt="Bukti transfer"
                    className="max-h-80 w-full rounded-[1.5rem] border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-16 text-center text-sm text-slate-500">
                    Bukti transfer tidak tersedia.
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <ApproveTopupButton topupId={row.id} amountLabel={formatRupiah(row.amount)} />
                </div>

                <RejectTopupForm topupId={row.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
