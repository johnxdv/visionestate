# Vision Estate — site one-page

Next.js (App Router) · Tailwind CSS v4 · Framer Motion. Déploiement visé : Vercel.

```bash
npm run dev     # développement, http://localhost:3000
npm run build   # build de production (page entièrement statique)
npm run lint
```

## Structure

| Fichier | Rôle |
|---|---|
| `src/app/globals.css` | Design tokens (`@theme`), styles de base, blobs, grille de points, bandes défilantes, surligneur du hero, `prefers-reduced-motion` |
| `src/app/layout.tsx` | Polices (Plus Jakarta Sans / Inter), métadonnées |
| `src/app/page.tsx` | Composition des sections, dans l'ordre du brief |
| `src/lib/content.ts` | **Contenu éditable** : nom d'agence de démo, URL Calendly, fondateurs, facteurs du moteur |
| `src/lib/chart.ts` | Données et géométrie du graphique du dashboard |
| `src/lib/hooks.ts` | `useMediaQuery`, `useActiveSection`, `useCountUp`, `usePrefersReducedMotion` |
| `src/lib/motion.ts` | Courbe d'attaque et variants partagés |
| `src/components/` | Une section par fichier |

## Ce qui reste à fournir

Tout est repéré par un commentaire `PLACEHOLDER` dans le code.

- **Calendly** — renseigner `SITE.calendlyUrl` dans `src/lib/content.ts` : l'iframe remplace
  automatiquement le panneau de créneaux de la section « Réserver ».
- **Fondateurs** — `FOUNDERS` dans `src/lib/content.ts` : rôles et bios sont des propositions,
  à valider. Pour les photos, déposer les fichiers dans `public/` et renseigner `photo`
  (ex. `"/benjamin.jpg"`) ; le bloc bascule seul de l'initiale vers `next/image`.
- **Histoire de Vision Estate** — paragraphe d'intro dans `src/components/about.tsx`.
- **Mentions légales** — le lien du footer pointe vers `/mentions-legales`, page à créer.
- **Nom d'agence du dashboard** — `SITE.demoAgency`. Fictif, couvert par la mention
  « Exemple illustratif » affichée sous le dashboard.

## Données du dashboard

Les chiffres sont illustratifs et centralisés dans `src/lib/chart.ts` et
`src/components/dashboard.tsx` (`STATS`, `TRAFFIC`). La mention obligatoire sous le
dashboard le précise explicitement — la retirer supposerait de brancher des données réelles.

## Animations

Toutes les animations respectent `prefers-reduced-motion` : CSS neutralisé dans
`globals.css`, `<MotionConfig reducedMotion="user">` pour Framer Motion, et les sections
pilotées au scroll rendent un état final statique.

Le bandeau scrollytelling a deux implémentations distinctes : version cinématique sticky
à partir de `lg` (1024 px), version empilée sobre en dessous et en mouvement réduit. Les
deux partagent le même fil conducteur dessiné au scroll — horizontal en sticky, vertical
en empilé — et les mêmes mises en scène par étape.

## Typographie

La police d'affichage est **Plus Jakarta Sans** (Google Fonts, self-hostée par
`next/font`), utilisée en ExtraBold (800) sur tous les titres. C'est la seule des deux
alternatives libres évoquées au brief à proposer une italique : Sora n'en a pas sur
Google Fonts, et le système typographique en a besoin — un mot isolé du titre passe en
gras italique via `<Em>` (`src/components/ui.tsx`), le reste restant en gras droit.

General Sans / Switzer (Pangram Pangram) donnent le même registre de plus près mais
exigent une licence commerciale : à basculer si elle est acquise, en changeant seulement
`--font-display` et le chargement dans `layout.tsx`.
