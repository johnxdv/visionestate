"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE, IN_VIEW, riseIn } from "@/lib/motion";
import { IconCheck, IconPin, IconSearch, IconSparkle } from "./icons";
import { Em } from "./ui";

/* ------------------------------------------------------------------ *
 * Mises en scène — chaque étape a sa propre composition : un bloc
 * pleine largeur pour les respirations, un dyptique texte + maquette
 * pour les étapes qui montrent quelque chose.
 * ------------------------------------------------------------------ */

/** Étape SEO — la page de résultats, l'agence en tête. */
function SerpStage() {
  const results = [
    { title: "Agence Bellevue — Estimation en 2 min", url: "agence-bellevue.fr", own: true },
    { title: "Estimer son bien à Lyon 6e", url: "portail-immo.fr", own: false },
    { title: "Prix au m² Lyon 6e — 2026", url: "annonces.fr", own: false },
  ];

  return (
    <div className="w-full max-w-[420px] rounded-card border border-line bg-page/90 p-4 shadow-flat backdrop-blur-sm">
      <div className="flex items-center gap-2 rounded-pill border border-line bg-panel/60 px-3 py-2">
        <IconSearch className="size-4 shrink-0 text-muted" />
        <span className="truncate text-[0.82rem] text-ink">
          estimation maison lyon 6e
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {results.map((result, index) => (
          <li
            key={result.title}
            className={
              result.own
                ? "rounded-card border border-brass/45 bg-blob/45 px-3 py-2.5"
                : "rounded-card border border-transparent px-3 py-2.5 opacity-55"
            }
          >
            <div className="flex items-center gap-2">
              <span className="tnum text-[0.68rem] font-medium text-muted">
                {index + 1}
              </span>
              <span className="truncate text-[0.82rem] font-medium text-ink">
                {result.title}
              </span>
            </div>
            <div className="mt-0.5 pl-5 text-[0.7rem] text-muted">{result.url}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Étape tunnel — les écrans qui se resserrent jusqu'au rendez-vous. */
function FunnelStage() {
  const steps = [
    { label: "Visiteur", width: "100%" },
    { label: "Estimation lancée", width: "78%" },
    { label: "Coordonnées laissées", width: "54%" },
    { label: "Rendez-vous pris", width: "34%" },
  ];

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2">
      {steps.map((step, index) => (
        <div
          key={step.label}
          style={{ width: step.width }}
          className={
            index === steps.length - 1
              ? "rounded-card border border-brass/50 bg-blob/60 px-4 py-2.5"
              : "rounded-card border border-line bg-page/85 px-4 py-2.5"
          }
        >
          <span className="flex items-center gap-2 whitespace-nowrap text-[0.82rem] text-ink">
            {index === steps.length - 1 && (
              <IconCheck className="size-3.5 shrink-0 text-brass" />
            )}
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Étape estimateur — l'adresse entre, la fourchette sort. */
function EstimateStage() {
  return (
    <div className="w-full max-w-[420px] rounded-card border border-line bg-page/90 p-4 shadow-flat backdrop-blur-sm">
      <div className="flex items-center gap-2 rounded-pill border border-line bg-panel/60 px-3 py-2">
        <IconPin className="size-4 shrink-0 text-muted" />
        <span className="truncate text-[0.82rem] text-ink">
          12 rue Bugeaud, 69006 Lyon
        </span>
      </div>

      <div className="mt-3 rounded-card border border-line bg-panel/40 p-4">
        <div className="text-[0.7rem] text-muted">Valeur estimée</div>
        <div className="tnum mt-1 font-display text-[1.85rem] font-extrabold leading-none tracking-[-0.03em] text-ink">
          418 500 €
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-brass/12 px-2.5 py-1 text-[0.68rem] font-medium text-brass">
            <IconSparkle className="size-3" />
            40+ données croisées
          </span>
          <span className="tnum text-[0.7rem] text-muted">2 clics · 1,4 s</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Les cinq temps. `layout` décide de la composition, `visual` de la
 * maquette qui l'accompagne.
 * ------------------------------------------------------------------ */
type Beat = {
  key: string;
  line: ReactNode;
  support?: string;
  layout: "opener" | "split-right" | "split-left";
  visual?: () => ReactNode;
};

const BEATS: Beat[] = [
  {
    key: "ouverture",
    line: (
      <>
        D’abord, être là où vos prospects <Em>cherchent déjà</Em>.
      </>
    ),
    layout: "opener",
  },
  {
    key: "seo",
    line: "Premier sur les recherches qui déclenchent un mandat.",
    support: "Le SEO capte tout le flux entrant, sans interruption.",
    layout: "split-right",
    visual: SerpStage,
  },
  {
    key: "pivot",
    line: (
      <>
        Ensuite, ne plus en perdre <Em>un seul</Em>.
      </>
    ),
    layout: "opener",
  },
  {
    key: "tunnel",
    line: "Un tunnel optimisé psychologiquement, écran après écran.",
    support: "Chaque étape est dessinée pour faire avancer le prospect.",
    layout: "split-left",
    visual: FunnelStage,
  },
  {
    key: "estimateur",
    line: "Au centre : l’estimateur le plus rapide du marché.",
    support: "40+ données croisées. Un résultat en deux clics.",
    layout: "split-right",
    visual: EstimateStage,
  },
];

const HEADLINE =
  "text-balance font-display font-extrabold leading-[1.1] tracking-[-0.035em] text-ink";

const SUPPORT = "max-w-[38ch] text-pretty text-[1rem] leading-relaxed text-muted";

/* ------------------------------------------------------------------ *
 * Le fil conducteur : une ligne qui traverse la bande et se dessine au
 * rythme du scroll, jalonnée d'un repère par étape.
 *
 * Le SVG garde ses proportions (`meet`, pas de viewBox étiré) : c'est la
 * condition pour que `pathLength` produise un tracé plein et régulier.
 * ------------------------------------------------------------------ */
const THREAD_PATH =
  "M20 84 C 110 84, 160 42, 250 42 C 340 42, 410 78, 500 78 C 590 78, 660 36, 750 36 C 840 36, 890 70, 980 70";

const THREAD_NODES = [
  { x: 20, y: 84 },
  { x: 250, y: 42 },
  { x: 500, y: 78 },
  { x: 750, y: 36 },
  { x: 980, y: 70 },
];

function ThreadNode({
  node,
  index,
  total,
  progress,
}: {
  node: { x: number; y: number };
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Le repère s'allume quand le tracé l'a atteint.
  const reached = index / (total - 1);
  const opacity = useTransform(progress, [reached - 0.03, reached + 0.01], [0.28, 1]);
  const scale = useTransform(progress, [reached - 0.03, reached + 0.01], [0.7, 1]);

  return (
    <motion.circle
      cx={node.x}
      cy={node.y}
      r={6}
      fill="var(--color-page)"
      stroke="var(--color-forest)"
      strokeWidth={2.5}
      style={{ opacity, scale, transformOrigin: `${node.x}px ${node.y}px` }}
    />
  );
}

function Thread({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[9vh] mx-auto w-full max-w-[1180px] px-8"
    >
      <svg viewBox="0 0 1000 120" className="h-auto w-full overflow-visible">
        {/* Trace fantôme : on devine le chemin restant à parcourir. */}
        <path
          d={THREAD_PATH}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <motion.path
          d={THREAD_PATH}
          fill="none"
          stroke="var(--color-forest)"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
        {THREAD_NODES.map((node, index) => (
          <ThreadNode
            key={`${node.x}-${node.y}`}
            node={node}
            index={index}
            total={THREAD_NODES.length}
            progress={progress}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Desktop — bande sticky : les compositions se relaient au scroll.
 * ------------------------------------------------------------------ */
function CinematicBeat({
  beat,
  index,
  total,
  progress,
}: {
  beat: Beat;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const span = 1 / total;
  const start = index * span;
  const end = start + span;
  const fade = span * 0.32;
  const SHIFT = 42;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Transformations écrites en fonction plutôt qu'en plages de
  // keyframes : le premier et le dernier temps restent verrouillés en
  // dehors de leur créneau, et deux compositions ne se superposent jamais.
  const phase = (p: number) => {
    if (isFirst && p <= start + fade) return 1;
    if (isLast && p >= end - fade) return 1;
    if (p <= start || p >= end) return 0;
    if (p < start + fade) return (p - start) / fade;
    if (p > end - fade) return (end - p) / fade;
    return 1;
  };

  const opacity = useTransform(progress, phase);
  const y = useTransform(progress, (p) => {
    if (isFirst && p <= start + fade) return 0;
    if (isLast && p >= end - fade) return 0;
    if (p <= start) return SHIFT;
    if (p >= end) return -SHIFT;
    if (p < start + fade) return SHIFT * (1 - phase(p));
    if (p > end - fade) return -SHIFT * (1 - phase(p));
    return 0;
  });

  // La maquette glisse depuis son propre bord : le diptyque ne se
  // contente pas d'apparaître, il se referme sur le texte.
  const visualShift = useTransform(
    progress,
    (p) => (beat.layout === "split-left" ? -1 : 1) * 56 * (1 - phase(p)),
  );

  const Visual = beat.visual;

  if (beat.layout === "opener") {
    return (
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-0 flex flex-col items-center justify-center px-8 pb-[22vh] text-center"
      >
        <p className={`${HEADLINE} max-w-[24ch] text-[clamp(2.1rem,4.6vw,3.4rem)]`}>
          {beat.line}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center px-8 pb-[22vh]"
    >
      <div
        className={`grid w-full max-w-[1000px] items-center gap-12 lg:grid-cols-2 ${
          beat.layout === "split-left" ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="flex flex-col gap-5">
          <p className={`${HEADLINE} max-w-[20ch] text-[clamp(1.7rem,3.4vw,2.6rem)]`}>
            {beat.line}
          </p>
          {beat.support && <p className={SUPPORT}>{beat.support}</p>}
        </div>

        {Visual && (
          <motion.div
            style={{ x: visualShift }}
            className={
              beat.layout === "split-left" ? "flex justify-start" : "flex justify-end"
            }
          >
            <Visual />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ScrollytellingDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative mx-auto h-full w-full max-w-[1180px]">
          {BEATS.map((beat, index) => (
            <CinematicBeat
              key={beat.key}
              beat={beat}
              index={index}
              total={BEATS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <Thread progress={scrollYProgress} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Mobile et mouvement réduit — les mêmes temps, empilés, reliés par un
 * fil vertical qui se remplit au scroll.
 * ------------------------------------------------------------------ */
function ScrollytellingStacked() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });

  return (
    <div ref={ref} className="shell py-24 sm:py-28">
      <div className="relative pl-9">
        {/* Fil conducteur vertical : rail clair, remplissage piloté au
            scroll. `scaleY` est animé, jamais la hauteur. */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[9px] top-2 w-px bg-line"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: prefersReducedMotion ? 1 : scrollYProgress }}
          className="absolute bottom-2 left-[9px] top-2 w-px origin-top bg-forest/60"
        />

        <div className="flex flex-col gap-20 sm:gap-24">
          {BEATS.map((beat) => {
            const Visual = beat.visual;

            return (
              <motion.div
                key={beat.key}
                variants={riseIn}
                initial="hidden"
                whileInView="visible"
                viewport={IN_VIEW}
                className="relative flex flex-col gap-5"
              >
                {/* Repère d'étape, aligné sur le fil */}
                <span
                  aria-hidden="true"
                  // -left-8 (32px) et non -left-9 : le repère de 11px se centre
                  // ainsi exactement sur le rail, posé à left-[9px].
                  className="absolute -left-8 top-2 size-[11px] rounded-full border-[2.5px] border-forest bg-page"
                />

                <p
                  className={`${HEADLINE} ${
                    beat.layout === "opener"
                      ? "max-w-[22ch] text-[clamp(1.8rem,6.5vw,2.5rem)]"
                      : "max-w-[24ch] text-[clamp(1.5rem,5.5vw,2.1rem)]"
                  }`}
                >
                  {beat.line}
                </p>
                {beat.support && <p className={SUPPORT}>{beat.support}</p>}
                {Visual && (
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={IN_VIEW}
                    transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
                    className="mt-1"
                  >
                    <Visual />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Scrollytelling() {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="systeme" className="border-y border-line bg-panel/35">
      {isDesktop && !prefersReducedMotion ? (
        <ScrollytellingDesktop />
      ) : (
        <ScrollytellingStacked />
      )}
    </section>
  );
}
