import { Providers } from "@/components/providers";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { FactorsMarquee } from "@/components/factors-marquee";
import { RevealPhrase } from "@/components/reveal-phrase";
import { WhyItWorks } from "@/components/why-it-works";
import { Scrollytelling } from "@/components/scrollytelling";
import { About } from "@/components/about";
import { Booking } from "@/components/booking";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <Providers>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-page"
      >
        Aller au contenu
      </a>

      <BackgroundBlobs />
      <Nav />

      <main id="contenu">
        <Hero />
        <FactorsMarquee />
        <RevealPhrase />
        <WhyItWorks />
        <Scrollytelling />
        <About />
        <Booking />
      </main>

      <Footer />
    </Providers>
  );
}
