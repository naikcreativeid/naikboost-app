import Link from "next/link";

const footerLinks = [
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
  { href: "/contact", label: "Hubungi Kami" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#f0f4fc] py-12">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="flex items-center gap-3 text-[#0a1330]">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-[#0a1330] text-[16px] font-extrabold text-white">
                N
              </span>
              <span className="text-[18px] font-extrabold tracking-[-0.02em]">
                NaikBoost
              </span>
            </Link>
            <span className="text-[13px] text-[#8590b0]">
              © 2026 NaikBoost. Bagian dari NaikGroup.
            </span>
          </div>

          <div className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[#4a5680] transition hover:text-[#0a1330]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
