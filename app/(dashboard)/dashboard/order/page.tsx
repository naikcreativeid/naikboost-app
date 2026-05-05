import { createClient } from "@/lib/supabase/server";
import { OrderPageClient } from "@/components/dashboard/order-page-client";

type ServiceRow = {
  id: string;
  name: string;
  category: string;
  platform: string;
  type: string;
  price_sell: number;
  min_qty: number;
  max_qty: number;
  refill_days: number;
  description: string | null;
};

type OrderPageProps = {
  searchParams?: {
    service?: string;
  };
};

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: services }] = await Promise.all([
    supabase.from("profiles").select("balance").eq("id", user.id).single(),
    supabase
      .from("services")
      .select("id, name, category, platform, type, price_sell, min_qty, max_qty, refill_days, description")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("category", { ascending: true })
      .limit(200),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Pesan Layanan
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Mulai order baru
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Pilih layanan, isi target, lalu tentukan jumlah yang kamu butuhkan. Semua
          proses order akan berjalan dari server supaya tetap aman.
        </p>
      </div>

      <OrderPageClient
        services={((services || []) as ServiceRow[])}
        balance={profile?.balance || 0}
        initialServiceId={searchParams?.service}
      />
    </div>
  );
}
