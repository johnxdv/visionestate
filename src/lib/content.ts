/* ------------------------------------------------------------------ *
 * Contenu éditable — Vision Estate
 * Tout ce qui est susceptible de changer sans toucher au design.
 * ------------------------------------------------------------------ */

export const SITE = {
  name: "Vision Estate",
  contactEmail: "contact@visionestate.fr",
  /** Prénom affiché dans l'accueil du dashboard de démonstration. */
  demoFirstName: "Thomas",
  /** Date affichée dans la pill du dashboard. */
  demoDate: "12 sept. 2026",
  /**
   * Renseigner l'URL Calendly pour remplacer le placeholder de la
   * section « Réserver » par le vrai calendrier embarqué.
   * ex. "https://calendly.com/visionestate/demo"
   */
  calendlyUrl: "" as string,
} as const;

export const NAV_LINKS = [
  { id: "pourquoi", label: "Pourquoi" },
  { id: "systeme", label: "Le système" },
  { id: "a-propos", label: "À propos" },
] as const;

/** Identifiants observés pour l'état actif de la nav (ordre du document). */
export const NAV_SECTION_IDS = NAV_LINKS.map((l) => l.id);

/* -------------------------------------------------------------- *
 * Fondateurs — placeholders. Remplacer bio / rôle / photo.
 * `photo` : chemin sous /public une fois les visuels fournis.
 * -------------------------------------------------------------- */
export type Founder = {
  firstName: string;
  role: string;
  bio: string;
  photo?: string;
};

export const FOUNDERS: Founder[] = [
  {
    firstName: "Benjamin",
    role: "Acquisition & SEO",
    bio: "Pilote le volet référencement : la position que prennent nos clients sur les recherches qui déclenchent un mandat.",
  },
  {
    firstName: "Armen",
    role: "Produit & estimation",
    bio: "Construit le moteur d’estimation et le croisement des 40+ données qui le rendent précis en deux clics.",
  },
  {
    firstName: "Victor",
    role: "Conversion & funnel",
    bio: "Dessine le tunnel : chaque écran est pensé pour transformer un visiteur en rendez-vous signé.",
  },
];

/* -------------------------------------------------------------- *
 * Facteurs pris en compte par le moteur d'estimation.
 * La crédibilité vient de l'étendue de la méthode, pas d'un chiffre
 * de clients. Répartis en deux bandes défilantes de sens opposés.
 * -------------------------------------------------------------- */
export const ENGINE_FACTORS: readonly [readonly string[], readonly string[]] = [
  [
    "DVF",
    "BDNB (base nationale des bâtiments)",
    "IGN (carte officielle Géoportail)",
    "Qualité de l’air",
    "Pollution sonore",
    "Risque sismique",
    "Risque d’inondation",
    "Risque incendie",
    "Risque de mouvement de terrain",
    "Qualité du sol",
    "Proximité commerces / écoles / transports",
  ],
  [
    "Proximité mer / espaces verts",
    "Attractivité du quartier",
    "Sécurité du quartier",
    "Évolution démographique",
    "Offre et demande immobilière",
    "Historique des prix",
    "Projets urbains à venir",
    "Potentiel de construction / extension",
    "Fiscalité locale",
    "Nuisances (route, train, aéroport, industrie)",
    "Potentiel de plus-value à moyen/long terme",
  ],
];
