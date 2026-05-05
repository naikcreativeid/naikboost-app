import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-24">
      <div className="container">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white shadow-2xl shadow-slate-300/40 sm:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">
                Saatnya Naik
              </p>
              <h2 className="mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Mau akun terlihat lebih siap jualan dan lebih meyakinkan?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Mulai dari paket yang paling cocok untuk kebutuhan kamu. Prosesnya
                cepat, bahasanya gampang dipahami, dan tim kami siap bantu.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-full bg-brand px-7 text-white hover:bg-brand-500"
            >
              <Link href="/register">
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
