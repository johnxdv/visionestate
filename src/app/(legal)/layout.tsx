import Link from "next/link";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/ui";

/**
 * Coquille des pages légales — volontairement nue.
 *
 * Pas de nappe de blobs, pas de nav collante ni d'ancres de section :
 * ces pages ne font pas partie du parcours de l'accueil, elles s'y
 * retournent. Il reste le logo, un retour explicite et le pied de page
 * du site, qui porte l'identité et les liens entre pages légales.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <header className="border-b border-line">
        <div className="shell flex h-[72px] items-center justify-between gap-4 lg:h-[80px]">
          <Logo imgClassName="h-[38px] w-auto sm:h-[42px]" />
          <Link
            href="/"
            className="text-[0.85rem] text-muted transition-colors hover:text-ink"
          >
            Retour à l’accueil
          </Link>
        </div>
      </header>

      <main className="shell w-full flex-1 py-16 sm:py-20">
        {/* Mesure courte : le texte de loi se lit en colonne étroite. */}
        <div className="max-w-[68ch]">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
