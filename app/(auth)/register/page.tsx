import { RegisterForm } from "@/components/auth/register-form";

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
