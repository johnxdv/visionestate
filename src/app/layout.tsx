import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vision Estate — Le système d’acquisition des agences immobilières",
  description:
    "Première position sur les recherches qui comptent, tunnel de conversion optimisé, estimateur en deux clics. Un système d’acquisition complet pour votre agence, livré en 72h.",
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
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
