"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FOUNDERS, type BioSegment } from "@/lib/content";
import { IN_VIEW, riseIn } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Badge } from "./ui";

/**
 * Mise en scène éditoriale : trois blocs de tailles et de hauteurs
 * différentes plutôt que trois cartes identiques.
 *
 * La composition tient sur une seule ligne de la grille de douze
 * colonnes, mais sans pas régulier : les largeurs de colonnes ne sont
 * pas égales, une colonne d'air est laissée avant le dernier bloc, et
 * les marges hautes font l'escalier. C'est ce décalage qui évite la
 * rangée de vignettes alignées.
 *
 * Les portraits restent bornés en largeur (`media`) plutôt que laissés
 * à la largeur de leur colonne : c'est le texte qui porte la section,
 * pas la photo.
 */
const STAGING = [
  {
    wrapper: "lg:col-span-4 lg:col-start-1",
    media: "aspect-[4/5] max-w-[252px]",
    name: "text-[1.45rem]",
  },
  {
    wrapper: "lg:col-span-4 lg:col-start-5 lg:mt-16",
    media: "aspect-square max-w-[224px]",
    name: "text-[1.3rem]",
  },
  {
    wrapper: "lg:col-span-3 lg:col-start-10 lg:mt-6",
    media: "aspect-[3/4] max-w-[212px]",
    name: "text-[1.2rem]",
  },
];

/** Segment de biographie : lien externe quand `href` est présent. */
function Bio({ segments }: { segments: readonly BioSegment[] }) {
  return (
    <p className="mt-3 max-w-[34ch] text-[0.92rem] leading-relaxed text-muted">
      {segments.map((segment, index) => (
        <span key={index}>
          {segment.br ? <br /> : null}
          {segment.href ? (
            <a
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-brass/50 underline-offset-[3px] transition-colors hover:text-brass hover:decoration-brass"
            >
              {segment.text}
            </a>
          ) : (
            segment.text
          )}
        </span>
      ))}
    </p>
  );
}

export function About() {
  return (
    <section id="a-propos" className="shell scroll-mt-28 py-24 sm:py-32">
      <div className="max-w-[62ch]">
        <Badge>À propos</Badge>
        <h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">
          Les fondateurs
        </h2>
        <p className="mt-5 text-pretty text-[1.02rem] leading-relaxed text-muted">
          Vision Estate est né d’un constat simple : les agences immobilières
          ont besoin de se différencier pour pouvoir progresser.
        </p>
      </div>

      <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:items-start">
        {FOUNDERS.map((founder, index) => {
          const staging = STAGING[index] ?? STAGING[0];

          return (
            <motion.article
              key={founder.name}
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
                <Image
                  src={founder.photo}
                  alt={`Portrait de ${founder.name}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 252px, (min-width: 640px) 45vw, 90vw"
                />
              </div>

              <h3
                className={cn(
                  "mt-5 font-display font-extrabold tracking-[-0.025em] text-ink",
                  staging.name,
                )}
              >
                {founder.name}
              </h3>
              <p className="mt-1 text-[0.82rem] text-brass">{founder.role}</p>
              <Bio segments={founder.bio} />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
