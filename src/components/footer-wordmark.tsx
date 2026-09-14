"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ *
 * Signature de bas de page — « VISION ESTATE » en très grand, en
 * contour fin. Rien d'autre : pas de forme posée dans les lettres, pas
 * d'icône, pas de fond.
 *
 * Le parti pris est la masse, pas la lecture. Le mot est dessiné plus
 * large que son cadre (`OVERSCALE`) et déborde des deux côtés : le
 * `viewBox` le rogne à gauche et à droite, et le cadre lui-même est
 * calé au plus près des capitales. Ce qu'on gagne en hauteur de lettre
 * — le corps grandit d'autant — on le perd en lisibilité du mot entier,
 * et c'est l'échange voulu. `OVERSCALE` est le seul réglage à toucher
 * pour resserrer ou relâcher ce cadrage.
 *
 * En dessous de `sm`, le mot passe sur deux lignes : une seule ligne de
 * treize lettres à cette largeur écraserait les capitales.
 *
 * Le contour est tracé en `non-scaling-stroke` : son épaisseur est
 * donnée en pixels écran et ne suit pas l'échelle du `viewBox`. C'est
 * la seule façon de garder le même filet, très fin, quelle que soit la
 * largeur du pied de page ou la variante affichée.
 *
 * Deux mouvements, tous deux tenus bas :
 *
 * 1. Le tracé se dessine de gauche à droite quand le pied de page entre
 *    dans le champ, une seule fois. Le volet est animé par Framer (rAF)
 *    et non par une animation CSS : pas de timeline de document à
 *    geler, donc pas de première keyframe où rester épinglé.
 * 2. Les lettres respirent une à une : l'opacité du filet descend puis
 *    revient, décalée d'une lettre à l'autre, si bien qu'une onde très
 *    lente traverse le mot en continu. Le décalage est négatif — chaque
 *    lettre démarre déjà engagée dans son cycle, il n'y a donc pas
 *    d'instant où le mot bat d'un seul bloc.
 * 3. Une brillance parcourt ensuite le contour en boucle lente : une
 *    copie du tracé en brass, révélée par une bande qui balaie le mot.
 *    Le balayage est une translation CSS sur le `<rect>` du masque —
 *    un élément transformable, contrairement au dégradé lui-même, sur
 *    lequel une animation CSS n'aurait aucun effet. Si elle ne se joue
 *    pas, la bande reste hors cadre : il ne manque que la brillance,
 *    jamais le mot.
 * ------------------------------------------------------------------ */

/**
 * Débord du mot par rapport à la largeur du cadre. 1 = le mot tient
 * juste dedans ; au-delà, il est rogné à gauche et à droite et les
 * capitales gagnent la même proportion en hauteur.
 */
const OVERSCALE = 2.2;

type Lettering = {
  /** Lignes du mot et position de leur ligne de base, en unités SVG. */
  lines: { text: string; y: number }[];
  /** Hauteur du cadre : rognée sur les capitales. */
  height: number;
  /** Corps du texte, en unités SVG. */
  fontSize: number;
};

/** Une ligne — corps calé pour que le mot déborde de `OVERSCALE`. */
const ONE_LINE: Lettering = {
  lines: [{ text: "VISION ESTATE", y: 168 }],
  height: 176,
  fontSize: Math.round(104 * OVERSCALE),
};

/** Deux lignes — même parti pris, appliqué mot à mot. */
const TWO_LINES: Lettering = {
  lines: [
    { text: "VISION", y: 282 },
    { text: "ESTATE", y: 612 },
  ],
  height: 628,
  fontSize: Math.round(175 * OVERSCALE),
};

/** Filet du contour, en pixels écran (voir `non-scaling-stroke`). */
const STROKE_PX = 0.75;

/** Décalage de la respiration d'une lettre à la suivante, en secondes. */
const LETTER_STAGGER = 0.16;

/** Rang de la première lettre d'une ligne dans le mot entier. */
function offsetOf(art: Lettering, lineIndex: number): number {
  return art.lines
    .slice(0, lineIndex)
    .reduce((total, line) => total + line.text.length, 0);
}

/**
 * Découpe la ligne en `tspan`, un par lettre, pour que chacune porte
 * son propre décalage. Le `transform` n'étant pas appliqué aux `tspan`,
 * la respiration porte sur l'opacité du trait — la seule propriété que
 * ces éléments savent animer.
 */
function letters(text: string, offset: number) {
  return [...text].map((letter, index) => (
    <tspan
      key={`${letter}-${index}`}
      className="ve-letter"
      style={{ animationDelay: `${-(offset + index) * LETTER_STAGGER}s` }}
    >
      {letter}
    </tspan>
  ));
}

/**
 * Délai au-delà duquel le tracé s'affiche sans attendre le passage dans
 * le champ. L'observateur d'intersection ne rend la main que si le
 * document peint ; ce filet garantit qu'un pied de page atteint pendant
 * un gel de rendu ne reste pas vide.
 */
const DRAW_FALLBACK_MS = 6000;

export function FooterWordmark() {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Le rendu serveur part de la variante étroite (mobile-first) ; la
  // vraie valeur est adoptée juste après l'hydratation.
  const isWide = useMediaQuery("(min-width: 640px)");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setElapsed(true), DRAW_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const drawn = inView || elapsed || prefersReducedMotion;
  const art = isWide ? ONE_LINE : TWO_LINES;

  const textProps = {
    x: 500,
    textAnchor: "middle" as const,
    fill: "none",
    strokeWidth: STROKE_PX,
    vectorEffect: "non-scaling-stroke" as const,
    style: { fontSize: `${art.fontSize}px` },
    className: "ve-wordmark-text",
  };

  return (
    <div
      aria-hidden="true"
      className="ve-wordmark pointer-events-none select-none overflow-hidden pb-6 pt-8 sm:pb-8 sm:pt-10"
    >
      <motion.svg
        ref={ref}
        viewBox={`0 0 1000 ${art.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full"
        initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
        animate={{
          clipPath: drawn ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
        }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 1.6, ease: EASE }
        }
      >
        <defs>
          {/* Bande de brillance : blanche au centre, noire aux extrémités
              — dans un masque, c'est un fondu d'entrée et de sortie. */}
          <linearGradient id="ve-sheen-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" />
            <stop offset="50%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <mask
            id="ve-sheen-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1000"
            height={art.height}
          >
            <rect
              className="ve-sheen-band"
              x="-440"
              y="0"
              width="440"
              height={art.height}
              fill="url(#ve-sheen-band)"
            />
          </mask>
        </defs>

        {/* Tracé de fond — la teinte discrète, toujours posée. */}
        {art.lines.map((line, lineIndex) => (
          <text
            key={line.text}
            {...textProps}
            y={line.y}
            stroke="var(--color-line)"
          >
            {letters(line.text, offsetOf(art, lineIndex))}
          </text>
        ))}

        {/* Tracé de brillance — le même mot, révélé par la bande. Les
            lettres y respirent en phase avec celles du fond : les deux
            couches se superposent exactement. */}
        <g mask="url(#ve-sheen-mask)" opacity="0.75">
          {art.lines.map((line, lineIndex) => (
            <text
              key={line.text}
              {...textProps}
              y={line.y}
              stroke="var(--color-brass)"
            >
              {letters(line.text, offsetOf(art, lineIndex))}
            </text>
          ))}
        </g>
      </motion.svg>
    </div>
  );
}
