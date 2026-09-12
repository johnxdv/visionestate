"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_LINKS, NAV_SECTION_IDS } from "@/lib/content";
import { useActiveSection } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { CtaPrimary, Logo } from "./ui";
import { IconClose, IconMenu } from "./icons";

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const activeId = useActiveSection(NAV_SECTION_IDS);

  useMotionValueEvent(scrollY, "change", (value) => {
    setIsScrolled(value > 24);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        isScrolled || isMenuOpen
          ? "border-line bg-[rgba(250,250,248,0.92)] backdrop-blur-[8px]"
          : "border-transparent bg-transparent",
      )}
    >
      <nav className="shell flex h-[72px] items-center justify-between gap-4">
        <Logo />

        {/* Liens d'ancre dans un conteneur pill discret */}
        <ul className="hidden items-center gap-1 rounded-pill border border-line/70 bg-page/40 p-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative inline-flex whitespace-nowrap rounded-pill px-3.5 py-1.5 text-sm transition-colors duration-200",
                    isActive ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-pill bg-panel"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* La bascule d'affichage est portée par le conteneur : sur le
              bouton, `hidden` entrerait en conflit avec son `inline-flex`. */}
          <div className="hidden sm:block">
            <CtaPrimary href="#reserver" className="whitespace-nowrap">
              Réserver une démo
            </CtaPrimary>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="grid size-10 place-items-center rounded-pill border border-line text-ink transition-colors hover:bg-panel/60 lg:hidden"
          >
            {isMenuOpen ? (
              <IconClose className="size-5" />
            ) : (
              <IconMenu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.div
            id="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            // Fond plein : au-dessus du hero, un panneau translucide laisserait
            // le titre transparaître derrière les liens.
            className="overflow-hidden border-t border-line bg-page lg:hidden"
          >
            <ul className="shell flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block rounded-card px-3 py-2.5 text-[0.95rem] transition-colors",
                      activeId === link.id
                        ? "bg-panel text-ink"
                        : "text-muted hover:bg-panel/60 hover:text-ink",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 sm:hidden">
                <CtaPrimary
                  href="#reserver"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Réserver une démo
                </CtaPrimary>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
