/* ------------------------------------------------------------------ *
 * Données et géométrie du graphique « Évolution des visiteurs ».
 *
 * Données illustratives.
 * Aucun formatage via Intl au rendu : les libellés et les nombres sont
 * produits de façon déterministe pour éviter tout écart d'hydratation
 * entre le serveur et le navigateur.
 * ------------------------------------------------------------------ */

const MONTHS_SHORT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

/** Espace fine insécable comme séparateur de milliers (typographie FR). */
export function frNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Suite de libellés « 14 août », « 15 août »… à partir d'une date. */
function dayLabels(startYear: number, startMonth: number, startDay: number, count: number) {
  const labels: string[] = [];
  const cursor = new Date(Date.UTC(startYear, startMonth, startDay));
  for (let i = 0; i < count; i += 1) {
    labels.push(`${cursor.getUTCDate()} ${MONTHS_SHORT[cursor.getUTCMonth()]}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return labels;
}

export type Series = {
  id: string;
  tab: string;
  values: number[];
  labels: string[];
  /** Index des points étiquetés sous l'axe X. */
  ticks: number[];
};

/** 30 jours glissants : 14 août → 12 sept. 2026. */
const DAILY_VALUES = [
  380, 402, 371, 445, 428, 493, 512, 468, 540, 587, 561, 634, 610, 688, 712,
  675, 754, 806, 781, 852, 897, 869, 944, 1010, 1078, 1204, 1132, 1096, 1150,
  1187,
];

/** 12 mois : oct. 2025 → sept. 2026. */
const MONTHLY_VALUES = [
  4210, 4880, 5340, 6120, 7450, 8930, 10240, 12680, 15340, 19220, 24610, 28640,
];

const MONTHLY_LABELS = [
  "oct. 2025",
  "nov. 2025",
  "déc. 2025",
  "janv. 2026",
  "févr. 2026",
  "mars 2026",
  "avr. 2026",
  "mai 2026",
  "juin 2026",
  "juil. 2026",
  "août 2026",
  "sept. 2026",
];

export const SERIES: Series[] = [
  {
    id: "30j",
    tab: "30 jours",
    values: DAILY_VALUES,
    labels: dayLabels(2026, 7, 14, DAILY_VALUES.length),
    ticks: [0, 8, 16, 23, 29],
  },
  {
    id: "12m",
    tab: "12 mois",
    values: MONTHLY_VALUES,
    labels: MONTHLY_LABELS,
    ticks: [0, 3, 6, 9, 11],
  },
];

export type Point = { x: number; y: number };

/**
 * Catmull-Rom converti en courbes de Bézier cubiques : un tracé lisse
 * qui passe exactement par chaque point, sans dépassement marqué.
 */
function smoothPath(points: Point[], tension = 0.16): string {
  if (points.length < 2) return "";

  let d = `M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) * tension;
    const c1y = p1.y + (p2.y - p0.y) * tension;
    const c2x = p2.x - (p3.x - p1.x) * tension;
    const c2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${c1x.toFixed(3)} ${c1y.toFixed(3)}, ${c2x.toFixed(3)} ${c2y.toFixed(
      3,
    )}, ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`;
  }

  return d;
}

export type Geometry = {
  points: Point[];
  line: string;
  area: string;
  peakIndex: number;
  /** Bornes de l'axe Y, du haut vers le bas. */
  yTicks: number[];
};

/**
 * Géométrie normalisée dans un viewBox 0 0 100 100. Le SVG est étiré
 * (`preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`),
 * ce qui permet de réutiliser les mêmes coordonnées en pourcentages pour
 * les surcouches HTML (point de pic, tooltip) — texte net à toute taille.
 */
export function buildGeometry(values: number[]): Geometry {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  const top = 10;
  const bottom = 94;

  const points: Point[] = values.map((value, index) => ({
    x: (index / (values.length - 1)) * 100,
    y: bottom - ((value - min) / span) * (bottom - top),
  }));

  const line = smoothPath(points);

  return {
    points,
    line,
    area: `${line} L 100 100 L 0 100 Z`,
    peakIndex: values.indexOf(max),
    yTicks: [max, Math.round((max + min) / 2), min],
  };
}
