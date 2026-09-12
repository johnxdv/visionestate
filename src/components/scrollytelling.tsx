"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import { IN_VIEW, riseIn } from "@/lib/motion";
import { Badge } from "./ui";

type Beat = { act: string; line: string; support?: string };

const BEATS: Beat[] = [
  {
    act: "Temps 1 — les personnes",
    line: "D’abord, être là où vos prospects cherchent déjà.",
  },
  {
    act: "Temps 1 — les personnes",
    line: "Premier sur les recherches qui déclenchent un mandat.",
    support: "Le SEO capte tout le flux entrant, sans interruption.",
  },
  {
    act: "Temps 2 — le système",
    line: "Ensuite, ne plus en perdre un seul.",
  },
  {
    act: "Temps 2 — le système",
    line: "Un tunnel optimisé psychologiquement, écran après écran.",
    support: "Chaque étape est dessinée pour faire avancer le prospect.",
  },
  {
    act: "Temps 2 — le système",
    line: "Au centre : l’estimateur le plus rapide du marché.",
    support: "40+ données croisées. Un résultat en deux clics.",
  },
];

const HEADLINE =
  "max-w-[22ch] text-balance font-display text-[clamp(1.75rem,4.2vw,3.1rem)] font-semibold leading-[1.14] tracking-[-0.03em] text-ink";

const SUPPORT = "max-w-[38ch] text-pretty text-[1rem] leading-relaxed text-muted";

/* ------------------------------------------------------------------ *
 * Desktop — bande sticky : les phrases se relaient au scroll,
 * toutes centrées sur le même axe pour un fondu enchaîné propre.
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
  // dehors de leur créneau, et deux phrases ne se superposent jamais.
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

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <Badge>{beat.act}</Badge>
      <p className={HEADLINE}>{beat.line}</p>
      {beat.support && <p className={SUPPORT}>{beat.support}</p>}
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
              key={beat.line}
              beat={beat}
              index={index}
              total={BEATS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Repère de progression dans la bande */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-forest/35"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Mobile et mouvement réduit — les mêmes temps, empilés et sobres.
 * ------------------------------------------------------------------ */
function ScrollytellingStacked() {
  return (
    <div className="shell flex flex-col gap-20 py-24 sm:gap-24 sm:py-28">
      {BEATS.map((beat) => (
        <motion.div
          key={beat.line}
          variants={riseIn}
          initial="hidden"
          whileInView="visible"
          viewport={IN_VIEW}
          className="flex flex-col items-center gap-5 text-center"
        >
          <Badge>{beat.act}</Badge>
          <p className={HEADLINE}>{beat.line}</p>
          {beat.support && <p className={SUPPORT}>{beat.support}</p>}
        </motion.div>
      ))}
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
