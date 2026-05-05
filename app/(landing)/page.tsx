import type { Metadata } from "next";

import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { Trust } from "@/components/landing/trust";

export const metadata: Metadata = {
  title: "NaikBoost - Algorithm Boost Service untuk Bisnis & Creator Serius",
  description:
    "Jasa boost engagement Instagram, TikTok, YouTube, dan Facebook untuk bisnis dan creator yang ingin hasil cepat, aman, dan gampang dipahami.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Trust />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
