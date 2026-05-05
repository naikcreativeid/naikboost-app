import {
  Headset,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
  Timer,
  WalletCards,
} from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";

const trustItems = [
  {
    title: "Akun tetap jadi milik kamu",
    text: "Kami tidak minta password akun untuk mulai order.",
    icon: LockKeyhole,
  },
  {
    title: "Proses dibuat rapi",
    text: "Alurnya jelas dari pilih layanan sampai pesanan diproses.",
    icon: ShieldCheck,
  },
  {
    title: "Dukungan responsif",
    text: "Kalau ada yang mau ditanya, tim kami siap bantu dengan bahasa yang mudah dimengerti.",
    icon: Headset,
  },
  {
    title: "Pengerjaan cepat",
    text: "Cocok buat kamu yang lagi butuh dorongan di waktu yang mepet.",
    icon: Timer,
  },
  {
    title: "Ada refill untuk layanan tertentu",
    text: "Jadi kamu tidak perlu cemas berlebihan setelah order selesai.",
    icon: RefreshCcw,
  },
  {
    title: "Harga mudah dipahami",
    text: "Paket dibuat simpel supaya kamu tahu apa yang didapat sejak awal.",
    icon: WalletCards,
  },
];

export function Trust() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Kenapa Aman"
          title="Tenang, akun kamu aman"
          description="NaikBoost dirancang untuk orang yang butuh hasil, tapi tetap ingin proses yang nyaman dan tidak membingungkan."
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
