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
 * Les fondateurs. `bio` est découpé en segments plutôt qu'en une
 * chaîne : les sociétés citées sont des liens, et un texte brut ne
 * peut pas les porter. Un segment sans `href` est du texte simple.
 * `photo` : chemin sous /public une fois les visuels fournis.
 * -------------------------------------------------------------- */
export type BioSegment = {
  text: string;
  /** Présent : le segment est un lien externe. */
  href?: string;
  /** Le segment ouvre une nouvelle ligne dans la bio. */
  br?: boolean;
};

export type Founder = {
  name: string;
  role: string;
  bio: readonly BioSegment[];
  photo?: string;
};

export const FOUNDERS: Founder[] = [
  {
    name: "Benjamin Mossé",
    role: "Fondateur",
    bio: [
      { text: "Fondateur de " },
      { text: "red9.fr", href: "https://red9.fr" },
      { text: "exhaustpro.fr", href: "https://exhaustpro.fr", br: true },
      { text: "Co-fondateur de ", br: true },
      { text: "carvi.fr", href: "https://carvi.fr" },
      { text: "Associé aux comptes de ", br: true },
      { text: "tmh-corporation.com", href: "https://tmh-corporation.com" },
    ],
  },
  {
    name: "Armen Isajanyan",
    role: "Fondateur",
    bio: [
      { text: "Fondateur de " },
      { text: "maileed.com", href: "https://maileed.com" },
      { text: "." },
    ],
  },
  {
    name: "Victor Nizet",
    role: "Consultant",
    bio: [
      { text: "Fondateur de " },
      { text: "carvi.fr", href: "https://carvi.fr" },
      { text: "." },
    ],
  },
  {
    name: "Lucas Bella",
    role: "Consultant",
    bio: [
      { text: "Directeur d’agence de " },
      { text: "immo-via.com", href: "https://immo-via.com" },
    ],
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
