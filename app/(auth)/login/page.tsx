import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke dashboard NaikBoost untuk kelola order, saldo, dan top up.",
};

type LoginPageProps = {
  searchParams?: {
    next?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Masuk ke akun kamu
        </h1>
        <p className="text-sm leading-7 text-slate-600">
          Login untuk lanjut ke dashboard dan kelola pesanan NaikBoost dengan lebih
          mudah.
        </p>
      </div>
      <LoginForm nextPath={searchParams?.next} />
    </div>
  );
}
