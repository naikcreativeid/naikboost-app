import { ChevronDown } from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";

const faqs = [
  {
    question: "Apakah saya harus kasih password akun?",
    answer:
      "Tidak. Kamu cukup kirim link akun atau postingan yang mau dibantu. Kami tidak minta password untuk proses order biasa.",
  },
  {
    question: "Berapa lama prosesnya mulai jalan?",
    answer:
      "Biasanya proses dimulai cepat setelah pesanan masuk. Waktu tepatnya bisa menyesuaikan layanan yang kamu pilih.",
  },
  {
    question: "Apakah cocok untuk bisnis kecil?",
    answer:
      "Cocok. Justru banyak bisnis kecil butuh dorongan awal supaya akun dan promonya terlihat lebih hidup.",
  },
  {
    question: "Kalau saya baru pertama kali order, bingung tidak?",
    answer:
      "Tidak perlu khawatir. Alurnya dibuat simpel dan tim kami siap bantu kalau ada bagian yang belum jelas.",
  },
  {
    question: "Apakah ada garansi refill?",
    answer:
      "Ada untuk layanan tertentu. Nanti kamu bisa lihat detailnya saat memilih paket atau tanya ke tim kami.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan yang paling sering ditanya"
          description="Kalau kamu masih ragu, mulai dari sini. Jawabannya kami buat singkat dan jelas."
        />

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm open:border-brand-200 open:shadow-lg open:shadow-brand-100/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
                <span className="text-left text-lg font-semibold text-slate-950">
                  {faq.question}
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-180 group-open:bg-brand-50 group-open:text-brand-600">
                  <ChevronDown className="h-5 w-5" />
                </span>
              </summary>
              <p className="pt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
