import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="px-6 py-10">
      <div className="container">
        <div className="relative overflow-hidden rounded-[24px] bg-[#0a1330] px-8 py-16 text-center text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(45,92,246,0.4),transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_0%,rgba(255,181,71,0.15),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.025em]">
              Siap Bikin Akun Kamu{" "}
              <span className="font-serif font-normal italic text-[#ffb547]">
                Naik Level?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] text-white/70">
              Ribuan creator dan bisnis udah ngerasain bedanya. Sekarang giliran
              kamu.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-auto rounded-[10px] bg-white px-7 py-3.5 text-[16px] font-semibold text-[#0a1330] hover:bg-[#ffb547]"
              >
                <Link href="/register">
                  Mulai Boost Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto rounded-[10px] border-white/20 bg-transparent px-7 py-3.5 text-[16px] font-semibold text-white hover:border-white hover:bg-white/5"
              >
                <Link href="/contact">Chat CS Dulu</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
