"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE, IN_VIEW, riseIn } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Badge } from "./ui";
import { IconCheck, IconPin, IconSearch, IconSparkle } from "./icons";

/* ------------------------------------------------------------------ *
 * Carte A — l'estimateur, joué comme une vraie interaction.
 * ------------------------------------------------------------------ */
type Stage = "idle" | "loading" | "done";

function EstimatorCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [timedStage, setTimedStage] = useState<Stage>("idle");

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    const toLoading = window.setTimeout(() => setTimedStage("loading"), 520);
    const toDone = window.setTimeout(() => setTimedStage("done"), 1580);

    return () => {
      window.clearTimeout(toLoading);
      window.clearTimeout(toDone);
    };
  }, [isInView, prefersReducedMotion]);

  // Mouvement réduit : on affiche directement le résultat, sans mise en scène.
  const stage: Stage = prefersReducedMotion && isInView ? "done" : timedStage;

  return (
    <div
      ref={ref}
      className="flex h-full flex-col rounded-card border border-line bg-page p-5 sm:p-6"
    >
      <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.015em] text-ink">
        Estimation en 2 clics
      </h3>
      <p className="mt-2 max-w-[46ch] text-[0.92rem] leading-relaxed text-muted">
        Le prospect saisit son adresse. Le moteur croise plus de 40 données et
        rend une fourchette défendable avant qu’il ait le temps d’aller voir
        ailleurs.
      </p>

      <div className="mt-6 rounded-card border border-line bg-panel/50 p-4">
        {/* Champ d'adresse */}
        <div className="flex items-center gap-2 rounded-pill border border-line bg-page px-3.5 py-2.5">
          <IconPin className="size-4 shrink-0 text-muted" />
          <span className="min-w-0 flex-1 truncate text-[0.85rem] text-ink">
            12 rue Bugeaud, 69006 Lyon
          </span>
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest text-page">
            <IconSearch className="size-[15px]" />
          </span>
        </div>

        {/* Analyse en cours */}
        <div className="mt-3 min-h-[1.25rem]">
          <AnimatePresence mode="wait">
            {stage === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <span className="h-[3px] w-24 overflow-hidden rounded-pill bg-line">
                  <motion.span
                    className="block h-full w-1/3 rounded-pill bg-forest/60"
                    animate={{ x: ["-110%", "240%"] }}
                    transition={{ repeat: Infinity, duration: 1.05, ease: "linear" }}
                  />
                </span>
                <span className="text-[0.74rem] text-muted">
                  Analyse de 40+ données…
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Résultat */}
        <AnimatePresence>
          {stage === "done" && (
            <motion.div
              key="result"
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 10, height: 0 }
              }
              animate={{ opacity: 1, y: 0, height: "auto" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="rounded-card border border-line bg-page p-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-[0.72rem] text-muted">
                      Valeur estimée
                    </div>
                    <div className="tnum mt-1 font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                      418 500 €
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-forest/10 px-2.5 py-1 text-[0.7rem] font-medium text-forest">
                    <IconSparkle className="size-3" />
                    Confiance élevée
                  </span>
                </div>
                <div className="tnum mt-3 border-t border-line pt-3 text-[0.75rem] text-muted">
                  Fourchette 401 000 – 436 000 € · 3 pièces, 68 m²
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Carte B — les leads qui arrivent déjà qualifiés.
 * ------------------------------------------------------------------ */
const LEADS = [
  {
    name: "Claire M.",
    detail: "3 pièces · Lyon 6e",
    status: "Nouveau",
    tone: "bg-brass/12 text-brass",
  },
  {
    name: "Thomas B.",
    detail: "Maison · Écully",
    status: "RDV programmé",
    tone: "bg-forest/10 text-forest",
  },
  {
    name: "Sofia R.",
    detail: "T2 · Villeurbanne",
    status: "À relancer",
    tone: "bg-panel text-muted",
  },
];

function LeadsCard() {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-page p-5 sm:p-6">
      <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.015em] text-ink">
        Vos leads, triés automatiquement
      </h3>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
        Chaque estimation arrive qualifiée et rangée. Vous ouvrez la liste, vous
        appelez.
      </p>

      {/* Le stagger est porté par la liste : les trois lignes se
          révèlent ensemble quand la carte entre, pas une par une au fil
          du scroll. */}
      <motion.ul
        className="mt-6 flex flex-col gap-2"
        initial="hidden"
        whileInView="visible"
        viewport={IN_VIEW}
        variants={{ visible: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } } }}
      >
        {LEADS.map((lead) => (
          <motion.li
            key={lead.name}
            variants={riseIn}
            className="flex items-center justify-between gap-3 rounded-card border border-line bg-panel/45 px-4 py-3"
          >
            <span className="min-w-0">
              <span className="block truncate text-[0.9rem] font-medium text-ink">
                {lead.name}
              </span>
              <span className="mt-0.5 block truncate text-[0.75rem] text-muted">
                {lead.detail}
              </span>
            </span>
            <span
              className={cn(
                "shrink-0 rounded-pill px-2.5 py-1 text-[0.7rem] font-medium",
                lead.tone,
              )}
            >
              {lead.status}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      <p className="mt-5 flex items-center gap-2 pt-2 text-[0.78rem] text-muted lg:mt-auto">
        <IconCheck className="size-3.5 shrink-0 text-forest" />
        Statuts mis à jour sans intervention de votre part.
      </p>
    </div>
  );
}

export function InAction() {
  return (
    <section id="en-action" className="shell scroll-mt-28 py-24 sm:py-32">
      <div className="mx-auto max-w-[52ch] text-center">
        <Badge>En action</Badge>
        <h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          Ce que vos prospects voient
        </h2>
        <p className="mt-4 text-pretty text-[0.98rem] leading-relaxed text-muted">
          L’estimateur que vos prospects remplissent, et ce qui atterrit de
          votre côté une minute plus tard.
        </p>
      </div>

      <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <EstimatorCard />
        </div>
        <div className="lg:col-span-5">
          <LeadsCard />
        </div>
      </div>
    </section>
  );
}
