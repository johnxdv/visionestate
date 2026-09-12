import type { CSSProperties } from "react";
import { ENGINE_FACTORS } from "@/lib/content";

/**
 * Une bande. Le rail porte deux copies de la liste : la copie est
 * `aria-hidden`, la boucle est donc muette pour les lecteurs d'écran
 * comme elle est invisible à l'œil.
 */
function Band({
  items,
  direction,
  duration,
}: {
  items: readonly string[];
  direction: "left" | "right";
  duration: string;
}) {
  const chips = items.map((label, index) => (
    <span
      key={`${label}-${index}`}
      className="whitespace-nowrap rounded-pill border border-line/60 bg-panel px-4 py-2 text-[0.8rem] leading-none text-muted"
    >
      {label}
    </span>
  ));

  return (
    <div className="marquee">
      <div
        className="marquee-track"
        data-direction={direction}
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {chips}
      </div>
      <div
        aria-hidden="true"
        className="marquee-track"
        data-direction={direction}
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {chips}
      </div>
    </div>
  );
}

/**
 * Tout ce que le moteur croise, en deux bandes de sens opposés.
 * Registre volontairement sobre : l'effet vient du nombre de facteurs
 * qui passent, pas de la mise en forme.
 */
export function FactorsMarquee() {
  return (
    <section
      aria-label="Facteurs pris en compte par le moteur d’estimation"
      className="pt-20 sm:pt-28"
    >
      <div className="flex flex-col gap-2.5">
        <Band items={ENGINE_FACTORS[0]} direction="right" duration="78s" />
        <Band items={ENGINE_FACTORS[1]} direction="left" duration="92s" />
      </div>
    </section>
  );
}
