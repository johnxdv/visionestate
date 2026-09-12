"use client";

import { motion } from "framer-motion";
import { EASE, IN_VIEW } from "@/lib/motion";
import { Em } from "./ui";
import { IconBolt, IconGauge, IconPulse } from "./icons";

const PILLARS = [
  {
    Icon: IconBolt,
    title: "Zéro temps perdu",
    body: "Vous décrochez les rendez-vous, on s’occupe du reste.",
  },
  {
    Icon: IconPulse,
    title: "Actif jour et nuit",
    body: "Le système ne prend jamais de pause — comme un employé permanent sur votre site.",
  },
  {
    Icon: IconGauge,
    title: "Livré en 72h, sur-mesure",
    body: "Implémenté et optimisé pour votre agence, prêt à fonctionner en 3 jours.",
  },
];

/** Le pictogramme se pose en tournant, le texte suit. */
const PILLAR_SEQUENCE = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const PILLAR_ICON = {
  hidden: { opacity: 0, scale: 0.7, rotate: -14 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.62, ease: EASE },
  },
};

const PILLAR_TEXT = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function WhyItWorks() {
  return (
    <section id="pourquoi" className="shell scroll-mt-28 py-24 sm:py-32">
      <h2 className="max-w-[18ch] text-balance font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">
        Un système qui travaille <Em>pour vous</Em>, pas l’inverse
      </h2>

      <div className="mt-10 border-t border-line" />

      <div className="mt-12 grid gap-10 sm:gap-8 md:grid-cols-3 md:gap-10">
        {PILLARS.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            variants={PILLAR_SEQUENCE}
            initial="hidden"
            whileInView="visible"
            viewport={IN_VIEW}
            transition={{ delayChildren: index * 0.1 }}
            // `group` : le survol de la colonne entière anime le
            // pictogramme et fait courir le filet sous le titre.
            className="group"
          >
            <motion.span
              variants={PILLAR_ICON}
              className="grid size-11 place-items-center rounded-[10px] border border-line bg-panel text-forest transition-[transform,border-color,background-color,color] duration-300 group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:border-brass/50 group-hover:bg-blob/60 group-hover:text-brass"
            >
              <pillar.Icon className="size-[21px]" />
            </motion.span>

            <motion.h3
              variants={PILLAR_TEXT}
              className="mt-5 font-display text-[1.12rem] font-extrabold tracking-[-0.015em] text-ink"
            >
              <span className="relative inline-block">
                {pillar.title}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brass/70 transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </span>
            </motion.h3>

            <motion.p
              variants={PILLAR_TEXT}
              className="mt-2.5 max-w-[36ch] text-[0.93rem] leading-relaxed text-muted"
            >
              {pillar.body}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
