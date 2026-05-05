import Link from "next/link";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="container flex h-18 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-sm font-extrabold text-white shadow-lg shadow-brand-500/20">
            NB
          </div>
          <div>
            <p className="text-base font-bold text-slate-950">NaikBoost</p>
            <p className="text-xs text-slate-500">by NaikGroup</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" className="text-slate-700 hover:text-brand-600">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-brand px-6 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600"
          >
            <Link href="/register">Mulai Sekarang</Link>
          </Button>
        </div>

        <details className="group md:hidden">
          <summary className="flex h-11 cursor-pointer list-none items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 marker:content-none">
            Menu
          </summary>
          <div className="absolute inset-x-4 top-[calc(100%-0.25rem)] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/60">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-600"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-600"
              >
                Masuk
              </Link>
              <Button
                asChild
                className="mt-2 w-full rounded-full bg-brand text-white hover:bg-brand-600"
              >
                <Link href="/register">Mulai Sekarang</Link>
              </Button>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
