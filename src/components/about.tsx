"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FOUNDERS, type BioSegment } from "@/lib/content";
import { IN_VIEW, riseIn } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Badge } from "./ui";

/**
 * Mise en scène éditoriale : quatre blocs de tailles et de hauteurs
 * différentes plutôt que quatre cartes identiques.
 *
 * En desktop les quatre fondateurs tiennent sur une seule ligne (trois
 * colonnes chacun sur la grille de douze). Les marges hautes font
 * l'escalier d'un bloc à l'autre : c'est ce décalage vertical, et non
 * un changement de rangée, qui évite la grille régulière.
 *
 * Les portraits restent bornés en largeur (`media`) plutôt que laissés
 * à la largeur de leur colonne : c'est le texte qui porte la section,
 * pas la photo.
 */
const STAGING = [
  {
    wrapper: "lg:col-span-3",
    media: "aspect-[4/5] max-w-[236px]",
    name: "text-[1.45rem]",
  },
  {
    wrapper: "lg:col-span-3 lg:mt-12",
    media: "aspect-square max-w-[206px]",
    name: "text-[1.25rem]",
  },
  {
    wrapper: "lg:col-span-3 lg:mt-4",
    media: "aspect-[3/4] max-w-[222px]",
    name: "text-[1.35rem]",
  },
  {
    wrapper: "lg:col-span-3 lg:mt-16",
    media: "aspect-[4/5] max-w-[198px]",
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
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={`Portrait de ${founder.name}`}
                    fill
                    className="object-cover"
                    sizes="236px"
                  />
                ) : (
                  /* PLACEHOLDER — emplacement photo, prêt à recevoir /public */
                  <span
                    aria-hidden="true"
                    className="grid size-full place-items-center font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold text-line"
                  >
                    {founder.name.charAt(0)}
                  </span>
                )}
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
