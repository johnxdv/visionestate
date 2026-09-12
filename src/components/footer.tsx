import { SITE } from "@/lib/content";
import { Logo } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo />

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
            <li>
              <a href="/mentions-legales" className="transition-colors hover:text-ink">
                Mentions légales
              </a>
            </li>
            <li className="text-muted/70">
              © {new Date().getFullYear()} {SITE.name}
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
