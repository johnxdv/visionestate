import { Providers } from "@/components/providers";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Credibility } from "@/components/credibility";
import { RevealPhrase } from "@/components/reveal-phrase";
import { WhyItWorks } from "@/components/why-it-works";
import { Scrollytelling } from "@/components/scrollytelling";
import { InAction } from "@/components/in-action";
import { About } from "@/components/about";
import { Booking } from "@/components/booking";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <Providers>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:text-page"
      >
        Aller au contenu
      </a>

      <BackgroundBlobs />
      <Nav />

      <main id="contenu">
        <Hero />
        <Credibility />
        <RevealPhrase />
        <WhyItWorks />
        <Scrollytelling />
        <InAction />
        <About />
        <Booking />
      </main>

      <Footer />
    </Providers>
  );
}
