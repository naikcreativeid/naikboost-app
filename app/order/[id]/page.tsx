import Link from "next/link";
import { notFound } from "next/navigation";

import { GuestCheckoutForm } from "@/components/order/guest-checkout-form";
import { createClient } from "@/lib/supabase/server";

type PackageRow = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string | null;
  delivery_time: string | null;
  bonus_description: string | null;
  is_featured: boolean;
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

export default async function GuestOrderPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("packages")
    .select(
      "id, name, quantity, price, description, delivery_time, bonus_description, is_featured, service:services(name, refill_days)",
    )
    .eq("id", params.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) notFound();

  const row = data as PackageRow;
  const service = Array.isArray(row.service) ? row.service[0] : row.service;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-black text-white">
              NB
            </div>
            <div>
              <p className="font-bold text-slate-950">NaikBoost</p>
              <p className="text-sm text-slate-500">Checkout</p>
            </div>
          </Link>
        </header>

        <GuestCheckoutForm
          packageData={{
            id: row.id,
            name: row.name,
            quantity: row.quantity,
            price: row.price,
            description: row.description,
            delivery_time: row.delivery_time,
            bonus_description: row.bonus_description,
            is_featured: row.is_featured,
            service,
          }}
        />
      </div>
    </div>
  );
}
