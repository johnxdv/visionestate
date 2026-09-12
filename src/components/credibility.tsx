import { DATA_SOURCES } from "@/lib/content";

/**
 * La crédibilité vient de la méthode et des sources, pas d'un chiffre
 * de notoriété. Registre volontairement sobre et muted.
 */
export function Credibility() {
  return (
    <section className="shell pt-20 sm:pt-28">
      <p className="text-center text-[0.9rem] text-muted">
        Construit sur les données notariales officielles
      </p>

      <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-7 rounded-card border border-line bg-panel/40 px-6 py-7 md:grid-cols-4">
        {DATA_SOURCES.map((source) => (
          <li key={source.name} className="text-center">
            <div className="font-display text-[1.02rem] font-medium tracking-tight text-muted">
              {source.name}
            </div>
            <div className="mt-1 text-[0.7rem] leading-snug text-muted/65">
              {source.detail}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
