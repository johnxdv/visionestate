"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const PHRASE =
  "Le système d’acquisition immobilier le plus évolué du marché français";

const WORDS = PHRASE.split(" ");

function Word({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) {
  // Chaque mot occupe une tranche de la progression, avec recouvrement :
  // la phrase se remplit en vague plutôt que mot par mot sec.
  const start = (index / WORDS.length) * 0.82;
  const opacity = useTransform(progress, [start, start + 0.2], [0.1, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}

export function RevealPhrase() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  return (
    <section
      ref={ref}
      className="shell flex min-h-[70vh] items-center py-24 sm:min-h-[85vh] sm:py-32"
    >
      {/* Flux de texte normal (et non flex + gap) : les espaces entre
          les mots sont de vrais espaces — la phrase se copie et se lit
          correctement à la synthèse vocale. */}
      <p className="mx-auto max-w-[19ch] text-center font-display text-[clamp(2rem,5.4vw,3.9rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
        {WORDS.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            {prefersReducedMotion ? (
              <span className="inline-block">{word}</span>
            ) : (
              <Word word={word} index={index} progress={scrollYProgress} />
            )}{" "}
          </Fragment>
        ))}
      </p>
    </section>
  );
}
