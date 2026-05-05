import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "Rp 49.000",
    description: "Cocok buat coba dulu dan lihat bagaimana layanan ini bekerja.",
    features: [
      "Untuk kebutuhan dasar",
      "Proses cepat",
      "Support ramah",
      "Cocok untuk satu campaign kecil",
    ],
  },
  {
    name: "Popular",
    price: "Rp 199.000",
    description: "Pilihan favorit untuk bisnis dan creator yang ingin hasil lebih terasa.",
    features: [
      "Value paling seimbang",
      "Cocok untuk promo dan launching",
      "Prioritas proses lebih nyaman",
      "Garansi refill pada layanan tertentu",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "Rp 349.000",
    description: "Untuk akun yang butuh dorongan lebih besar di momen penting.",
    features: [
      "Untuk kebutuhan lebih serius",
      "Cocok buat akun aktif",
      "Siap untuk campaign lebih besar",
      "Pendampingan lebih tenang saat order",
    ],
  },
];

export function Pricing() {
  return (
    <section id="harga" className="bg-slate-50 py-20 sm:py-24">
      <div className="container space-y-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Harga
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Paket simpel, tinggal pilih sesuai target kamu
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Tidak perlu bingung baca tabel yang rumit. Kami susun paketnya supaya
            kamu cepat ambil keputusan.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm",
                plan.highlighted &&
                  "border-brand bg-brand text-white shadow-2xl shadow-brand-300/30",
              )}
            >
              {plan.highlighted ? (
                <div className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Paling Dipilih
                </div>
              ) : null}
              <p
                className={cn(
                  "text-sm font-semibold uppercase tracking-[0.2em] text-brand-600",
                  plan.highlighted && "text-brand-100",
                )}
              >
                {plan.name}
              </p>
              <p className="mt-4 text-4xl font-black">{plan.price}</p>
              <p
                className={cn(
                  "mt-4 text-sm leading-7 text-slate-600",
                  plan.highlighted && "text-brand-50",
                )}
              >
                {plan.description}
              </p>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-600",
                        plan.highlighted && "bg-white/15 text-white",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-7 text-slate-700",
                        plan.highlighted && "text-white",
                      )}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                variant={plan.highlighted ? "secondary" : "default"}
                className={cn(
                  "mt-8 w-full rounded-full",
                  plan.highlighted
                    ? "bg-white text-brand hover:bg-brand-50"
                    : "bg-brand text-white hover:bg-brand-600",
                )}
              >
                <Link href="/register">Mulai Sekarang</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
