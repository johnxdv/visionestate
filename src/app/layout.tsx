import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Vision Estate — Le système d’acquisition des agences immobilières",
  description:
    "Un système d’acquisition complet pour votre agence, livré en 72 heures.",
  openGraph: {
    title: "Vision Estate — Le système d’acquisition des agences immobilières",
    description:
      "SEO en première position et tunnel de conversion optimisé. Livré en 72h, sur-mesure par agence.",
    locale: "fr_FR",
    type: "website",
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
