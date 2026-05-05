import { ServiceInlineEdit, SyncServicesButton } from "@/components/admin/action-forms";
import { createClient } from "@/lib/supabase/server";

type ServiceRow = {
  id: string;
  name: string;
  category: string;
  platform: string;
  price_sell: number;
  is_active: boolean;
  is_featured: boolean;
};

export default async function AdminServicesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("services")
    .select("id, name, category, platform, price_sell, is_active, is_featured")
    .order("platform", { ascending: true })
    .order("category", { ascending: true })
    .limit(150);

  const rows = (data || []) as ServiceRow[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Pengaturan Layanan
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Kontrol service yang tampil ke customer
          </h2>
        </div>
        <SyncServicesButton />
      </div>

      <div className="grid gap-5">
        {rows.map((row) => (
          <div key={row.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                  {row.platform} • {row.category}
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-950">{row.name}</h3>
              </div>
              <ServiceInlineEdit
                serviceId={row.id}
                priceSell={row.price_sell}
                isActive={row.is_active}
                isFeatured={row.is_featured}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
