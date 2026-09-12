"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE, heroItem, heroStagger } from "@/lib/motion";
import { Badge, CtaPrimary, CtaSecondary } from "./ui";
import { DashboardShowcase } from "./dashboard";

/**
 * Fond beige qui se révèle derrière les mots mis en avant.
 *
 * Le fond est un dégradé porté par l'élément inline lui-même, révélé en
 * animant `background-size` : contrairement à un bloc positionné en
 * absolu, il suit le texte quand celui-ci passe à la ligne — ce qui
 * arrive dès les largeurs mobiles. `box-decoration-break: clone` fait
 * que chaque fragment de ligne reçoit son propre fond.
 */
function Highlight({ children }: { children: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.span
      className="rounded-[3px] px-[0.06em] py-[0.04em] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
      style={{
        backgroundImage: "linear-gradient(var(--color-blob), var(--color-blob))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
      initial={{ backgroundSize: prefersReducedMotion ? "100% 100%" : "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.72, delay: 0.66, ease: EASE }
      }
    >
      {children}
    </motion.span>
  );
}

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="top" className="relative pt-[7.5rem] sm:pt-[9rem] md:pt-[10.5rem]">
      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        // `relative z-10` : le glow en arc du dashboard déborde au-dessus
        // de cette zone, il ne doit pas laver les CTA.
        className="relative z-10 mx-auto w-full max-w-[1280px] px-5 text-center sm:px-8"
      >
        <motion.div variants={heroItem}>
          <Badge>Système d’acquisition immobilier</Badge>
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="mt-6 text-balance font-display text-[clamp(2.75rem,5.5vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.032em] text-ink"
        >
          {/* Le titre tient sur deux lignes dès lg ; en dessous il se
              répartit naturellement. */}
          <span className="lg:block">
            Osez prendre une <Highlight>longueur d’avance</Highlight>
          </span>{" "}
          <span className="lg:block">sur vos concurrents</span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mx-auto mt-7 max-w-[64ch] text-pretty text-[1.1rem] leading-relaxed text-muted"
        >
          Première position sur les recherches qui comptent, tunnel de conversion
          optimisé, estimateur en deux clics. Un système d’acquisition complet
          pour votre agence — livré en 72h.
        </motion.p>

        <motion.div
          variants={heroItem}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <CtaPrimary href="#reserver">Réserver une démo</CtaPrimary>
          <CtaSecondary href="#systeme">Voir comment ça marche</CtaSecondary>
        </motion.div>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.62, ease: EASE }}
      >
        <DashboardShowcase />
      </motion.div>
    </section>
  );
}
