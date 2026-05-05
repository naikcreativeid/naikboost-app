import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Halaman kebijakan privasi NaikBoost.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Legal
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Kebijakan Privasi
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Draft ini disiapkan dulu sebagai tempat untuk menjelaskan data apa yang
            dikumpulkan, bagaimana dipakai, dan bagaimana customer bisa menghubungi
            NaikBoost soal privasi.
          </p>
          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-950">1. Data yang kami simpan</h2>
              <p className="mt-2">
                Contohnya nama, email, nomor WhatsApp, riwayat order, dan bukti transfer.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">2. Tujuan penggunaan data</h2>
              <p className="mt-2">
                Jelaskan data dipakai untuk verifikasi akun, pemrosesan pesanan, support,
                dan notifikasi penting.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">3. Hak pengguna</h2>
              <p className="mt-2">
                Tambahkan cara meminta perubahan data, koreksi informasi, atau pertanyaan
                privasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
