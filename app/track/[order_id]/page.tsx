import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, LoaderCircle, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";

type GuestTrackRow = {
  id: string;
  created_at: string;
  status: string;
  target: string;
  total_price: number;
  customer_name: string;
  package:
    | {
        name: string;
        delivery_time: string | null;
      }
    | {
        name: string;
        delivery_time: string | null;
      }[]
    | null;
};

function getTrackingSteps(status: string) {
  const normalized = status.toLowerCase();
  return [
    {
      label: "Pesanan diterima",
      done: ["waiting_payment", "payment_review", "processing", "success"].includes(normalized),
    },
    {
      label: "Pembayaran terverifikasi",
      done: ["processing", "success"].includes(normalized),
    },
    {
      label: "Sedang diproses",
      done: ["processing", "success"].includes(normalized),
      active: normalized === "processing",
    },
    {
      label: "Followers masuk",
      done: normalized === "success",
    },
  ];
}

export default async function TrackGuestOrderPage({
  params,
}: {
  params: { order_id: string };
}) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("guest_orders")
    .select("id, created_at, status, target, total_price, customer_name, package:packages(name, delivery_time)")
    .eq("id", params.order_id)
    .maybeSingle();

  if (!data) notFound();

  const row = data as GuestTrackRow;
  const pkg = Array.isArray(row.package) ? row.package[0] : row.package;
  const steps = getTrackingSteps(row.status);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Tracking Pesanan
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Order #{row.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Hai {row.customer_name}, ini status terbaru pesanan kamu saat ini.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Paket</p>
              <p className="mt-2 font-semibold text-slate-950">{pkg?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Target</p>
              <p className="mt-2 break-all font-semibold text-slate-950">{row.target}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {steps.map((step) => (
              <div
                key={step.label}
                className={`flex items-center gap-3 rounded-[1.5rem] px-4 py-4 ${
                  step.done ? "bg-emerald-50" : "bg-slate-50"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : step.active ? (
                  <LoaderCircle className="h-5 w-5 animate-spin text-brand-600" />
                ) : (
                  <Clock3 className="h-5 w-5 text-slate-400" />
                )}
                <span className={`font-medium ${step.done ? "text-emerald-900" : "text-slate-600"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-brand-50 p-4 text-sm text-brand-900">
            Estimasi selesai: {pkg?.delivery_time || "6-24 jam setelah pembayaran diverifikasi"}.
          </div>
        </div>

        <Button asChild className="h-12 w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
          <Link href="https://wa.me/6280000000000" target="_blank">
            <MessageCircle className="h-4 w-4" />
            Contact CS
          </Link>
        </Button>
      </div>
    </div>
  );
}
