import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun NaikBoost untuk isi saldo, order lebih cepat, dan pantau semua pesanan.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Buat akun baru
        </h1>
        <p className="text-sm leading-7 text-slate-600">
          Daftar dulu supaya kamu bisa isi saldo, buat pesanan, dan pantau semuanya
          dari dashboard.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
