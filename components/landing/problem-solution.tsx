import { CheckCircle2, CircleAlert } from "lucide-react";

import { SectionHeading } from "@/components/landing/section-heading";

const problems = [
  "Konten sudah bagus, tapi tetap sepi dan susah dilirik orang baru.",
  "Lagi ada promo atau launching, tapi pergerakannya lambat banget.",
  "Bingung cari jasa yang jelas, takut prosesnya lama dan tidak rapi.",
  "Mau akun terlihat lebih meyakinkan, tapi tidak tahu harus mulai dari mana.",
];

const solutions = [
  "Pilih layanan sesuai kebutuhan akun atau momen promosi kamu.",
  "Kirim link postingan atau akun tanpa proses yang bikin pusing.",
  "Pesanan diproses cepat dengan alur yang simpel dan mudah dipantau.",
  "Ada garansi refill untuk layanan tertentu supaya kamu lebih tenang.",
];

export function ProblemSolution() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container space-y-12">
        <SectionHeading
          eyebrow="Masalah Umum"
          title="Pernah ngalamin hal ini?"
          description="Kalau iya, kamu bukan satu-satunya. Banyak bisnis dan creator punya masalah yang sama sebelum pakai alur boost yang lebih rapi."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6 sm:p-8">
            <div className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-600">
              Yang sering bikin capek
            </div>
            <div className="space-y-4">
              {problems.map((problem) => (
                <div
                  key={problem}
                  className="flex gap-4 rounded-3xl border border-red-100 bg-white p-5"
                >
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <p className="text-sm leading-7 text-slate-700">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
            <div className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
              Solusi dari NaikBoost
            </div>
            <div className="space-y-4">
              {solutions.map((solution) => (
                <div
                  key={solution}
                  className="flex gap-4 rounded-3xl border border-emerald-100 bg-white p-5"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm leading-7 text-slate-700">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
