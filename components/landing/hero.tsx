import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  { label: "Pesanan diproses cepat", value: "< 10 menit" },
  { label: "Layanan siap pakai", value: "8 kategori" },
  { label: "Dukungan ramah", value: "Setiap hari" },
];

const miniCards = [
  {
    icon: BadgeCheck,
    title: "Pesanan langsung jalan",
    text: "Begitu link masuk, sistem kami mulai proses tanpa bikin kamu bingung.",
  },
  {
    icon: ShieldCheck,
    title: "Aman untuk akun",
    text: "Metodenya dibuat supaya tetap nyaman dipakai bisnis dan creator serius.",
  },
  {
    icon: Clock3,
    title: "Cocok buat momen penting",
    text: "Launching produk, promo baru, atau konten yang mau kamu dorong lebih cepat.",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_top_left,_rgba(45,92,246,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%)]" />
      <div className="container grid gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
            <Sparkles className="h-4 w-4" />
            Bagian dari keluarga NaikGroup bersama NaikCetak
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Algorithm Boost Service untuk Bisnis & Creator Serius
            </p>
            <h1 className="max-w-3xl text-balance text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Biar akun kamu
              <span className="mx-2 font-serif font-normal italic text-brand">
                lebih ramai
              </span>
              tanpa langkah yang ribet.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-600">
              NaikBoost bantu bisnis dan creator mendorong performa konten dengan
              cara yang cepat, rapi, dan gampang dipahami. Tinggal pilih layanan,
              kirim link, lalu pantau hasilnya.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-brand px-7 text-white shadow-xl shadow-brand-500/20 hover:bg-brand-600"
            >
              <Link href="/register">
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link href="#cara-kerja">Lihat Cara Kerja</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <p className="text-2xl font-bold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-brand/10 blur-3xl" />
          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70">
            <div className="rounded-[1.6rem] bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm text-slate-300">Dashboard Singkat</p>
                  <p className="text-lg font-semibold">NaikBoost Overview</p>
                </div>
                <div className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand-100">
                  Live Process
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-brand/15 p-3 text-brand-200">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Pesanan Aktif</p>
                      <p className="text-2xl font-bold">128</p>
                    </div>
                  </div>
                  <div className="mt-5 h-28 rounded-2xl bg-[linear-gradient(180deg,rgba(45,92,246,0.35),rgba(45,92,246,0.03))] p-3">
                    <div className="flex h-full items-end gap-2">
                      {[38, 52, 44, 68, 61, 76, 88].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-full bg-brand"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {miniCards.map((card) => (
                    <div key={card.title} className="rounded-3xl bg-white/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-white/10 p-3">
                          <card.icon className="h-5 w-5 text-brand-200" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{card.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            {card.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
