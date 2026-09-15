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

/* -------------------------------------------------------------- *
 * Pages légales. Le pied de page parcourt cette liste : ajouter une
 * entrée suffit à publier le lien, l'ordre du tableau est celui de
 * l'affichage. (Les CGU viendront s'ajouter ici.)
 * -------------------------------------------------------------- */
export const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Confidentialité" },
] as const;

/* -------------------------------------------------------------- *
 * Identité de l'éditeur — reprise telle quelle par les deux pages
 * légales. Une seule source : un numéro qui change ne se corrige
 * qu'à un endroit.
 * -------------------------------------------------------------- */
export const LEGAL_ENTITY = {
  name: "MARM Group",
  status: "Entrepreneur individuel",
  siret: "940 437 817 00015",
  siren: "940 437 817",
  vat: "FR78940437817",
  address: "43 chemin de la Justice, 92290 Châtenay-Malabry, France",
  publisher: "MARM Group",
} as const;

/** Identifiants observés pour l'état actif de la nav (ordre du document). */
export const NAV_SECTION_IDS = NAV_LINKS.map((l) => l.id);

/* -------------------------------------------------------------- *
 * Les fondateurs. `bio` est découpé en segments plutôt qu'en une
 * chaîne : les sociétés citées sont des liens, et un texte brut ne
 * peut pas les porter. Un segment sans `href` est du texte simple.
 * `photo` : chemin du portrait sous /public.
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
  photo: string;
};

export const FOUNDERS: Founder[] = [
  {
    name: "Benjamin Mossé",
    role: "Fondateur",
    photo: "/founders/benjamin.jpg",
    bio: [
      { text: "Fondateur du média " },
      { text: "red9.fr", href: "https://red9.fr" },
      { text: " et de la marque " },
      { text: "exhaustpro.fr", href: "https://exhaustpro.fr" },
      { text: "Co-fondateur de ", br: true },
      { text: "carvi.fr", href: "https://carvi.fr" },
      { text: "Associé aux comptes de ", br: true },
      { text: "tmh-corporation.com", href: "https://tmh-corporation.com" },
    ],
  },
  {
    name: "Armen Isajanyan",
    role: "Fondateur",
    photo: "/founders/armen.jpg",
    bio: [
      { text: "Fondateur de " },
      { text: "maileed.com", href: "https://maileed.com" },
      { text: "." },
    ],
  },
  {
    name: "Victor Nizet",
    role: "Consultant",
    photo: "/founders/victor.jpg",
    bio: [
      { text: "Fondateur de " },
      { text: "carvi.fr", href: "https://carvi.fr" },
      { text: "." },
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
