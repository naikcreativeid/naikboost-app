import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const metaItems = [
  "4.9/5 dari 1.200+ pelanggan",
  "Garansi refill",
  "Tanpa password",
];

const stats = [
  { label: "Total Order Aktif", value: "24", trend: "+12%" },
  { label: "Followers Bulan Ini", value: "18.4K", trend: "+34%" },
  { label: "Saldo", value: "Rp 2,1Jt" },
];

const chartPath =
  "M0,110 L40,100 L80,95 L120,88 L160,80 L200,75 L240,62 L280,58 L320,50 L360,42 L400,35 L440,28 L480,22 L520,15 L560,12 L600,8";

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-white pb-16 pt-20 text-center sm:pb-20 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(45,92,246,0.08),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(230,236,247,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(230,236,247,0.8)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent_70%)]" />

        <div className="container relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-[13px] font-semibold text-brand-700">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_0_3px_rgba(45,92,246,0.18)]" />
            Algorithm Boost Service #1 di Indonesia
          </div>

          <h1 className="mx-auto mt-6 max-w-5xl text-balance text-[clamp(36px,6vw,60px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0a1330]">
            Bantu Sosial Media Kamu
            <br />
            Dilihat{" "}
            <span className="font-serif text-brand italic font-normal tracking-[-0.01em]">
              Lebih Banyak
            </span>{" "}
            Orang
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-balance text-[17px] leading-8 text-[#4a5680] sm:text-[18px]">
            Konten bagus aja nggak cukup. Akun kamu butuh dorongan awal biar
            Instagram, TikTok, dan YouTube mulai nampilin konten kamu ke orang yang
            tepat.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-auto rounded-[10px] bg-brand px-7 py-3.5 text-[16px] font-semibold text-white shadow-[0_4px_14px_rgba(45,92,246,0.25)] hover:bg-[#1e44d4]"
            >
              <Link href="/register">
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto rounded-[10px] border-[#e6ecf7] px-7 py-3.5 text-[16px] font-semibold text-[#0a1330] hover:border-[#0a1330] hover:bg-transparent"
            >
              <Link href="#cara-kerja">Lihat Cara Kerjanya</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] text-[#8590b0]">
            {metaItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-brand" />
                {item}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-[920px] overflow-hidden rounded-[18px] border border-[#e6ecf7] bg-white text-left shadow-[0_20px_50px_-12px_rgba(45,92,246,0.18)]">
            <div className="flex items-center gap-2 border-b border-[#e6ecf7] bg-[#f8faff] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-4 text-[12px] text-[#8590b0] font-mono">app.naikboost.com</span>
            </div>

            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-5 sm:p-8">
              <div className="grid gap-3 md:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[10px] border border-[#e6ecf7] bg-white px-4 py-3.5"
                  >
                    <p className="text-[11px] font-medium text-[#8590b0]">{stat.label}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[18px] font-bold text-[#0a1330]">
                      <span>{stat.value}</span>
                      {stat.trend ? (
                        <span className="rounded bg-[#d1fae5] px-1.5 py-0.5 text-[11px] font-semibold text-[#10b981]">
                          {stat.trend}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[10px] border border-[#e6ecf7] bg-white p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[12px] font-semibold text-[#8590b0]">
                    Pertumbuhan Akun (30 Hari)
                  </p>
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#10b981]">
                    <span className="relative h-2 w-2 rounded-full bg-[#10b981] before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-[#10b981]" />
                    LIVE
                  </span>
                </div>

                <svg viewBox="0 0 600 130" className="h-[130px] w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="heroChartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2d5cf6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2d5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${chartPath} L600,130 L0,130 Z`}
                    fill="url(#heroChartGradient)"
                  />
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="#2d5cf6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="1000"
                    strokeDashoffset="0"
                    className="animate-[drawLine_2s_1s_ease_forwards]"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#f0f4fc] bg-[#f5f8ff] py-10">
        <div className="container">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8590b0]">
            Dipercaya oleh creator &amp; bisnis di seluruh Indonesia
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[15px] font-semibold text-[#4a5680]">
            {[
              "Jakarta",
              "Bandung",
              "Surabaya",
              "Medan",
              "Makassar",
              "Yogyakarta",
              "Semarang",
              "Bali",
              "Palembang",
            ].map((city) => (
              <span key={city} className="opacity-75">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
