import Link from "next/link";
import { LEGAL_LINKS, SITE } from "@/lib/content";
import { Logo } from "./ui";
import { FooterWordmark } from "./footer-wordmark";

export function Footer() {
  return (
    /* `relative` + fond opaque : la nappe de blobs est une couche fixe
       en `-z-10`, qui passe donc au-dessus du fond de la page. Le pied
       de page pose son propre fond par-dessus — la section se détache
       nettement du reste, sans beige qui déborde dessous. */
    <footer className="relative border-t border-line bg-page">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo imgClassName="h-[44px] w-auto" />

        <nav aria-label="Liens de pied de page">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem] text-muted">
            <li>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="transition-colors hover:text-ink"
              >
                {SITE.contactEmail}
              </a>
            </li>
            {/* Les pages légales viennent de la liste : un lien de plus
                se publie en ajoutant une entrée, sans toucher ici. */}
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="text-muted/70">
              © {new Date().getFullYear()} {SITE.name}
            </li>
          </ul>
        </nav>
      </div>

      {/* Signature de bas de page — voir footer-wordmark.tsx. */}
      <FooterWordmark />
    </footer>
  );
}
