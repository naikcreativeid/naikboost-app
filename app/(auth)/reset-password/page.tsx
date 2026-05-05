import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Atur ulang password akun NaikBoost kamu.",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Buat password baru
        </h1>
        <p className="text-sm leading-7 text-slate-600">
          Pilih password baru yang aman dan mudah kamu ingat.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
