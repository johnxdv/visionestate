"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useScroll,
  useSpring,
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
    {
      title: "Agence Bellevue — Estimation en 30 secondes",
      url: "agence-bellevue.fr",
      own: true,
    },
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

/* ------------------------------------------------------------------ *
 * Étape tunnel — les paliers qui se resserrent jusqu'au rendez-vous.
 *
 * La barre de remplissage porte le rétrécissement, pas la ligne : un
 * palier étroit ne peut donc plus rogner son propre libellé, quelle que
 * soit la longueur du texte ou la largeur disponible.
 * ------------------------------------------------------------------ */
const FUNNEL_STEPS = [
  { label: "Visiteur", value: "1 240", share: 100 },
  { label: "Estimation lancée", value: "870", share: 70 },
  { label: "Coordonnées laissées", value: "412", share: 33 },
  { label: "Rendez-vous pris", value: "186", share: 15 },
];

function FunnelStage() {
  return (
    <div className="w-full max-w-[420px] rounded-card border border-line bg-page/90 p-4 shadow-flat backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.8rem] font-medium text-ink">
          Tunnel — 7 derniers jours
        </span>
        <span className="shrink-0 rounded-pill bg-brass/12 px-2 py-0.5 text-[0.65rem] font-medium text-brass">
          15 % de RDV
        </span>
      </div>

      {/* `relative` : c'est le repère de la goutte qui descend les
          paliers. `overflow-hidden` garantit qu'elle ne sort jamais. */}
      <ul className="relative mt-3 flex flex-col gap-2 overflow-hidden">
        {FUNNEL_STEPS.map((step, index) => {
          const isLast = index === FUNNEL_STEPS.length - 1;

          return (
            <li
              key={step.label}
              className={`relative overflow-hidden rounded-card border px-3 py-2.5 ${
                isLast ? "border-brass/50" : "border-line"
              }`}
            >
              {/* Remplissage : la largeur dit la part, l'animation dit
                  que le flux ne s'arrête pas. */}
              <span
                aria-hidden="true"
                className={`funnel-fill absolute inset-y-0 left-0 ${
                  isLast ? "bg-blob/80" : "bg-panel/70"
                }`}
                style={
                  {
                    width: `${step.share}%`,
                    "--fill-delay": `${index * 0.26}s`,
                  } as CSSProperties
                }
              />

              <span className="relative flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-[0.82rem] text-ink">
                  {isLast && <IconCheck className="size-3.5 shrink-0 text-brass" />}
                  <span className="truncate">{step.label}</span>
                </span>
                <span className="tnum shrink-0 text-[0.75rem] text-muted">
                  {step.value}
                </span>
              </span>
            </li>
          );
        })}

        {/* La goutte : un prospect qui traverse les paliers, en boucle. */}
        <span
          aria-hidden="true"
          className="funnel-drop pointer-events-none absolute left-[7px] top-1 size-1.5 rounded-full bg-brass"
          style={{ "--drop-travel": "148px" } as CSSProperties}
        />
      </ul>
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
        {/* Le glint traverse le chiffre en boucle : la valeur ne se
            contente pas d'être affichée, elle scintille. */}
        <div className="tnum glint mt-1 font-display text-[1.85rem] font-extrabold leading-none tracking-[-0.03em] text-ink">
          418 500 €
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-brass/12 px-2.5 py-1 text-[0.68rem] font-medium text-brass">
            <IconSparkle className="size-3" />
            40+ données croisées
          </span>
          <span className="tnum text-[0.7rem] text-muted">2 clics · 30 secondes</span>
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
  /** Repère affiché dans le compteur d'étape. */
  tag: string;
  line: ReactNode;
  support?: string;
  layout: "opener" | "split-right" | "split-left";
  visual?: () => ReactNode;
};

const BEATS: Beat[] = [
  {
    key: "ouverture",
    tag: "Être trouvé",
    line: (
      <>
        5 étapes, <Em>efficace</Em>.
      </>
    ),
    layout: "opener",
  },
  {
    key: "seo",
    tag: "SEO",
    line: "Devenez numéro 1 sur les moteurs de recherche.",
    support: "Le SEO capte tout le flux entrant, sans interruption.",
    layout: "split-right",
    visual: SerpStage,
  },
  {
    key: "pivot",
    tag: "Convertir",
    line: (
      <>
        Ne perdez plus <Em>un seul mandat</Em>.
      </>
    ),
    layout: "opener",
  },
  {
    key: "tunnel",
    tag: "Le tunnel",
    line: "Un tunnel révolutionnaire, optimisé psychologiquement.",
    support:
      "Chaque écran est dessiné pour faire avancer le prospect — jusqu’au rendez-vous.",
    layout: "split-left",
    visual: FunnelStage,
  },
  {
    key: "estimateur",
    tag: "L’estimateur",
    line: "Au centre : l’estimateur le plus rapide du marché.",
    support: "40+ données croisées. Une estimation en 30 secondes.",
    layout: "split-right",
    visual: EstimateStage,
  },
];

const HEADLINE =
  "text-balance font-display font-extrabold leading-[1.1] tracking-[-0.035em] text-ink";

const SUPPORT = "max-w-[38ch] text-pretty text-[1rem] leading-relaxed text-muted";

/* ------------------------------------------------------------------ *
 * Décors continus — ils bougent pendant tout le scroll, pas seulement
 * aux changements d'étape.
 * ------------------------------------------------------------------ */

/** Poussières en suspension : le seul mouvement totalement autonome. */
const SPECKS = [
  { left: "8%", size: 4, duration: "19s", delay: "0s", drift: "5vw" },
  { left: "21%", size: 3, duration: "24s", delay: "-6s", drift: "-3vw" },
  { left: "37%", size: 5, duration: "16s", delay: "-11s", drift: "4vw" },
  { left: "52%", size: 3, duration: "27s", delay: "-3s", drift: "-5vw" },
  { left: "68%", size: 4, duration: "21s", delay: "-14s", drift: "3vw" },
  { left: "81%", size: 3, duration: "18s", delay: "-8s", drift: "-4vw" },
  { left: "93%", size: 4, duration: "25s", delay: "-17s", drift: "2vw" },
];

function Specks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPECKS.map((speck) => (
        <span
          key={speck.left}
          className="speck bottom-0"
          style={
            {
              left: speck.left,
              width: speck.size,
              height: speck.size,
              "--speck-duration": speck.duration,
              "--speck-delay": speck.delay,
              "--speck-drift": speck.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Nappe lumineuse pilotée au scroll : elle traverse la bande d'un bord
 * à l'autre et change de teinte en route. C'est ce qui donne au fond
 * une progression continue, indépendante des paliers d'étape.
 */
function AuroraWash({ progress }: { progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 1], ["-24%", "108%"]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.9, 1.25, 0.95]);
  const background = useTransform(
    progress,
    [0, 0.5, 1],
    [
      "radial-gradient(closest-side, rgba(237,228,206,0.85), rgba(237,228,206,0) 74%)",
      "radial-gradient(closest-side, rgba(169,121,61,0.3), rgba(169,121,61,0) 74%)",
      "radial-gradient(closest-side, rgba(20,57,42,0.26), rgba(20,57,42,0) 74%)",
    ],
  );

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, scale, background }}
      className="pointer-events-none absolute left-0 top-[14%] size-[62vh] -translate-x-1/2 rounded-[50%] blur-[60px]"
    />
  );
}

/** Rail de progression + repère d'étape, en haut de la bande. */
function ProgressRail({
  progress,
  beatIndex,
}: {
  progress: MotionValue<number>;
  beatIndex: MotionValue<number>;
}) {
  const [label, setLabel] = useState(BEATS[0].tag);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const unsubscribe = beatIndex.on("change", (value) => {
      const index = Math.min(BEATS.length - 1, Math.max(0, Math.round(value)));
      setLabel(BEATS[index].tag);
      setStep(index + 1);
    });
    return unsubscribe;
  }, [beatIndex]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[13vh] z-10 mx-auto w-full max-w-[1180px] px-8"
    >
      <div className="flex items-center gap-4">
        <span className="tnum shrink-0 font-display text-[0.72rem] font-semibold tracking-[0.18em] text-muted/70">
          0{step} / 0{BEATS.length}
        </span>
        <div className="relative h-px flex-1 bg-line">
          <motion.span
            style={{ scaleX: progress }}
            className="absolute inset-0 origin-left bg-forest"
          />
        </div>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="shrink-0 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted"
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Le fil conducteur : une ligne qui traverse la bande et se dessine au
 * rythme du scroll, jalonnée d'un repère par étape et suivie par une
 * comète qui en marque la tête.
 *
 * Le SVG garde ses proportions (`meet`, pas de viewBox étiré) : c'est la
 * condition pour que `pathLength` produise un tracé plein et régulier.
 * ------------------------------------------------------------------ */
const THREAD_PATH =
  "M24 132 C 120 132, 168 44, 262 44 C 356 44, 424 128, 518 128 C 612 128, 676 38, 770 38 C 864 38, 906 118, 976 118";

const THREAD_NODES = [
  { x: 24, y: 132 },
  { x: 262, y: 44 },
  { x: 518, y: 128 },
  { x: 770, y: 38 },
  { x: 976, y: 118 },
];

/**
 * Épaisseur du fil, en unités du viewBox. Le SVG garde ses proportions
 * et occupe toute la largeur : l'épaisseur rendue suit donc la largeur
 * de l'écran — de l'ordre de 12 px sur un portable, 18 px sur un grand
 * écran. C'est le trait qui porte la section, pas un filet.
 */
const THREAD_WEIGHT = 12;

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
      r={13}
      fill="var(--color-page)"
      stroke="var(--color-forest)"
      strokeWidth={5}
      style={{ opacity, scale, transformOrigin: `${node.x}px ${node.y}px` }}
    />
  );
}

/**
 * Comète en tête de tracé. La position est lue sur le path lui-même
 * (`getPointAtLength`) plutôt que via `offset-path` : le placement est
 * exact, et il ne dépend d'aucune propriété CSS au support inégal.
 */
function ThreadComet({
  pathRef,
  progress,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  progress: MotionValue<number>;
}) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, [pathRef]);

  const pointAt = (p: number, axis: "x" | "y") => {
    const path = pathRef.current;
    if (!path || length === 0) return THREAD_NODES[0][axis];
    const clamped = Math.min(1, Math.max(0, p));
    return path.getPointAtLength(clamped * length)[axis];
  };

  const x = useTransform(progress, (p) => pointAt(p, "x"));
  const y = useTransform(progress, (p) => pointAt(p, "y"));

  return (
    <motion.g style={{ x, y }}>
      <circle r={32} fill="var(--color-forest)" opacity={0.1} />
      <circle r={19} fill="var(--color-forest)" opacity={0.2} />
      <circle r={9} fill="var(--color-forest)" />
    </motion.g>
  );
}

function Thread({ progress }: { progress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null);

  return (
    // Pleine largeur, posé au ras du bas : le fil court d'un bord à
    // l'autre de la section au lieu de rester dans la colonne de texte.
    // La largeur est bornée parce que le SVG garde ses proportions —
    // sans borne, sa hauteur grandirait avec l'écran jusqu'à mordre sur
    // les compositions.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1800px]"
    >
      <svg viewBox="0 0 1000 170" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="ve-thread" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A9793D" />
            <stop offset="55%" stopColor="#1F8A5F" />
            <stop offset="100%" stopColor="#14392A" />
          </linearGradient>
        </defs>

        {/* Trace fantôme : on devine le chemin restant à parcourir. */}
        <path
          ref={pathRef}
          d={THREAD_PATH}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={THREAD_WEIGHT}
          strokeLinecap="round"
        />

        {/* Halo — un second passage très large et très pâle sous le
            tracé : le fil pèse sans que la couleur ne s'alourdisse. */}
        <motion.path
          d={THREAD_PATH}
          fill="none"
          stroke="var(--color-forest)"
          strokeWidth={THREAD_WEIGHT * 2.6}
          strokeLinecap="round"
          opacity={0.1}
          style={{ pathLength: progress }}
        />

        <motion.path
          d={THREAD_PATH}
          fill="none"
          stroke="url(#ve-thread)"
          strokeWidth={THREAD_WEIGHT}
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
        <ThreadComet pathRef={pathRef} progress={progress} />
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

  /** Avancement à l'intérieur du créneau, de 0 à 1. */
  const local = (p: number) => Math.min(1, Math.max(0, (p - start) / span));

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

  // Parallaxe interne : pendant toute la traversée du créneau, le texte
  // et la maquette dérivent à des vitesses différentes. Le plan continue
  // de vivre entre deux changements d'étape.
  const textDrift = useTransform(progress, (p) => (0.5 - local(p)) * 26);
  const visualDrift = useTransform(progress, (p) => (local(p) - 0.5) * 46);
  const visualTilt = useTransform(progress, (p) => (local(p) - 0.5) * 2.6);
  const visualZoom = useTransform(progress, (p) => 1 + (0.5 - Math.abs(0.5 - local(p))) * 0.05);
  // Les respirations gagnent un léger zoom continu : le titre avance
  // vers le lecteur tout au long de son créneau.
  const openerZoom = useTransform(progress, (p) => 0.97 + local(p) * 0.06);

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
        className="absolute inset-0 flex flex-col items-center justify-center px-8 pb-[26vh] text-center"
      >
        <motion.p
          style={{ scale: openerZoom }}
          className={`${HEADLINE} max-w-[24ch] text-[clamp(2.1rem,4.6vw,3.4rem)]`}
        >
          {beat.line}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center px-8 pb-[26vh]"
    >
      <div
        className={`grid w-full max-w-[1000px] items-center gap-12 lg:grid-cols-2 ${
          beat.layout === "split-left" ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div style={{ y: textDrift }} className="flex flex-col gap-5">
          <p className={`${HEADLINE} max-w-[20ch] text-[clamp(1.7rem,3.4vw,2.6rem)]`}>
            {beat.line}
          </p>
          {beat.support && <p className={SUPPORT}>{beat.support}</p>}
        </motion.div>

        {Visual && (
          <motion.div
            style={{
              x: visualShift,
              y: visualDrift,
              rotate: visualTilt,
              scale: visualZoom,
            }}
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

  // Le fil et la nappe suivent une version lissée du scroll : leur
  // mouvement continue une fraction de seconde après l'arrêt, ce qui
  // donne de la matière au geste. Les compositions, elles, restent
  // pilotées par la valeur brute — leur enchaînement doit rester net.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.0005,
  });

  const beatIndex = useTransform(
    scrollYProgress,
    (p) => p * BEATS.length - 0.5,
  );

  return (
    // Hauteur de la piste = course de scroll + les 100vh que la bande
    // sticky immobilise. La course utile passe de 400vh à ~267vh :
    // l'enchaînement des cinq temps avance environ 50 % plus vite.
    <div ref={ref} className="relative h-[367vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <AuroraWash progress={smooth} />
        <Specks />
        <ProgressRail progress={smooth} beatIndex={beatIndex} />

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

        <Thread progress={smooth} />
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
      <div className="relative pl-12">
        {/* Fil conducteur vertical : rail clair, remplissage piloté au
            scroll. `scaleY` est animé, jamais la hauteur.

            Même épaisseur que le fil de « Pourquoi ça marche » : les
            deux sections se suivent, leur fil doit se lire comme le
            même objet d'une section à l'autre. */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-[7px] rounded-full bg-line"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: prefersReducedMotion ? 1 : scrollYProgress }}
          className="absolute bottom-2 left-[7px] top-2 w-[7px] origin-top rounded-full bg-[linear-gradient(180deg,var(--color-brass),var(--color-forest)_55%,var(--color-forest))]"
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
                  // Le repère de 21px se centre sur l'axe du rail, à
                  // 10,5 px du bord du conteneur. Il est posé dans le
                  // bloc, lui-même en retrait de 48px : -48px ramène son
                  // bord gauche à 0, donc son centre à 10,5 px.
                  className="absolute -left-12 top-1 size-[21px] rounded-full border-[5px] border-forest bg-page"
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
