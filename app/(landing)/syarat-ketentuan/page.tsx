import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Halaman syarat dan ketentuan penggunaan layanan NaikBoost.",
};

export default function TermsPage() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Legal
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Syarat &amp; Ketentuan
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Draft konten legal akan diisi berikutnya. Layout ini sudah siap untuk
            menampung pasal, poin layanan, aturan refund, dan tanggung jawab pengguna.
          </p>
          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
            <div>
              <h2 className="text-lg font-bold text-slate-950">1. Penggunaan layanan</h2>
              <p className="mt-2">
                Jelaskan siapa yang boleh memakai layanan, kewajiban customer, dan
                batas penggunaan yang wajar.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">2. Pembayaran & refund</h2>
              <p className="mt-2">
                Tuliskan alur pembayaran manual, verifikasi, kondisi refund, dan estimasi
                proses order.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">3. Garansi layanan</h2>
              <p className="mt-2">
                Masukkan aturan refill, pengecualian, dan hal-hal yang bisa membatalkan
                garansi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
