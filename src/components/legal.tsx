import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Mise en page des pages légales — du texte, rien d'autre.
 *
 * Ces pages sont fonctionnelles : pas d'animation, pas de décor. Le
 * seul travail est la lecture — une mesure courte, une hiérarchie
 * lisible, la typo du site. Les composants ci-dessous tiennent cette
 * cohérence sans que chaque page ait à répéter ses classes.
 * ------------------------------------------------------------------ */

/** Titre de page et, le cas échéant, sa date de mise à jour. */
export function LegalHeader({
  title,
  updatedAt,
}: {
  title: string;
  updatedAt?: string;
}) {
  return (
    <header className="border-b border-line pb-8">
      <h1 className="text-balance font-display text-[clamp(2rem,4.4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">
        {title}
      </h1>
      {updatedAt ? (
        <p className="mt-4 text-[0.9rem] text-muted">
          Dernière mise à jour : {updatedAt}
        </p>
      ) : null}
    </header>
  );
}

/** Une section : son titre, puis son contenu. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-10">
      <h2 className="font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-[0.98rem] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

/**
 * Bloc d'identité — une information par ligne. Les coordonnées se
 * lisent en colonne, pas en paragraphe : un SIRET noyé dans une phrase
 * est illisible.
 */
export function LegalLines({ lines }: { lines: readonly ReactNode[] }) {
  return (
    <p className="flex flex-col gap-1">
      {lines.map((line, index) => (
        <span key={index}>{line}</span>
      ))}
    </p>
  );
}

/** Lien externe — même traitement que dans les bios de l'accueil. */
export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : null)}
      className="text-ink underline decoration-brass/50 underline-offset-[3px] transition-colors hover:text-brass hover:decoration-brass"
    >
      {children}
    </a>
  );
}
