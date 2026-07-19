import { Hero } from "@/components/home/Hero";
import { ExpertiseAdmin } from "@/components/home/ExpertiseAdmin";
import { StatsBand } from "@/components/home/StatsBand";
import { WhyUs } from "@/components/home/WhyUs";
import { Realisations } from "@/components/home/Realisations";
import { Partners } from "@/components/home/Partners";
import { CTABand } from "@/components/home/CTABand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExpertiseAdmin />
      <StatsBand />
      <WhyUs />
      <Realisations />
      <Partners />
      <CTABand />
    </>
  );
}
