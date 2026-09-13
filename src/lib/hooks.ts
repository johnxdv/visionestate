"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * matchMedia réactif et sûr côté serveur : le snapshot serveur vaut
 * toujours `false` (approche mobile-first), la valeur réelle est adoptée
 * à l'hydratation.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Vrai à partir du breakpoint `lg`. En dessous — mobile et tablette
 * en portrait — les sections pilotées au scroll basculent sur leur
 * variante sobre.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * Préférence « moins d'animations », sûre à l'hydratation.
 *
 * `useReducedMotion()` de Framer Motion lit matchMedia dès le premier
 * rendu client : le HTML serveur et le premier rendu client divergent
 * alors, et React n'applique pas le correctif sur les attributs de
 * style — un mot laissé à `opacity: 0.1` le reste. Le snapshot serveur
 * de `useSyncExternalStore` vaut `false`, la vraie valeur est adoptée
 * juste après l'hydratation.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Verrou d'armement des animations CSS : renvoie `false` tant que
 * `requested` est faux ou que le document ne peint pas de frame, puis
 * `true` définitivement.
 *
 * Une animation CSS avance sur la timeline du document, et cette
 * timeline ne tourne que lorsque le document est effectivement rendu.
 * Une animation créée alors qu'il ne l'est pas voit bien son
 * `startTime` se résoudre, mais son `currentTime` reste bloqué à 0 :
 * elle est « running », épinglée sur sa première keyframe, et le retour
 * sur la page ne la débloque pas. Si cette keyframe est l'état
 * invisible, l'élément ne réapparaît jamais.
 *
 * Le cas se produit sans manipulation particulière : page ouverte dans
 * un onglet d'arrière-plan, restaurée dans un onglet masqué, ou fenêtre
 * passée au second plan pendant le chargement — il suffit que
 * l'armement tombe dans cette fenêtre.
 *
 * Le signal retenu est `requestAnimationFrame` plutôt que
 * `visibilityState` : un rappel de frame *prouve* que le document peint
 * et que sa timeline avance, là où `visibilityState` n'en est qu'un
 * indice — il vaut « hidden » dans certains contextes embarqués qui
 * peignent malgré tout, et le verrou n'y serait jamais levé. Un onglet
 * d'arrière-plan, lui, ne peint pas : le rappel y reste en attente
 * jusqu'au retour, exactement le comportement voulu.
 */
export function useRenderGate(requested: boolean): boolean {
  // Verrou monotone : une fois armé, il le reste. Sans lui, le geste se
  // rejouerait à chaque retour sur la page.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (armed || !requested) return;

    const frame = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(frame);
  }, [armed, requested]);

  return armed;
}

/**
 * Section actuellement traversée par la bande médiane du viewport.
 * `ids` doit être une référence stable (constante de module).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // On retient la première section dans l'ordre du document, pas
        // dans l'ordre d'arrivée des entrées.
        const first = ids.find((id) => visible.has(id));
        setActive(first ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/**
 * Compteur animé de 0 vers `target`, démarré par `active`.
 * Renvoie la valeur finale immédiatement si l'utilisateur a demandé
 * moins d'animations.
 */
export function useCountUp(target: number, active: boolean, duration = 1500): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || prefersReducedMotion) return;

    let frame = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      startedAt ??= now;
      const progress = Math.min((now - startedAt) / duration, 1);
      // easeOutExpo : démarrage franc, arrivée posée
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, prefersReducedMotion]);

  // Mouvement réduit : la valeur finale est dérivée au rendu, sans état.
  if (prefersReducedMotion) return active ? target : 0;

  return value;
}
