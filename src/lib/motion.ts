import type { Variants } from "framer-motion";

/** Courbe d'attaque commune : sortie franche, arrivée posée. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Séquence d'entrée du hero : badge → titre → sous-titre → CTA. */
export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.13 },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE },
  },
};

/** Apparition standard à l'entrée dans le viewport. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Marge de déclenchement des `whileInView` (le bloc doit être engagé). */
export const IN_VIEW = { once: true, margin: "-12% 0px -12% 0px" } as const;
