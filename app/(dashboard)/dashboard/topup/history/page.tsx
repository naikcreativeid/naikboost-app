import Link from "next/link";

import { TopupHistoryTable, type TopupHistoryItem } from "@/components/dashboard/topup-history-table";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type TopupRow = {
  id: string;
  created_at: string;
  transfer_date: string | null;
  amount: number;
  bank_destination: string;
  status: string;
  sender_name: string;
  proof_image_url: string | null;
};

export default async function TopupHistoryPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("topups")
    .select("id, created_at, transfer_date, amount, bank_destination, status, sender_name, proof_image_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = ((data || []) as TopupRow[]);

  const items: TopupHistoryItem[] = await Promise.all(
    rows.map(async (row) => {
      let proofSignedUrl: string | null = null;

      if (row.proof_image_url) {
        const { data: signed } = await admin.storage
          .from("payment-proofs")
          .createSignedUrl(row.proof_image_url, 60 * 10);
        proofSignedUrl = signed?.signedUrl || null;
      }

      return {
        ...row,
        proof_signed_url: proofSignedUrl,
      };
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Riwayat Top Up
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Status top up kamu
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Cek top up yang masih menunggu verifikasi atau yang sudah masuk ke saldo.
          </p>
        </div>
        <Button asChild className="rounded-full bg-brand text-white hover:bg-brand-600">
          <Link href="/dashboard/topup">Top Up Lagi</Link>
        </Button>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-slate-950">Belum ada riwayat top up.</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Mulai top up pertama kamu supaya saldo siap dipakai untuk order.
            </p>
          </div>
        ) : (
          <TopupHistoryTable items={items} />
        )}
      </div>
    </div>
  );
}
