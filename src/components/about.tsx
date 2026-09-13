"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FOUNDERS } from "@/lib/content";
import { IN_VIEW, riseIn } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Badge } from "./ui";

/**
 * Mise en scène éditoriale : trois blocs de tailles et de hauteurs
 * différentes plutôt que trois cartes identiques.
 *
 * Les portraits sont bornés en largeur (`media`) plutôt que laissés à
 * la largeur de leur colonne : c'est le texte qui porte la section, pas
 * la photo. Les trois blocs tiennent sur une seule rangée, décalés
 * verticalement en escalier — c'est la marge haute qui fait le zigzag,
 * pas un chevauchement de colonnes qui creuserait un vide.
 */
const STAGING = [
  {
    wrapper: "lg:col-span-4 lg:col-start-1",
    media: "aspect-[4/5] max-w-[232px]",
    name: "text-[1.5rem]",
  },
  {
    wrapper: "lg:col-span-4 lg:col-start-5 lg:mt-16",
    media: "aspect-square max-w-[208px]",
    name: "text-[1.3rem]",
  },
  {
    wrapper: "lg:col-span-4 lg:col-start-9 lg:mt-32",
    media: "aspect-[3/4] max-w-[220px]",
    name: "text-[1.4rem]",
  },
];

export function About() {
  return (
    <section id="a-propos" className="shell scroll-mt-28 py-24 sm:py-32">
      <div className="max-w-[62ch]">
        <Badge>À propos</Badge>
        <h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">
          Trois associés, un seul système
        </h2>
        {/* PLACEHOLDER — remplacer par le texte d'histoire définitif. */}
        <p className="mt-5 text-pretty text-[1.02rem] leading-relaxed text-muted">
          Vision Estate est né d’un constat simple : les bonnes agences ne
          perdent pas leurs mandats sur le terrain, elles les perdent en ligne —
          faute d’être trouvées, puis faute d’un parcours qui transforme.
        </p>
      </div>

      <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:items-start">
        {FOUNDERS.map((founder, index) => {
          const staging = STAGING[index] ?? STAGING[0];

          return (
            <motion.article
              key={founder.firstName}
              variants={riseIn}
              initial="hidden"
              whileInView="visible"
              viewport={IN_VIEW}
              transition={{ delay: index * 0.07 }}
              className={staging.wrapper}
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-card border border-line bg-panel",
                  staging.media,
                )}
              >
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={`Portrait de ${founder.firstName}`}
                    fill
                    className="object-cover"
                    sizes="232px"
                  />
                ) : (
                  /* PLACEHOLDER — emplacement photo, prêt à recevoir /public */
                  <span
                    aria-hidden="true"
                    className="grid size-full place-items-center font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold text-line"
                  >
                    {founder.firstName.charAt(0)}
                  </span>
                )}
              </div>

              <h3
                className={cn(
                  "mt-5 font-display font-extrabold tracking-[-0.025em] text-ink",
                  staging.name,
                )}
              >
                {founder.firstName}
              </h3>
              <p className="mt-1 text-[0.82rem] text-brass">{founder.role}</p>
              <p className="mt-3 max-w-[34ch] text-[0.92rem] leading-relaxed text-muted">
                {founder.bio}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
