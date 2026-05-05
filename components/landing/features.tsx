import {
  BadgeCheck,
  Flame,
  Gauge,
  ImageIcon,
  MessageCircleHeart,
  PlaySquare,
  TimerReset,
  Video,
} from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";

const features = [
  {
    title: "Instagram",
    text: "Bantu akun terlihat lebih aktif untuk feed, reels, atau promo yang lagi jalan.",
    icon: ImageIcon,
  },
  {
    title: "TikTok",
    text: "Cocok buat dorong konten biar lebih cepat ramai saat momen penting.",
    icon: Gauge,
  },
  {
    title: "YouTube",
    text: "Bisa dipakai untuk bantu video dan channel terlihat lebih meyakinkan.",
    icon: PlaySquare,
  },
  {
    title: "Facebook",
    text: "Tetap relevan buat bisnis lokal yang masih aktif jualan lewat Facebook.",
    icon: MessageCircleHeart,
  },
  {
    title: "Engagement Boost",
    text: "Untuk bantu postingan terasa lebih hidup dan tidak terlihat sepi.",
    icon: Flame,
  },
  {
    title: "Launching Booster",
    text: "Pas untuk dorong produk baru, campaign baru, atau momen promosi singkat.",
    icon: BadgeCheck,
  },
  {
    title: "Garansi Refill",
    text: "Layanan tertentu dilengkapi refill supaya kamu bisa lebih tenang setelah order.",
    icon: TimerReset,
  },
  {
    title: "Pengiriman Cepat",
    text: "Proses dimulai secepat mungkin tanpa bikin kamu menunggu terlalu lama.",
    icon: Video,
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Layanan"
          title="Semua yang kamu butuhkan untuk bikin akun lebih siap dilihat"
          description="Kami susun layanannya supaya gampang dipilih. Tidak perlu paham istilah ribet, cukup pilih sesuai tujuan kamu."
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
