"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { SITE } from "@/lib/content";
import { buildGeometry, frNumber, SERIES } from "@/lib/chart";
import { useCountUp, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconEstimate,
  IconExport,
  IconEye,
  IconGrid,
  IconKey,
  IconLock,
  IconReport,
  IconSliders,
  IconTrendUp,
  IconUsers,
} from "./icons";

/* ------------------------------------------------------------------ *
 * Chrome de navigateur — purement décoratif.
 * ------------------------------------------------------------------ */
function BrowserChrome() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line bg-panel/50 px-3 py-2.5 sm:px-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#DCD5C4]" />
          <span className="size-2.5 rounded-full bg-[#DCD5C4]" />
          <span className="size-2.5 rounded-full bg-[#DCD5C4]" />
        </div>
        <div className="hidden items-center gap-0.5 text-muted/60 sm:flex">
          <IconChevronLeft className="size-[15px]" />
          <IconChevronRight className="size-[15px]" />
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 rounded-pill border border-line bg-page px-3 py-1 text-[0.68rem] text-muted sm:text-[0.75rem]">
        <IconLock className="size-3 shrink-0" />
        <span className="truncate">visionestate.fr/dashboard</span>
      </div>

      <div />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sidebar — rail d'icônes sur mobile, colonne complète à partir de md.
 * ------------------------------------------------------------------ */
const SIDEBAR_ITEMS = [
  { label: "Tableau de bord", Icon: IconGrid, active: true },
  { label: "Leads", Icon: IconUsers, active: false },
  { label: "Estimations", Icon: IconEstimate, active: false },
  { label: "Rapports", Icon: IconReport, active: false },
  { label: "Paramètres", Icon: IconSliders, active: false },
];

function Sidebar() {
  return (
    <nav
      aria-label="Navigation du produit (démonstration)"
      className="w-[60px] shrink-0 border-r border-line p-2 md:w-[186px] md:p-3"
    >
      <ul className="flex flex-col gap-0.5">
        {SIDEBAR_ITEMS.map(({ label, Icon, active }) => (
          <li key={label}>
            <span
              title={label}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-pill px-0 py-2.5 text-[0.82rem] md:justify-start md:px-3 md:py-2",
                active ? "bg-panel font-medium text-ink" : "text-muted",
              )}
            >
              <Icon className="size-[17px] shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Cartes statistiques — count-up déclenché à l'entrée dans le viewport.
 * ------------------------------------------------------------------ */
type Stat = {
  label: string;
  Icon: typeof IconEye;
  target: number;
  format: (value: number) => string;
  footer: ReactNode;
};

const TREND_BADGE =
  "mt-3 inline-flex items-center gap-1 rounded-pill bg-forest/10 px-2 py-1 text-[0.69rem] font-medium text-forest";

const STATS: Stat[] = [
  {
    label: "Visiteurs ce mois",
    Icon: IconEye,
    target: 759,
    format: (value) => `+${frNumber(value)}`,
    footer: (
      <span className={TREND_BADGE}>
        <IconTrendUp className="size-2.5" />
        +18 % vs mois dernier
      </span>
    ),
  },
  {
    label: "Mandats signés",
    Icon: IconKey,
    target: 40,
    format: (value) => `+${frNumber(value)}`,
    footer: (
      <span className={TREND_BADGE}>
        <IconTrendUp className="size-2.5" />
        +12 ce mois
      </span>
    ),
  },
  {
    label: "Temps gagné/semaine",
    Icon: IconClock,
    target: 12,
    format: (value) => `${frNumber(value)}h`,
    footer: (
      <span className="mt-3 inline-block text-[0.69rem] leading-snug text-muted">
        de tâches manuelles en moins
      </span>
    ),
  },
];

function StatCard({
  stat,
  active,
  index,
}: {
  stat: Stat;
  active: boolean;
  index: number;
}) {
  const value = useCountUp(stat.target, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-card border border-line bg-panel/45 p-4 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brass/45 hover:bg-panel/70"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[0.78rem] leading-snug text-muted">{stat.label}</span>
        <span className="grid size-7 shrink-0 place-items-center rounded-[6px] border border-line bg-page text-forest transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          <stat.Icon className="size-[15px]" />
        </span>
      </div>
      <div className="tnum mt-3 font-display text-[1.75rem] font-semibold leading-none tracking-[-0.025em] text-ink">
        {stat.format(value)}
      </div>
      {stat.footer}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Panneau graphique.
 * ------------------------------------------------------------------ */
function ChartPanel() {
  const [seriesId, setSeriesId] = useState(SERIES[0].id);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px -8% 0px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  const series = SERIES.find((item) => item.id === seriesId) ?? SERIES[0];
  const geometry = buildGeometry(series.values);
  const peak = geometry.points[geometry.peakIndex];

  const shouldAnimate = isInView && !prefersReducedMotion;

  // Le tooltip reste dans le cadre quand le pic touche un bord.
  const tooltipAlign =
    peak.x > 80
      ? "-translate-x-full"
      : peak.x < 20
        ? "translate-x-0"
        : "-translate-x-1/2";

  return (
    <div ref={ref} className="rounded-card border border-line bg-panel/45 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-[0.95rem] font-semibold text-ink">
          Évolution des visiteurs
        </h3>
        <div
          role="tablist"
          aria-label="Période affichée"
          className="flex gap-0.5 rounded-pill border border-line bg-page p-0.5"
        >
          {SERIES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === seriesId}
              onClick={() => setSeriesId(item.id)}
              className={cn(
                "rounded-pill px-3 py-1 text-[0.72rem] transition-colors",
                item.id === seriesId
                  ? "bg-panel font-medium text-ink"
                  : "text-muted hover:text-ink",
              )}
            >
              {item.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <div className="tnum flex w-8 shrink-0 flex-col justify-between text-right text-[0.6rem] leading-none text-muted/70 sm:w-10 sm:text-[0.65rem]">
          {geometry.yTicks.map((tick) => (
            <span key={tick}>{frNumber(tick)}</span>
          ))}
        </div>

        <div className="relative h-[168px] flex-1 sm:h-[212px]">
          {/* Lignes de repère */}
          <div aria-hidden="true" className="absolute inset-0">
            {[10, 52, 94].map((top) => (
              <span
                key={top}
                style={{ top: `${top}%` }}
                className="absolute inset-x-0 border-t border-dashed border-line"
              />
            ))}
          </div>

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            role="img"
            aria-label={`Visiteurs sur ${series.tab.toLowerCase()}, de ${frNumber(
              series.values[0],
            )} à ${frNumber(series.values[series.values.length - 1])}, avec un pic à ${frNumber(
              series.values[geometry.peakIndex],
            )} le ${series.labels[geometry.peakIndex]}.`}
          >
            <defs>
              <linearGradient id="ve-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B5638" stopOpacity="0.26" />
                <stop offset="100%" stopColor="#1B5638" stopOpacity="0.05" />
              </linearGradient>
              <clipPath id="ve-area-clip">
                <motion.rect
                  key={`clip-${series.id}`}
                  x="0"
                  y="0"
                  height="100"
                  initial={{ width: shouldAnimate ? 0 : 100 }}
                  animate={{ width: 100 }}
                  transition={{ duration: shouldAnimate ? 1.5 : 0, ease: [0.33, 1, 0.68, 1] }}
                />
              </clipPath>
            </defs>

            {/* Aire et courbe partagent le même volet de découpe : le
                tracé se dessine de gauche à droite, son bord d'attaque
                suivant exactement la découpe.

                `pathLength` de Framer Motion n'est pas utilisable ici :
                il laisse un `stroke-dasharray` normalisé sur l'espace
                utilisateur, que `vector-effect: non-scaling-stroke`
                réévalue en espace écran — sur un viewBox étiré, la
                courbe finit trouée. */}
            <g clipPath="url(#ve-area-clip)">
              <path d={geometry.area} fill="url(#ve-area-fill)" />
              <path
                d={geometry.line}
                fill="none"
                stroke="#14392A"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>

          {/* Surcouche HTML : point de pic et tooltip, nets à toute taille */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <motion.span
              key={`dot-${series.id}`}
              style={{ left: `${peak.x}%`, top: `${peak.y}%` }}
              className="absolute grid size-2.5 -translate-x-1/2 -translate-y-1/2 place-items-center"
              initial={{ opacity: shouldAnimate ? 0 : 1, scale: shouldAnimate ? 0.4 : 1 }}
              animate={isInView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.35, delay: shouldAnimate ? 1.3 : 0 }}
            >
              {/* Halo qui respire : le pic garde l'œil après le tracé. */}
              <span className="pulse-ring absolute size-2.5 rounded-full bg-forest" />
              <span className="size-2.5 rounded-full border-2 border-page bg-forest" />
            </motion.span>
            <motion.span
              key={`tip-${series.id}`}
              style={{ left: `${peak.x}%`, top: `${peak.y}%` }}
              className={cn(
                // Le pic est toujours haut dans le cadre : sur mobile le
                // tooltip passe sous le point, faute de place au-dessus.
                "tnum absolute translate-y-[12px] whitespace-nowrap rounded-pill bg-forest px-2 py-1 text-[0.62rem] font-medium text-page sm:-translate-y-[calc(100%+16px)] sm:px-2.5 sm:py-1.5 sm:text-[0.66rem]",
                tooltipAlign,
              )}
              initial={{ opacity: shouldAnimate ? 0 : 1, y: shouldAnimate ? 6 : 0 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.4, delay: shouldAnimate ? 1.42 : 0 }}
            >
              {frNumber(series.values[geometry.peakIndex])}
              <span className="hidden sm:inline"> visiteurs</span> —{" "}
              {series.labels[geometry.peakIndex]}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="tnum mt-3 flex justify-between pl-11 text-[0.6rem] text-muted/70 sm:pl-13 sm:text-[0.65rem]">
        {series.ticks.map((tick, index) => (
          <span
            key={tick}
            // Une étiquette sur deux suffit sur les petits écrans.
            className={index % 2 === 1 ? "hidden sm:block" : undefined}
          >
            {series.labels[tick]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sources de trafic.
 * ------------------------------------------------------------------ */
const TRAFFIC = [
  { label: "SEO", share: 62, color: "#14392A" },
  { label: "Direct", share: 21, color: "#A9793D" },
  { label: "Réseaux sociaux", share: 17, color: "#8C9488" },
];

/**
 * Chips de sources — entrée décalée, puis micro-interaction au survol :
 * la part se remplit, la puce grossit, la pastille se détache. Les
 * chips restent des `span` : rien n'est cliquable dans une maquette.
 */
function TrafficChips({ active }: { active: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[0.72rem] text-muted">Sources</span>
      {TRAFFIC.map((source, index) => (
        <motion.span
          key={source.label}
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.45, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
          className="group relative inline-flex cursor-default items-center gap-2 overflow-hidden rounded-pill border border-line bg-page px-3 py-1.5 text-[0.74rem] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brass/50 hover:shadow-[0_4px_14px_-8px_rgba(20,23,26,0.35)]"
        >
          {/* Part de trafic révélée au survol, derrière le libellé */}
          <span
            aria-hidden="true"
            style={{ width: `${source.share}%`, backgroundColor: source.color }}
            className="absolute inset-y-0 left-0 origin-left scale-x-0 opacity-10 transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <span
            aria-hidden="true"
            className="relative size-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-[1.6]"
            style={{ backgroundColor: source.color }}
          />
          <span className="relative text-ink">{source.label}</span>
          <span className="tnum relative text-muted">{source.share} %</span>
        </motion.span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Bloc complet : glow en arc, dashboard, mention.
 * ------------------------------------------------------------------ */
export function DashboardShowcase() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div id="dashboard" className="relative mt-14 sm:mt-20">
      {/* Arc lumineux : l'ellipse est centrée sur le bord haut du
          dashboard, qui en masque la moitié basse. */}
      <div
        aria-hidden="true"
        // La largeur ne dépasse jamais celle du conteneur : sinon l'arc
        // crée un débordement horizontal sur mobile.
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-[340px] w-[min(1280px,100%)] -translate-x-1/2 -translate-y-1/2 sm:h-[520px]"
      >
        <div className="size-full rounded-[50%] bg-[radial-gradient(closest-side,rgba(237,228,206,0.95),rgba(237,228,206,0.5)_52%,rgba(237,228,206,0)_78%)] blur-[52px]" />
      </div>

      <div className="shell relative z-10">
        <div className="relative overflow-hidden rounded-card border border-line bg-page shadow-flat">
          {/* Filet de lumière sur l'arête haute */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(169,121,61,0.38),transparent)]"
          />

          {/* Brillance qui balaie la carte une fois, au chargement : le
              dashboard accroche l'œil avant même d'être atteint au scroll. */}
          <span
            aria-hidden="true"
            className="sheen pointer-events-none z-20"
          />

          <BrowserChrome />

          <div className="flex">
            <Sidebar />

            <div className="min-w-0 flex-1">
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-4 py-4 sm:px-5 sm:py-5">
                <div>
                  <h2 className="font-display text-[1rem] font-semibold text-ink sm:text-[1.08rem]">
                    Bonjour, {SITE.demoAgency} 👋
                  </h2>
                  <p className="mt-1 text-[0.8rem] leading-snug text-muted">
                    Voici ce qui se passe sur votre système d’acquisition
                    aujourd’hui.
                  </p>
                </div>
                <div aria-hidden="true" className="flex items-center gap-2">
                  {/* Témoin « en direct » : le seul mouvement continu de
                      la carte, assez discret pour ne pas fatiguer. */}
                  <span className="inline-flex items-center gap-2 rounded-pill border border-line px-3 py-1.5 text-[0.72rem] text-muted">
                    <span className="relative grid size-1.5 place-items-center">
                      <span className="pulse-ring absolute size-1.5 rounded-full bg-forest" />
                      <span className="size-1.5 rounded-full bg-forest" />
                    </span>
                    En direct
                  </span>
                  <span className="hidden items-center gap-1.5 rounded-pill border border-line px-3 py-1.5 text-[0.72rem] text-muted sm:inline-flex">
                    <IconCalendar className="size-3.5" />
                    {SITE.demoDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-forest px-3 py-1.5 text-[0.72rem] font-medium text-page">
                    <IconExport className="size-3.5" />
                    Exporter
                  </span>
                </div>
              </header>

              <div
                ref={statsRef}
                className="grid gap-3 px-4 py-4 sm:grid-cols-3 sm:px-5 sm:py-5"
              >
                {STATS.map((stat, index) => (
                  <StatCard
                    key={stat.label}
                    stat={stat}
                    active={statsInView}
                    index={index}
                  />
                ))}
              </div>

              <div className="px-4 sm:px-5">
                <ChartPanel />
              </div>

              <div className="px-4 py-5 sm:px-5">
                <TrafficChips active={statsInView} />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[0.72rem] italic text-muted/85">
          Exemple illustratif basé sur un usage type — pas des données clients
          réelles.
        </p>
      </div>
    </div>
  );
}
