"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

/**
 * Calendrier Cal.com en embed inline.
 *
 * Le snippet officiel de Cal est une balise <script> : telle quelle,
 * elle ne peut pas aller dans du JSX. On en reproduit ici les quatre
 * appels, dans le même ordre, via `getCalApi` — qui se charge
 * d'injecter `embed.js` une seule fois et de résoudre dès que l'API
 * est prête.
 *
 * `forwardQueryParams` se pose sur le `Cal` global et non sur
 * l'espace de noms : c'est là que l'embed va le lire.
 */
const NAMESPACE = "rendez-vous-decouverte";
const CAL_LINK = "vision-estate/rendez-vous-decouverte";
const ORIGIN = "https://app.cal.com";
const CONTAINER_ID = "my-cal-inline-rendez-vous-decouverte";

export function CalEmbed() {
  // React monte deux fois en développement (StrictMode) : sans ce
  // garde-fou, l'embed serait initialisé deux fois. Ce drapeau est le
  // seul verrou — pas de `cancelled` posé au démontage, qui annulerait
  // justement la passe qui a franchi le garde-fou.
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });

      cal("init", NAMESPACE, { origin: ORIGIN });

      window.Cal.config = window.Cal.config ?? {};
      window.Cal.config.forwardQueryParams = true;

      cal("inline", {
        elementOrSelector: `#${CONTAINER_ID}`,
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
        calLink: CAL_LINK,
      });

      // Les détails de l'événement (durée, format, « sans engagement »)
      // sont déjà portés par la carte de gauche : les répéter dans le
      // calendrier ferait doublon.
      //
      // `theme: "light"` est imposé : par défaut Cal suit le
      // `prefers-color-scheme` du visiteur et affiche un calendrier noir
      // au milieu d'une carte beige. Le site n'a pas de mode sombre.
      cal("ui", {
        hideEventTypeDetails: true,
        layout: "month_view",
        theme: "light",
      });
    })();
  }, []);

  return (
    <div
      id={CONTAINER_ID}
      // `min-h` plutôt que `h-full` : le `height:100%` du snippet
      // officiel s'effondre sans parent de hauteur fixe. La carte
      // s'étire si le calendrier demande plus de place, et aucun
      // `overflow` n'est posé — pas de second ascenseur imbriqué.
      //
      // Le plancher est plus bas sur mobile : Cal y rend un calendrier
      // compact qu'il centre verticalement, et 650px laisseraient un
      // large vide entre le titre de la carte et la grille.
      className="mt-5 min-h-[420px] w-full sm:min-h-[650px]"
    />
  );
}
