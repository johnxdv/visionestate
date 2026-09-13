"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useCountUp, useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE, IN_VIEW } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Em } from "./ui";
import {
  IconBolt,
  IconCheck,
  IconClock,
  IconGauge,
  IconMoon,
  IconPackage,
  IconPulse,
  IconSparkle,
  IconSun,
  IconUsers,
} from "./icons";

/* ------------------------------------------------------------------ *
 * Trois blocs empilés en zigzag. Chacun porte sa propre mise en scène :
 * une liste qui se coche toute seule, une veille de 24 heures balayée
 * par un faisceau, un compte à rebours de livraison. Rien n'est répété
 * d'un bloc à l'autre — ni le motif, ni la nature du mouvement.
 *
 * Chaque maquette est déclenchée par son propre `useInView` : les
 * séquences ne partent que lorsque le bloc est réellement à l'écran.
 * ------------------------------------------------------------------ */

/** Carte commune aux trois maquettes — cadre, fond, respiration. */
function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-card border border-line bg-page/85 p-5 shadow-flat backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Bloc 1 — Zéro temps perdu.
 * Une liste de tâches manuelles que le système coche à votre place :
 * chaque ligne est barrée l'une après l'autre, et le temps récupéré
 * s'inscrit en bas, traversé par un glint qui revient en boucle.
 * ------------------------------------------------------------------ */
const CHORES = [
  { label: "Rappeler le prospect", Icon: IconUsers },
  { label: "Qualifier la demande", Icon: IconSparkle },
  { label: "Envoyer l’estimation", Icon: IconBolt },
  { label: "Caler le rendez-vous", Icon: IconClock },
];

function AutopilotVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  const hours = useCountUp(12, inView, 1200);

  return (
    <div ref={ref}>
      <Frame>
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-[0.9rem] font-semibold text-ink">
            Votre semaine
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-forest/10 px-2.5 py-1 text-[0.68rem] font-medium text-forest">
            <IconBolt className="size-3" />
            Pilote automatique
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {CHORES.map((chore, index) => (
            <li
              key={chore.label}
              className="flex items-center gap-3 rounded-card border border-line bg-panel/50 px-3 py-2.5"
            >
              {/* La pastille bascule du gris au vert quand la tâche
                  passe en automatique. */}
              <motion.span
                className="grid size-6 shrink-0 place-items-center rounded-[6px] border border-line bg-page text-muted"
                initial={{ borderColor: "#e3dcc9", color: "#5b6058" }}
                animate={
                  inView
                    ? { borderColor: "#1F8A5F", color: "#1F8A5F", scale: [1, 1.18, 1] }
                    : undefined
                }
                transition={{ duration: 0.45, delay: 0.35 + index * 0.28, ease: EASE }}
              >
                <chore.Icon className="size-[13px]" />
              </motion.span>

              <span className="min-w-0 flex-1 truncate text-[0.84rem] text-ink">
                {/* La boîte de référence du trait est la ligne de texte
                    elle-même, pas la colonne : la rature s'arrête au
                    dernier caractère du libellé. */}
                <span className="relative">
                  {chore.label}
                  <motion.span
                    className="absolute left-0 top-1/2 h-px w-full origin-left bg-muted/70"
                    initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                    animate={inView ? { scaleX: 1 } : undefined}
                    transition={{
                      duration: 0.42,
                      delay: 0.45 + index * 0.28,
                      ease: EASE,
                    }}
                  />
                </span>
              </span>

              <motion.span
                className="shrink-0 rounded-pill bg-forest px-2 py-0.5 text-[0.62rem] font-medium text-page"
                initial={{ opacity: prefersReducedMotion ? 1 : 0, x: prefersReducedMotion ? 0 : -6 }}
                animate={inView ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.35, delay: 0.6 + index * 0.28, ease: EASE }}
              >
                auto
              </motion.span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
          <span className="max-w-[16ch] text-[0.75rem] leading-snug text-muted">
            récupérées chaque semaine
          </span>
          {/* Le chiffre porte le glint : la brillance traverse les
              glyphes en boucle, sans jamais en sortir. */}
          <span
            className="tnum glint font-display text-[2.2rem] font-extrabold leading-none tracking-[-0.03em] text-forest"
            style={{ "--glint-base": "#14392A" } as CSSProperties}
          >
            {Math.round(hours)} h
          </span>
        </div>
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Bloc 2 — Actif jour et nuit.
 * Les 24 heures en barres qui respirent, un faisceau qui les balaie en
 * continu, et trois demandes qui tombent en pleine nuit.
 * ------------------------------------------------------------------ */
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

/** Profil d'activité sur la journée — creux la nuit, jamais à zéro. */
const HOUR_LOAD = [
  0.3, 0.24, 0.28, 0.2, 0.22, 0.3, 0.42, 0.58, 0.72, 0.86, 0.94, 0.9, 0.78,
  0.84, 0.92, 1, 0.95, 0.88, 0.8, 0.7, 0.62, 0.5, 0.42, 0.34,
];

/** Demandes arrivées quand l'agence était fermée. */
const NIGHT_LEADS = [
  { hour: 2, time: "02 h 14" },
  { hour: 4, time: "04 h 38" },
  { hour: 23, time: "23 h 51" },
];

function NightWatchVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div ref={ref}>
      <Frame>
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-[0.9rem] font-semibold text-ink">
            Dernières 24 heures
          </span>
          <span className="inline-flex items-center gap-2 text-[0.68rem] text-muted">
            <IconSun className="size-3.5 text-brass" />
            <span className="h-3 w-px bg-line" />
            <IconMoon className="size-3.5 text-navy" />
          </span>
        </div>

        <div className="relative mt-5 h-[132px]">
          {/* Voile jour → nuit, posé derrière les barres. */}
          <span className="absolute inset-0 rounded-[6px] bg-[linear-gradient(90deg,rgba(20,33,61,0.09),rgba(169,121,61,0.1)_34%,rgba(169,121,61,0.12)_62%,rgba(20,33,61,0.11))]" />

          {/* Faisceau : il ne s'arrête jamais — c'est tout le propos. */}
          <span className="scan-beam pointer-events-none absolute inset-0 rounded-[6px]" />

          <div className="absolute inset-x-1.5 bottom-0 flex h-full items-end gap-[3px]">
            {HOURS.map((hour) => {
              const load = HOUR_LOAD[hour];
              const isNight = hour < 6 || hour >= 21;

              // Deux barres imbriquées : l'extérieure porte la poussée
              // d'entrée (Framer, inline), l'intérieure la respiration
              // continue (CSS). Sur un même élément, l'animation CSS
              // l'emporterait sur le style inline et l'entrée serait
              // purement et simplement perdue.
              return (
                <motion.span
                  key={hour}
                  className="flex-1 origin-bottom"
                  style={{ height: `${Math.round(load * 100)}%` }}
                  initial={{ scaleY: prefersReducedMotion ? 1 : 0 }}
                  animate={inView ? { scaleY: 1 } : undefined}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + hour * 0.022,
                    ease: EASE,
                  }}
                >
                  <span
                    className="activity-bar block size-full rounded-[2px]"
                    style={
                      {
                        backgroundColor: isNight ? "#2B5FA8" : "#1F8A5F",
                        opacity: isNight ? 0.5 : 0.34,
                        "--bar-peak": 1 + load * 0.18,
                        "--bar-duration": `${2.6 + (hour % 5) * 0.42}s`,
                        "--bar-delay": `${(hour % 7) * 0.19}s`,
                      } as CSSProperties
                    }
                  />
                </motion.span>
              );
            })}
          </div>

          {/* Les demandes nocturnes : une pastille qui tombe sur l'heure
              exacte, entourée d'un halo qui continue de battre. */}
          {NIGHT_LEADS.map((lead, index) => (
            <motion.span
              key={lead.time}
              className="absolute top-2 grid size-2.5 -translate-x-1/2 place-items-center"
              style={{ left: `${((lead.hour + 0.5) / 24) * 100}%` }}
              initial={{
                opacity: prefersReducedMotion ? 1 : 0,
                y: prefersReducedMotion ? 0 : -14,
              }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.5,
                delay: 0.9 + index * 0.3,
                ease: [0.34, 1.4, 0.64, 1],
              }}
            >
              <span className="pulse-ring absolute size-2.5 rounded-full bg-navy" />
              <span className="size-2.5 rounded-full border-2 border-page bg-navy" />
            </motion.span>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[0.62rem] text-muted/70">
          <span>00 h</span>
          <span>06 h</span>
          <span>12 h</span>
          <span>18 h</span>
          <span>24 h</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-navy/10 px-2.5 py-1 text-[0.68rem] font-medium text-navy">
            <IconMoon className="size-3" />3 demandes hors horaires
          </span>
          {NIGHT_LEADS.map((lead, index) => (
            <motion.span
              key={lead.time}
              className="tnum rounded-pill border border-line px-2.5 py-1 text-[0.66rem] text-muted"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 1.1 + index * 0.3 }}
            >
              {lead.time}
            </motion.span>
          ))}
        </div>
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Bloc 3 — Livré en 72h.
 * Un anneau qui se referme sur les 72 heures, trois jalons qui
 * s'allument dans l'ordre, et un tampon « Livré » qui se pose avec son
 * onde de choc.
 * ------------------------------------------------------------------ */
const MILESTONES = [
  { day: "J1", label: "Audit du marché" },
  { day: "J2", label: "Montage du système" },
  { day: "J3", label: "Mise en ligne" },
];

const RING_RADIUS = 52;

function DeliveryVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  const hours = useCountUp(72, inView, 1800);

  return (
    <div ref={ref}>
      <Frame>
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-[0.9rem] font-semibold text-ink">
            Mise en service
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-brass/12 px-2.5 py-1 text-[0.68rem] font-medium text-brass">
            <IconPackage className="size-3" />
            Sur-mesure
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4 sm:gap-8">
          <div className="relative size-[112px] shrink-0 sm:size-[132px]">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={RING_RADIUS}
                fill="none"
                stroke="var(--color-line)"
                strokeWidth={9}
              />
              {/* `pathLength` sur un cercle : l'anneau se referme sans
                  dasharray à calculer. */}
              <motion.circle
                cx="60"
                cy="60"
                r={RING_RADIUS}
                fill="none"
                stroke="url(#ve-ring)"
                strokeWidth={9}
                strokeLinecap="round"
                initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                animate={inView ? { pathLength: 1 } : undefined}
                transition={{ duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
              />
              <defs>
                <linearGradient id="ve-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A9793D" />
                  <stop offset="100%" stopColor="#14392A" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 grid place-items-center">
              <span className="tnum font-display text-[1.85rem] font-extrabold leading-none tracking-[-0.03em] text-ink">
                {Math.round(hours)}
                <span className="text-[1rem] font-semibold text-muted">h</span>
              </span>
            </div>
          </div>

          <ul className="flex min-w-0 flex-1 flex-col gap-2.5">
            {MILESTONES.map((milestone, index) => (
              <motion.li
                key={milestone.day}
                className="flex items-center gap-2.5"
                initial={{
                  opacity: prefersReducedMotion ? 1 : 0,
                  x: prefersReducedMotion ? 0 : 14,
                }}
                animate={inView ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.42, ease: EASE }}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest text-[0.6rem] font-semibold text-page">
                  {milestone.day}
                </span>
                {/* Le libellé passe à la ligne plutôt que d'être rogné :
                    la colonne est étroite sur petit écran. */}
                <span className="min-w-0 text-[0.82rem] leading-snug text-ink">
                  {milestone.label}
                </span>
                <IconCheck className="ml-auto size-3.5 shrink-0 text-forest" />
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Le tampon : il arrive après les trois jalons, et son onde
            continue de se propager en boucle. */}
        <motion.div
          className="mt-5 flex items-center justify-center border-t border-line pt-5"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.3, delay: 1.75 }}
        >
          <motion.span
            className="relative inline-flex items-center gap-2 rounded-pill bg-forest px-4 py-2 text-[0.78rem] font-semibold text-page"
            initial={{ scale: prefersReducedMotion ? 1 : 0.55, rotate: prefersReducedMotion ? 0 : -7 }}
            animate={inView ? { scale: 1, rotate: 0 } : undefined}
            transition={{
              duration: 0.6,
              delay: 1.75,
              ease: [0.34, 1.5, 0.64, 1],
            }}
          >
            <span className="stamp-ripple absolute inset-0 rounded-pill border-2 border-forest" />
            <IconCheck className="size-3.5" />
            Système livré
          </motion.span>
        </motion.div>
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Fil conducteur.
 *
 * Les trois blocs ne se succédaient que par leur position dans la page.
 * Une colonne épaisse les traverse désormais de part en part : elle
 * naît au centre du premier bloc, meurt au centre du dernier, et
 * traverse les respirations qui les séparent — c'est là, dans le vide
 * entre deux blocs, que l'enchaînement se voit.
 *
 * Le remplissage est calé sur `["start center", "end center"]` : sa
 * tête tombe exactement sur le milieu du viewport. Les repères sont
 * posés à la hauteur *mesurée* du centre de chaque bloc plutôt qu'à un
 * tiers supposé — les trois maquettes n'ont pas la même hauteur, et
 * elles changent encore avec la largeur. Tête et repères se croisent
 * ainsi au bon moment, sans réglage à la main.
 * ------------------------------------------------------------------ */

/** Repère d'étape : anneau éteint, anneau vert qui s'allume au passage. */
function ConnectorNode({
  stop,
  progress,
  reduced,
}: {
  stop: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const lit = useTransform(progress, [stop - 0.025, stop], [0, 1]);
  const scale = useTransform(progress, [stop - 0.025, stop], [0.66, 1]);

  return (
    <span
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ top: `${stop * 100}%` }}
    >
      <span className="block size-7 rounded-full border-[5px] border-line bg-page lg:size-10 lg:border-[7px]" />
      <motion.span
        style={{ opacity: reduced ? 1 : lit, scale: reduced ? 1 : scale }}
        className="absolute inset-0 rounded-full border-[5px] border-forest bg-page shadow-[0_0_0_7px_rgba(20,57,42,0.07)] lg:border-[7px]"
      />
    </span>
  );
}

function ConnectorSpine({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [stops, setStops] = useState<number[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Mesure au montage puis à chaque changement de hauteur : le chargement
  // des polices, une réduction de la fenêtre ou un passage en colonne
  // unique déplacent le centre des blocs.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const base = container.getBoundingClientRect();
      if (base.height === 0) return;

      const rows = container.querySelectorAll<HTMLElement>(
        "[data-connector-row]",
      );
      setStops(
        Array.from(rows, (row) => {
          const rect = row.getBoundingClientRect();
          return (rect.top + rect.height / 2 - base.top) / base.height;
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  const first = stops[0] ?? 0;
  // Borne haute strictement supérieure à la borne basse : une plage
  // dégénérée renverrait NaN tant que la mesure n'a pas eu lieu.
  const last = Math.max(stops[stops.length - 1] ?? 1, first + 0.001);

  // Le remplissage est ramené sur la portion réellement tracée (du
  // premier au dernier repère), pas sur toute la hauteur du conteneur.
  const fill = useTransform(scrollYProgress, [first, last], [0, 1], {
    clamp: true,
  });
  const headTop = useTransform(fill, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-[13px] w-[7px] -translate-x-1/2 lg:left-1/2 lg:w-[11px]"
    >
      <div
        className="absolute inset-x-0"
        style={{ top: `${first * 100}%`, bottom: `${(1 - last) * 100}%` }}
      >
        {/* Rail éteint — on devine le chemin qui reste. */}
        <span className="absolute inset-0 rounded-full bg-line" />

        {/* Remplissage. `scaleY` est animé, jamais la hauteur. */}
        <motion.span
          style={{ scaleY: prefersReducedMotion ? 1 : fill }}
          className="absolute inset-0 origin-top rounded-full bg-[linear-gradient(180deg,var(--color-brass),var(--color-forest)_55%,var(--color-forest))]"
        />

        {/* Tête de tracé : elle marque où en est la lecture. */}
        {!prefersReducedMotion && (
          <motion.span
            style={{ top: headTop }}
            className="absolute left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest shadow-[0_0_0_7px_rgba(20,57,42,0.12)] lg:size-5"
          />
        )}

        {stops.map((stop, index) => (
          <ConnectorNode
            key={index}
            stop={(stop - first) / (last - first)}
            progress={prefersReducedMotion ? scrollYProgress : fill}
            reduced={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Composition du zigzag.
 * ------------------------------------------------------------------ */
type Block = {
  Icon: typeof IconBolt;
  title: string;
  body: string;
  aside: string;
  Visual: () => ReactNode;
  /** Côté de la maquette à partir de lg — le texte prend l'autre. */
  visualSide: "left" | "right";
};

const BLOCKS: Block[] = [
  {
    Icon: IconBolt,
    title: "Zéro temps perdu",
    body: "Vous décrochez les rendez-vous, on s’occupe du reste.",
    aside:
      "Relance, qualification, envoi de l’estimation, prise de rendez-vous : tout ce qui se répète passe en automatique.",
    Visual: AutopilotVisual,
    visualSide: "left",
  },
  {
    Icon: IconPulse,
    title: "Actif jour et nuit",
    body:
      "Le système ne prend jamais de pause — comme un employé permanent sur votre site.",
    aside:
      "Une demande à deux heures du matin reçoit la même réponse qu’une demande de onze heures. Personne n’attend l’ouverture.",
    Visual: NightWatchVisual,
    visualSide: "right",
  },
  {
    Icon: IconGauge,
    title: "Livré en 72h, sur-mesure",
    body: "Implémenté et optimisé pour votre agence, prêt à fonctionner en 3 jours.",
    aside:
      "Trois jours entre le premier échange et la mise en ligne : audit, montage, ouverture. Rien de générique.",
    Visual: DeliveryVisual,
    visualSide: "left",
  },
];

/**
 * Le texte arrive du côté opposé à sa maquette — mais seulement quand
 * le zigzag existe, c'est-à-dire à partir de lg. En colonne unique, un
 * glissement horizontal de 44 px déborderait de plus de 10 % de la
 * largeur d'un mobile ; l'entrée se fait alors par le bas.
 */
const textVariants = (fromLeft: boolean, sideways: boolean): Variants => ({
  hidden: sideways
    ? { opacity: 0, x: fromLeft ? -34 : 34 }
    : { opacity: 0, x: 0, y: 24 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
});

const visualVariants = (fromLeft: boolean, sideways: boolean): Variants => ({
  hidden: sideways
    ? { opacity: 0, x: fromLeft ? -44 : 44, scale: 0.96 }
    : { opacity: 0, x: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: EASE },
  },
});

export function WhyItWorks() {
  const isDesktop = useIsDesktop();
  const blocksRef = useRef<HTMLDivElement>(null);

  return (
    <section id="pourquoi" className="shell scroll-mt-28 py-24 sm:py-32">
      <h2 className="max-w-[18ch] text-balance font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">
        Un système qui travaille <Em>pour vous</Em>
      </h2>

      <div className="mt-10 border-t border-line" />

      {/* Le retrait à gauche dégage la place du fil en colonne unique ;
          à partir de lg le fil passe dans la gouttière centrale de la
          grille et le retrait n'a plus lieu d'être. */}
      <div
        ref={blocksRef}
        className="relative mt-14 flex flex-col gap-20 pl-11 sm:mt-16 sm:gap-28 lg:pl-0"
      >
        <ConnectorSpine containerRef={blocksRef} />

        {BLOCKS.map((block, index) => {
          const visualLeft = block.visualSide === "left";

          return (
            <div
              key={block.title}
              data-connector-row
              className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <motion.div
                variants={visualVariants(visualLeft, isDesktop)}
                initial="hidden"
                whileInView="visible"
                viewport={IN_VIEW}
                className={visualLeft ? "lg:order-1" : "lg:order-2"}
              >
                <block.Visual />
              </motion.div>

              <motion.div
                variants={textVariants(!visualLeft, isDesktop)}
                initial="hidden"
                whileInView="visible"
                viewport={IN_VIEW}
                className={cn("group", visualLeft ? "lg:order-2" : "lg:order-1")}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[10px] border border-line bg-panel text-forest transition-[transform,border-color,background-color,color] duration-300 group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:border-brass/50 group-hover:bg-blob/60 group-hover:text-brass">
                    <block.Icon className="size-[21px]" />
                  </span>
                  <span className="tnum font-display text-[0.78rem] font-semibold tracking-[0.16em] text-muted/70">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-[clamp(1.45rem,2.6vw,1.95rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-ink">
                  <span className="relative inline-block">
                    {block.title}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brass/70 transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                  </span>
                </h3>

                <p className="mt-4 max-w-[42ch] text-[1.02rem] leading-relaxed text-ink/80">
                  {block.body}
                </p>
                <p className="mt-3 max-w-[44ch] text-[0.92rem] leading-relaxed text-muted">
                  {block.aside}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
