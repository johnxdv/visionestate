/* ------------------------------------------------------------------ *
 * Contenu éditable — Vision Estate
 * Tout ce qui est susceptible de changer sans toucher au design.
 * ------------------------------------------------------------------ */

export const SITE = {
  name: "Vision Estate",
  contactEmail: "contact@visionestate.fr",
  /**
   * Nom d'agence affiché dans le dashboard de démonstration.
   * Fictif — la mention sous le dashboard le précise explicitement.
   */
  demoAgency: "Agence Bellevue",
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
  { id: "en-action", label: "En action" },
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
 * Sources de données du moteur d'estimation.
 * La crédibilité vient de la méthode, pas d'un chiffre de clients.
 * -------------------------------------------------------------- */
export const DATA_SOURCES = [
  { name: "DVF", detail: "Demandes de valeurs foncières" },
  { name: "data.gouv.fr", detail: "Plateforme ouverte des données publiques" },
  { name: "BD TOPO®", detail: "IGN — description du territoire" },
  { name: "BAN", detail: "Base Adresse Nationale" },
] as const;
