import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

/**
 * Police d'affichage — grotesque géométrique très grasse, terminaisons
 * arrondies, point du « i » circulaire. L'italique est chargée car le
 * système typographique isole un mot du titre en gras italique.
 *
 * General Sans / Switzer (Pangram Pangram) donnent le même registre mais
 * demandent une licence commerciale ; Sora — l'autre option libre — n'a
 * pas d'italique sur Google Fonts.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const TITLE =
  "Vision Estate — Le système d’acquisition des agences immobilières";

const SHARE_DESCRIPTION =
  "SEO en première position et tunnel de conversion optimisé. Livré en 72h, sur-mesure par agence.";

/**
 * L'image d'aperçu est déclarée explicitement. Sans elle, les
 * agrégateurs de lien (iMessage, WhatsApp, Facebook) devinent une
 * image dans la page — et tombaient sur le premier portrait de la
 * section « fondateurs ».
 *
 * `metadataBase` est indispensable : il préfixe `ogImage` pour en
 * faire une URL absolue, seule forme acceptée par ces agrégateurs.
 */
const OG_IMAGE = {
  url: SITE.ogImage,
  width: 1200,
  height: 630,
  alt: "Logo Vision Estate",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description:
    "Un système d’acquisition complet pour votre agence, livré en 72 heures.",
  openGraph: {
    title: TITLE,
    description: SHARE_DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: "fr_FR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHARE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
