import { Link2, MousePointerClick, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";

const steps = [
  {
    title: "Pilih Layanan",
    text: "Tentukan paket yang paling cocok dengan kebutuhan akun atau momen promosi kamu.",
    icon: MousePointerClick,
  },
  {
    title: "Masukkan Link",
    text: "Tempel link akun atau postingan yang mau dibantu. Form-nya simpel dan cepat diisi.",
    icon: Link2,
  },
  {
    title: "Tunggu Hasilnya",
    text: "Pesanan langsung masuk proses. Kamu tinggal tunggu pergerakannya tanpa ribet.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-slate-50 py-20 sm:py-24">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Tiga langkah yang gampang diikuti"
          description="Kami bikin alurnya sesingkat mungkin supaya orang awam pun langsung paham dari awal."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="text-5xl font-black text-slate-100">0{index + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-bold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
