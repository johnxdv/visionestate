"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE } from "@/lib/motion";
import { CtaPrimary, CtaSecondary } from "./ui";
import { DashboardShowcase } from "./dashboard";

/* ------------------------------------------------------------------ *
 * Entrée du titre — chaque mot monte derrière son propre volet, avec
 * une rotation prise au coin bas-gauche : le titre se déplie au lieu
 * d'apparaître d'un bloc.
 * ------------------------------------------------------------------ */
const TITLE_SEQUENCE: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.08, staggerChildren: 0.065 } },
};

const TITLE_WORD: Variants = {
  hidden: { y: "108%", rotate: -7, opacity: 0 },
  visible: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.82, ease: EASE },
  },
};

/** Mot du titre : volet qui découpe, mot qui monte dedans. */
function Word({ children }: { children: ReactNode }) {
  return (
    // Le volet descend sous la ligne de base pour laisser passer les
    // jambages ; la marge négative de même valeur évite que cette réserve
    // ne desserre l'interlignage du titre.
    <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span
        variants={TITLE_WORD}
        className="inline-block origin-[0%_100%] will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Surligneur fait main.
 *
 * La forme est un polygone aux bords ondulés et aux extrémités qui
 * débordent du mot, pas un rectangle : un `background-color` CSS ne
 * peut pas la produire. Le tracé se révèle par un volet de découpe dont
 * la largeur grandit de gauche à droite, avec un léger dépassement en
 * fin de course — le geste se lit comme un coup de marqueur.
 *
 * Le halo brass est posé sous le trait et déborde vers le bas : il
 * chevauche la ligne suivante du titre au lieu de rester confiné au mot.
 * ------------------------------------------------------------------ */
function MarkerHighlight({ children }: { children: string }) {
  return (
    // `whitespace-nowrap` : le trait est posé sur une boîte unique — le
    // groupe de mots passe à la ligne en entier plutôt qu'en deux
    // morceaux que le SVG ne saurait pas suivre.
    <span className="relative inline-block whitespace-nowrap">
      {/* Halo — sous le trait, débordant vers le bas : il chevauche la
          ligne suivante du titre au lieu de rester sur le mot. */}
      <span
        aria-hidden="true"
        className="marker-glow pointer-events-none absolute -bottom-[1.45em] -left-[0.7em] -right-[0.7em] -top-[0.3em] rounded-[50%] bg-[radial-gradient(closest-side,rgba(169,121,61,0.42),rgba(169,121,61,0.18)_58%,rgba(169,121,61,0)_82%)] blur-[26px]"
      />

      {/* Trait de marqueur — le débordement latéral vient des inserts
          négatifs du conteneur, inégaux d'un côté à l'autre. */}
      <span
        aria-hidden="true"
        className="marker-draw pointer-events-none absolute -bottom-[0.08em] -left-[0.34em] -right-[0.46em] -top-[0.1em] -rotate-[1.4deg]"
      >
        <svg
          viewBox="0 0 200 44"
          preserveAspectRatio="none"
          className="block size-full"
        >
          {/* Bords ondulés, extrémités inégales, légère pente : rien
              n'est aligné au pixel — un rectangle CSS ne peut pas le faire. */}
          <path
            fill="rgba(169,121,61,0.44)"
            d="M1.4 10.8 C 26 6.2, 52 11.4, 79 8.1 C 108 4.6, 140 9.8, 168 6.4 C 180 5.1, 190 7.2, 198.6 5.6 L 197.2 36.4 C 172 40.1, 146 34.6, 118 37.9 C 88 41.4, 56 35.8, 28 39.2 C 17 40.5, 8 38.1, 2.2 39.4 Z"
          />
        </svg>
      </span>

      <span className="relative">{children}</span>
    </span>
  );
}

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="top" className="relative pt-[7.5rem] sm:pt-[9rem] md:pt-[10.5rem]">
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 text-center sm:px-8">
        <motion.h1
          variants={TITLE_SEQUENCE}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate="visible"
          // La borne basse du clamp est dictée par le groupe surligné :
          // il est insécable (le trait est posé sur une boîte unique), il
          // doit donc tenir sur une ligne à la largeur mobile la plus
          // étroite, débordement du marqueur compris.
          className="text-balance font-display text-[clamp(2.05rem,5.5vw,4.4rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink"
        >
          {/* Le titre tient sur deux lignes dès lg ; en dessous il se
              répartit naturellement. */}
          <span className="lg:block">
            <Word>Osez</Word> <Word>prendre</Word> <Word>une</Word>{" "}
            {/* Pas de volet de découpe ici : il rognerait le trait de
                marqueur et son halo, qui débordent de la boîte du mot. */}
            <motion.span
              variants={{
                hidden: { y: "24%", opacity: 0 },
                visible: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.8, ease: EASE },
                },
              }}
              className="inline-block"
            >
              <MarkerHighlight>longueur d’avance</MarkerHighlight>
            </motion.span>
          </span>{" "}
          <span className="lg:block">
            <Word>sur</Word> <Word>vos</Word> <Word>concurrents</Word>
          </span>
        </motion.h1>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease: EASE }}
          className="mx-auto mt-7 max-w-[46ch] text-pretty text-[1.1rem] leading-relaxed text-muted"
        >
          Un système d’acquisition complet pour votre agence, livré en 72 heures.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.86, ease: EASE }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <CtaPrimary href="#reserver">Réserver une démo</CtaPrimary>
          <CtaSecondary href="#systeme">Voir comment ça marche</CtaSecondary>
        </motion.div>
      </div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.98, ease: EASE }}
      >
        <DashboardShowcase />
      </motion.div>
    </section>
  );
}
