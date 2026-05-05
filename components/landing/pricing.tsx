import Link from "next/link";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PackagePlan = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  is_featured: boolean;
  delivery_time: string | null;
  bonus_description: string | null;
  quantity: number;
  service:
    | {
        refill_days: number;
      }
    | {
        refill_days: number;
      }[]
    | null;
};

function packageEmoji(name: string) {
  const value = name.toLowerCase();
  if (value.includes("starter")) return "🌱";
  if (value.includes("popular")) return "🔥";
  if (value.includes("premium")) return "👑";
  return "✨";
}

function quantityLabel(quantity: number) {
  return `${quantity.toLocaleString("id-ID")} Followers Instagram`;
}

function normalizePlans(data: PackagePlan[]) {
  return data.map((plan) => {
    const service = Array.isArray(plan.service) ? plan.service[0] : plan.service;

    return {
      ...plan,
      service,
      features: [
        quantityLabel(plan.quantity),
        plan.delivery_time ? `Pengiriman ${plan.delivery_time}` : "Pengiriman cepat",
        service?.refill_days
          ? `Garansi refill ${service.refill_days} hari`
          : "Tanpa langkah ribet",
        plan.bonus_description || "Followers HQ dengan profil real",
        plan.is_featured ? "Bonus: Boost postingan populer" : "CS WhatsApp",
      ],
    };
  });
}

export async function Pricing() {
  let plans: Array<
    PackagePlan & {
      service: { refill_days: number } | null;
      features: string[];
    }
  > = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      );
      const { data, error } = await supabase
        .from("packages")
        .select(
          "id, name, price, description, is_featured, delivery_time, bonus_description, quantity, service:services(refill_days)",
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(3);

      if (error) {
        console.error("[Pricing] fetch packages failed", error);
      } else {
        plans = normalizePlans((data || []) as PackagePlan[]);
      }
    } catch (error) {
      console.error("[Pricing] unexpected error", error);
    }
  }

  return (
    <section id="harga" className="bg-[#f5f8ff] py-20 sm:py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1330]">
            Harga{" "}
            <span className="font-serif font-normal italic text-brand">Transparan</span>,
            Tanpa Biaya Tersembunyi
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] text-[#4a5680]">
            Pilih paket yang cocok buat kamu. Bisa upgrade kapan aja.
          </p>
        </div>

        {plans.length > 0 ? (
          <>
            <div className="mx-auto grid max-w-[1000px] gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col rounded-[18px] border border-[#e6ecf7] bg-white p-7",
                    plan.is_featured &&
                      "translate-y-[-4px] border-2 border-brand shadow-[0_20px_50px_-12px_rgba(45,92,246,0.18)]",
                  )}
                >
                  {plan.is_featured ? (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold tracking-[0.05em] text-white">
                      PALING POPULER
                    </div>
                  ) : null}

                  <p className="text-[14px] font-bold text-[#0a1330]">
                    {packageEmoji(plan.name)} {plan.name}
                  </p>
                  <p className="mt-1 min-h-9 text-[13px] text-[#8590b0]">
                    {plan.description || "Paket simpel untuk bantu akun kamu terlihat lebih siap."}
                  </p>

                  <div className="mt-5 text-[32px] font-extrabold tracking-[-0.02em] text-[#0a1330]">
                    <span className="mr-0.5 text-[18px] text-[#8590b0]">Rp</span>
                    {plan.price.toLocaleString("id-ID")}
                  </div>
                  <p className="mt-1 text-[13px] text-[#8590b0]">sekali bayar</p>

                  <ul className="mt-6 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[14px] text-[#4a5680]"
                      >
                        <span className="font-bold text-brand">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={cn(
                      "mt-6 h-auto w-full rounded-[10px] px-4 py-3 text-[15px] font-semibold",
                      plan.is_featured
                        ? "bg-brand text-white hover:bg-[#1e44d4]"
                        : "border border-[#e6ecf7] bg-transparent text-[#0a1330] hover:border-[#0a1330] hover:bg-transparent",
                    )}
                    variant={plan.is_featured ? "default" : "outline"}
                  >
                    <Link href={`/order/${plan.id}`}>Pilih {plan.name}</Link>
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-[14px] text-[#8590b0]">
              Butuh paket lain untuk TikTok, YouTube, atau Facebook?{" "}
              <Link href="/dashboard/order" className="font-semibold text-brand no-underline">
                Lihat semua layanan →
              </Link>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-[1000px] rounded-[18px] border border-dashed border-[#e6ecf7] bg-white px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[#0a1330]">Paket sedang kami siapkan</p>
            <p className="mt-2 text-sm leading-7 text-[#4a5680]">
              Data paket belum tampil karena database atau environment belum lengkap.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
