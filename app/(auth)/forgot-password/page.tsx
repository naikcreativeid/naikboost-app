import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Lupa password?
        </h1>
        <p className="text-sm leading-7 text-slate-600">
          Masukkan email akun kamu. Kami akan kirim link untuk membuat password
          baru.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
