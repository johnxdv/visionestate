"use client";

import { motion } from "framer-motion";
import { IN_VIEW, riseIn } from "@/lib/motion";
import { Badge } from "./ui";
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

export function WhyItWorks() {
  return (
    <section id="pourquoi" className="shell scroll-mt-28 py-24 sm:py-32">
      {/* En-tête asymétrique : titre à gauche, précision à droite */}
      <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
        <div>
          <Badge>Pourquoi ça marche</Badge>
          <h2 className="mt-5 max-w-[16ch] text-balance font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Un système qui travaille pour vous, pas l’inverse
          </h2>
        </div>
        <p className="max-w-[40ch] text-[0.95rem] leading-relaxed text-muted md:text-right">
          Trois principes tiennent tout l’édifice : capter le flux entrant,
          le convertir sans friction, et ne jamais s’interrompre. Vous ne
          gérez que les rendez-vous qui en sortent.
        </p>
      </div>

      <div className="mt-10 border-t border-line" />

      <div className="mt-12 grid gap-10 sm:gap-8 md:grid-cols-3 md:gap-10">
        {PILLARS.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            variants={riseIn}
            initial="hidden"
            whileInView="visible"
            viewport={IN_VIEW}
            transition={{ delay: index * 0.08 }}
          >
            <span className="grid size-11 place-items-center rounded-[10px] border border-line bg-panel text-forest">
              <pillar.Icon className="size-[21px]" />
            </span>
            <h3 className="mt-5 font-display text-[1.12rem] font-semibold tracking-[-0.01em] text-ink">
              {pillar.title}
            </h3>
            <p className="mt-2.5 max-w-[36ch] text-[0.93rem] leading-relaxed text-muted">
              {pillar.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
