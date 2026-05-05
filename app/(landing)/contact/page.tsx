import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi tim NaikBoost lewat WhatsApp atau email.",
};

export default function ContactPage() {
  const adminWhatsapp = process.env.ADMIN_WHATSAPP_NUMBER || "6280000000000";

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Kontak
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Hubungi tim NaikBoost
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Kalau butuh bantuan order, verifikasi pembayaran, atau mau tanya dulu sebelum
            beli, kamu bisa hubungi kami lewat channel di bawah ini.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href={`https://wa.me/${adminWhatsapp.replace(/\D/g, "")}`}
              className="rounded-[1.5rem] border border-slate-200 p-5 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-1 h-5 w-5 text-brand-600" />
                <div>
                  <p className="font-semibold text-slate-950">WhatsApp</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Kontak cepat untuk tanya order dan follow up pembayaran.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="mailto:halo@naikboost.app"
              className="rounded-[1.5rem] border border-slate-200 p-5 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-brand-600" />
                <div>
                  <p className="font-semibold text-slate-950">Email</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Cocok untuk pertanyaan yang lebih detail atau dokumen pendukung.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
