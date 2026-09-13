"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion, useRenderGate } from "@/lib/hooks";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";
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

/**
 * Mot du titre : volet qui découpe, mot qui monte dedans.
 *
 * `settled` retire le `motion.span` une fois l'entrée jouée. C'est la
 * condition du dégradé animé qui suit : `background-clip: text` ne
 * découpe pas le texte d'un descendant transformé — il serait peint
 * dans sa propre couche, hors du masque du titre.
 */
function Word({ children, settled }: { children: ReactNode; settled: boolean }) {
  return (
    // Le volet descend sous la ligne de base pour laisser passer les
    // jambages ; la marge négative de même valeur évite que cette réserve
    // ne desserre l'interlignage du titre.
    <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      {settled ? (
        <span className="inline-block">{children}</span>
      ) : (
        <motion.span
          variants={TITLE_WORD}
          className="inline-block origin-[0%_100%] will-change-transform"
        >
          {children}
        </motion.span>
      )}
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
function MarkerHighlight({
  children,
  draw,
}: {
  children: string;
  /**
   * Arme le tracé. Faux tant que le titre se déplie : le trait est
   * alors fermé, sans animation attachée. Le passage à vrai est
   * définitif — c'est la garantie que le geste ne se joue qu'une fois.
   */
  draw: boolean;
}) {
  return (
    // `whitespace-nowrap` : le trait est posé sur une boîte unique — le
    // groupe de mots passe à la ligne en entier plutôt qu'en deux
    // morceaux que le SVG ne saurait pas suivre.
    <span className="relative inline-block whitespace-nowrap">
      {/* Halo — sous le trait, débordant vers le bas : il chevauche la
          ligne suivante du titre au lieu de rester sur le mot. */}
      <span
        aria-hidden="true"
        className={cn(
          "marker-halo pointer-events-none absolute -bottom-[1.45em] -left-[0.7em] -right-[0.7em] -top-[0.3em] -z-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(169,121,61,0.42),rgba(169,121,61,0.18)_58%,rgba(169,121,61,0)_82%)] blur-[26px]",
          draw && "marker-glow",
        )}
      />

      {/* Trait de marqueur — le débordement latéral vient des inserts
          négatifs du conteneur, inégaux d'un côté à l'autre. */}
      <span
        aria-hidden="true"
        // `-z-10` : une fois le dégradé du titre découpé sur les
        // glyphes, la couleur des lettres est le fond du <h1> — peint
        // avant les descendants positionnés. Sans ce recul, le trait
        // recouvrirait les lettres au lieu de passer dessous.
        className={cn(
          "marker-stroke pointer-events-none absolute -bottom-[0.08em] -left-[0.34em] -right-[0.46em] -top-[0.1em] -z-10 -rotate-[1.4deg]",
          draw && "marker-draw",
        )}
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

/**
 * Durée de la séquence d'entrée du titre, marge comprise : sept
 * enfants animés, donc 0,08 s de `delayChildren` puis six crans de
 * 0,065 s avant que le dernier ne parte pour 0,82 s — soit ~1,29 s.
 */
const TITLE_ENTRANCE_FALLBACK_MS = 2200;

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Passe à vrai quand le dernier mot du titre s'est posé. Le titre
  // bascule alors sur un balisage sans transform, seul support possible
  // du dégradé découpé sur les glyphes.
  const [hasEntered, setHasEntered] = useState(false);
  const settled = hasEntered || prefersReducedMotion;

  // Le tracé du marqueur est armé une fois le titre posé *et* le
  // document en train de peindre. Ce verrou est la correction du
  // surlignage : l'animation du trait avance sur la timeline du
  // document, qui ne tourne pas tant que la page n'est pas rendue.
  // Armée pendant ce gel — page chargée dans un onglet d'arrière-plan,
  // fenêtre passée au second plan pendant l'entrée du titre — elle
  // restait épinglée sur sa première keyframe : trait fermé, donc
  // invisible, et rien au retour sur la page pour l'en sortir. Voir
  // `useRenderGate`.
  const drawMarker = useRenderGate(settled);

  // Filet de sécurité. `onAnimationComplete` ne se déclenche que si la
  // séquence va jusqu'au bout : une entrée interrompue — onglet masqué
  // pendant le trajet, remontage en cours de route au retour sur la
  // page — laisse le rappel en suspens, et le titre reste indéfiniment
  // dans son état d'avant-pose : pas de dégradé, et surtout pas de
  // trait de marqueur. Le minuteur, lui, n'a pas besoin que quoi que ce
  // soit se peigne pour arriver à terme.
  useEffect(() => {
    if (hasEntered) return;

    const timer = window.setTimeout(
      () => setHasEntered(true),
      TITLE_ENTRANCE_FALLBACK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [hasEntered]);

  return (
    <section id="top" className="relative pt-[7.5rem] sm:pt-[9rem] md:pt-[10.5rem]">
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 text-center sm:px-8">
        {/* Le conteneur porte la respiration ; le titre porte le
            dégradé. Les deux animations ne peuvent pas cohabiter sur le
            même élément — voir le commentaire dans globals.css. */}
        <div className={settled ? "hero-title-breathe" : undefined}>
          <motion.h1
            variants={TITLE_SEQUENCE}
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate="visible"
            onAnimationComplete={() => setHasEntered(true)}
            // La borne basse du clamp est dictée par le groupe surligné :
            // il est insécable (le trait est posé sur une boîte unique), il
            // doit donc tenir sur une ligne à la largeur mobile la plus
            // étroite, débordement du marqueur compris.
            className={cn(
              "text-balance font-display text-[clamp(2.05rem,5.5vw,4.4rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink",
              // Respiration + dégradé qui traverse le texte, en boucle.
              settled && "hero-title-live",
            )}
          >
            {/* Le titre tient sur deux lignes dès lg ; en dessous il se
                répartit naturellement. */}
            <span className="lg:block">
              <Word settled={settled}>Osez</Word>{" "}
              <Word settled={settled}>prendre</Word>{" "}
              <Word settled={settled}>une</Word>{" "}
              {/* Pas de volet de découpe ici : il rognerait le trait de
                  marqueur et son halo, qui débordent de la boîte du mot. */}
              {/* `draw` est calé sur `settled`, et c'est ce qui répare
                  le surlignage. Les deux branches ci-dessous sont de
                  types différents (`span` contre `motion.span`) : React
                  démonte l'une pour monter l'autre, et le trait était
                  donc reconstruit au moment précis où le titre se
                  posait. Le trait rejouait alors son animation —
                  disparition, délai, nouveau tracé — au beau milieu du
                  geste. En n'armant le tracé que dans la branche posée,
                  la seule instance animée est la définitive. */}
              {settled ? (
                <span className="inline-block">
                  <MarkerHighlight draw={drawMarker}>
                    longueur d’avance
                  </MarkerHighlight>
                </span>
              ) : (
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
                  <MarkerHighlight draw={false}>longueur d’avance</MarkerHighlight>
                </motion.span>
              )}
            </span>{" "}
            <span className="lg:block">
              <Word settled={settled}>sur</Word>{" "}
              <Word settled={settled}>vos</Word>{" "}
              <Word settled={settled}>concurrents</Word>
            </span>
          </motion.h1>
        </div>

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
