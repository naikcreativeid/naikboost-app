import Link from "next/link";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#layanan", label: "Layanan" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#f0f4fc] bg-white/85 backdrop-blur-xl">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-[#0a1330]">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-[#0a1330] text-[16px] font-extrabold text-white">
            N
          </span>
          <span className="text-[18px] font-extrabold tracking-[-0.02em]">NaikBoost</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-[#4a5680] transition hover:text-[#0a1330]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button
            asChild
            variant="outline"
            className="h-auto rounded-[10px] border-[#e6ecf7] px-3.5 py-2 text-[14px] font-semibold text-[#0a1330] hover:border-[#0a1330] hover:bg-transparent"
          >
            <Link href="/login">Masuk</Link>
          </Button>
          <Button
            asChild
            className="h-auto rounded-[10px] bg-brand px-4 py-2 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(45,92,246,0.25)] hover:bg-[#1e44d4]"
          >
            <Link href="/register">Coba Gratis</Link>
          </Button>
        </div>

        <details className="relative md:hidden">
          <summary className="list-none rounded-[10px] border border-[#e6ecf7] px-4 py-2 text-[14px] font-semibold text-[#0a1330] marker:content-none">
            Menu
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.5rem)] w-56 rounded-[18px] border border-[#e6ecf7] bg-white p-3 shadow-lg">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#4a5680] hover:bg-[#f5f8ff] hover:text-[#0a1330]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#4a5680] hover:bg-[#f5f8ff] hover:text-[#0a1330]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="mt-1 rounded-xl bg-brand px-3 py-2.5 text-center text-[14px] font-semibold text-white"
              >
                Coba Gratis
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
