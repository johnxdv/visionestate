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
 */
const STAGING = [
  {
    wrapper: "lg:col-span-5 lg:col-start-1",
    media: "aspect-[4/5]",
    name: "text-[clamp(1.5rem,2.5vw,2.05rem)]",
  },
  {
    wrapper: "lg:col-span-4 lg:col-start-8 lg:mt-24",
    media: "aspect-square",
    name: "text-[1.35rem]",
  },
  {
    wrapper: "lg:col-span-4 lg:col-start-3 lg:-mt-10",
    media: "aspect-[3/4]",
    name: "text-[1.55rem]",
  },
];

export function About() {
  return (
    <section id="a-propos" className="shell scroll-mt-28 py-24 sm:py-32">
      <div className="max-w-[62ch]">
        <Badge>À propos</Badge>
        <h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          Trois associés, un seul système
        </h2>
        {/* PLACEHOLDER — remplacer par le texte d'histoire définitif. */}
        <p className="mt-5 text-pretty text-[1.02rem] leading-relaxed text-muted">
          Vision Estate est né d’un constat simple : les bonnes agences ne
          perdent pas leurs mandats sur le terrain, elles les perdent en ligne —
          faute d’être trouvées, puis faute d’un parcours qui transforme.
        </p>
      </div>

      <div className="mt-16 grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:items-start">
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
                  "relative overflow-hidden rounded-card border border-line bg-panel",
                  staging.media,
                )}
              >
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={`Portrait de ${founder.firstName}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                ) : (
                  /* PLACEHOLDER — emplacement photo, prêt à recevoir /public */
                  <span
                    aria-hidden="true"
                    className="grid size-full place-items-center font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold text-line"
                  >
                    {founder.firstName.charAt(0)}
                  </span>
                )}
              </div>

              <h3
                className={cn(
                  "mt-5 font-display font-semibold tracking-[-0.02em] text-ink",
                  staging.name,
                )}
              >
                {founder.firstName}
              </h3>
              <p className="mt-1 text-[0.82rem] text-brass">{founder.role}</p>
              <p className="mt-3 max-w-[38ch] text-[0.92rem] leading-relaxed text-muted">
                {founder.bio}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
