import Link from "next/link";

const footerLinks = [
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
  { href: "/login", label: "Masuk" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-slate-950">NaikBoost</p>
          <p className="mt-1 text-sm text-slate-500">
            Bagian dari NaikGroup, satu keluarga dengan NaikCetak.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-500 transition hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="container py-4 text-sm text-slate-500">
          Copyright {new Date().getFullYear()} NaikBoost. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
