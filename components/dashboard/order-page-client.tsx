"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Search, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { toast } from "sonner";

import { createOrderAction } from "@/app/(dashboard)/dashboard/order/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ServiceItem = {
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

type OrderPageClientProps = {
  services: ServiceItem[];
  balance: number;
  initialServiceId?: string;
};

const tabs = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "facebook", label: "Facebook" },
  { key: "lainnya", label: "Lainnya" },
];

const targetPatterns: Record<string, RegExp> = {
  instagram:
    /^(https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._/-]+\/?|@?[A-Za-z0-9._]{1,30})$/i,
  tiktok:
    /^(https?:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9._-]+\/?|@?[A-Za-z0-9._-]{2,50})$/i,
  youtube:
    /^(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[A-Za-z0-9._?=&/-]+)$/i,
  facebook:
    /^(https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9._?=&/-]+)$/i,
};

function formatRupiah(value: number) {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}

function getPlatformKey(platform: string) {
  return ["instagram", "tiktok", "youtube", "facebook"].includes(platform)
    ? platform
    : "lainnya";
}

export function OrderPageClient({
  services,
  balance,
  initialServiceId,
}: OrderPageClientProps) {
  const [activeTab, setActiveTab] = useState("instagram");
  const [search, setSearch] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(
    initialServiceId || services[0]?.id || "",
  );
  const [target, setTarget] = useState("");
  const [quantity, setQuantity] = useState<number>(services[0]?.min_qty || 100);
  const [isPending, startTransition] = useTransition();

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesTab = getPlatformKey(service.platform) === activeTab;
      const haystack = `${service.name} ${service.category} ${service.description || ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, services]);

  const selectedService =
    services.find((service) => service.id === selectedServiceId) || filteredServices[0] || services[0];

  const safeQuantity = selectedService
    ? Math.min(Math.max(quantity, selectedService.min_qty), selectedService.max_qty)
    : quantity;
  const totalPrice = selectedService
    ? Math.round((selectedService.price_sell * safeQuantity) / 1000)
    : 0;

  function handleSelectService(serviceId: string) {
    const service = services.find((item) => item.id === serviceId);
    if (!service) return;
    setSelectedServiceId(serviceId);
    setQuantity(service.min_qty);
  }

  function validateTarget() {
    if (!selectedService) return "Pilih layanan dulu ya.";
    if (!target.trim()) return "Target wajib diisi.";
    const pattern = targetPatterns[selectedService.platform];
    if (pattern && !pattern.test(target.trim())) {
      return "Format target belum cocok untuk platform ini.";
    }
    return null;
  }

  async function handleSubmit() {
    if (!selectedService) {
      toast.error("Pilih layanan dulu ya.");
      return;
    }

    const targetError = validateTarget();
    if (targetError) {
      toast.error(targetError);
      return;
    }

    startTransition(async () => {
      try {
        const result = await createOrderAction({
          service_id: selectedService.id,
          target: target.trim(),
          quantity: safeQuantity,
        });

        toast.success("Pesanan berhasil dibuat", {
          description: "Order kamu sedang kami kirim ke provider.",
        });
        window.location.href = `/dashboard/orders/${result.orderId}`;
      } catch (error) {
        toast.error("Pesanan belum berhasil", {
          description:
            error instanceof Error
              ? error.message
              : "Coba lagi beberapa saat lagi ya.",
        });
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Pilih layanan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Cari layanan yang paling cocok, lalu isi target dan jumlah di panel kanan.
            </p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari layanan..."
              className="rounded-full pl-10"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeTab === tab.key
                  ? "bg-brand text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {filteredServices.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              Belum ada layanan yang cocok dengan pencarian kamu.
            </div>
          ) : (
            filteredServices.map((service) => {
              const isSelected = selectedService?.id === service.id;
              const badges = [
                service.type && service.type !== "Default" ? service.type : "HQ",
                service.refill_days > 0 ? `Refill ${service.refill_days} hari` : null,
              ].filter(Boolean);

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleSelectService(service.id)}
                  className={cn(
                    "rounded-[1.5rem] border p-5 text-left transition",
                    isSelected
                      ? "border-brand bg-brand-50 shadow-lg shadow-brand-100/30"
                      : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50",
                  )}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                        {service.category}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-slate-950">{service.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {service.description || "Layanan siap dipakai untuk dorong akun kamu lebih cepat."}
                      </p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-sm text-slate-500">Harga per 1000</p>
                      <p className="mt-1 text-xl font-black text-slate-950">
                        {formatRupiah(service.price_sell)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Form Pesanan
          </p>
          {selectedService ? (
            <>
              <div className="mt-4 rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Layanan dipilih</p>
                <h3 className="mt-2 text-xl font-bold text-slate-950">{selectedService.name}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {formatRupiah(selectedService.price_sell)} per 1000
                </p>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Target
                  </label>
                  <Input
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                    placeholder="Tempel link atau username target"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Gunakan link atau username yang sesuai dengan platform layanan.
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Jumlah
                    </label>
                    <span className="text-sm text-slate-500">
                      Min {selectedService.min_qty.toLocaleString("id-ID")} • Max{" "}
                      {selectedService.max_qty.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={selectedService.min_qty}
                    max={selectedService.max_qty}
                    value={safeQuantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="w-full accent-brand"
                  />
                  <Input
                    type="number"
                    value={safeQuantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    min={selectedService.min_qty}
                    max={selectedService.max_qty}
                    className="mt-3"
                  />
                </div>

                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">Total harga</p>
                    <p className="text-2xl font-black">{formatRupiah(totalPrice)}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-white/70">Saldo saat ini</span>
                    <span>{formatRupiah(balance)}</span>
                  </div>
                  <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
                    Saldo akan terpotong otomatis setelah pesanan berhasil dibuat.
                  </div>
                </div>

                <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    Semua proses order dilakukan dari server agar data akun kamu tetap aman.
                  </div>
                  <div className="flex items-start gap-3">
                    <TimerReset className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    Kalau provider gagal, saldo akan kami kembalikan otomatis.
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    Pastikan target dan jumlah sudah benar sebelum lanjut pesan.
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending || !selectedService}
                  className="h-12 w-full rounded-full bg-brand text-white hover:bg-brand-600"
                >
                  {isPending ? "Sedang memproses..." : "Pesan Sekarang"}
                </Button>

                {balance < totalPrice ? (
                  <p className="text-center text-sm text-red-600">
                    Saldo belum cukup.{" "}
                    <Link href="/dashboard/topup" className="font-semibold underline">
                      Top up dulu
                    </Link>
                    .
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              Pilih salah satu layanan di sebelah kiri untuk mulai order.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
