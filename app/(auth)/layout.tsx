import type { ReactNode } from "react";
import Link from "next/link";

import { BrandPanel } from "@/components/auth/brand-panel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-extrabold text-white shadow-lg shadow-brand-500/20">
                NB
              </div>
              <div>
                <p className="text-base font-bold text-slate-950">NaikBoost</p>
                <p className="text-xs text-slate-500">Masuk ke akun kamu</p>
              </div>
            </Link>
          </div>
          {children}
        </div>
      </div>
      <BrandPanel />
    </div>
  );
}
