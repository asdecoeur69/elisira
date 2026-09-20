import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { LocalCartProvider } from "@/lib/cart/LocalCartProvider";
import { MotionProvider } from "@/providers/MotionProvider";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AgeGate } from "@/components/organisms/AgeGate";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { MAISON, SITE_LIVE, SITE_URL } from "@/lib/seo/site";
import { organisationJsonLd, siteJsonLd, serialiser } from "@/lib/seo/jsonld";
import "./globals.css";

/* Serif éditorial — fait écho à l'anglaise « Elisira » de l'étiquette */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Sans géométrique discrète — lisible, jamais tech */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  /* Base de toutes les URL relatives (canoniques, images de partage).
     Sans elle, Next les résout vers localhost et aucun partage social
     n'affiche d'aperçu. */
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Elisira — Liqueur de mandarines siciliennes | H&H Spirits",
    /* Chaque page donne son titre court ; la marque est ajoutée ici, une
       seule fois, pour ne pas la répéter dans chaque fichier. */
    template: `%s | ${MAISON}`,
  },
  description:
    "Recette de famille aux mandarines biologiques de Sicile, élaborée à Genève. 28 % vol. En digestif, en cocktail ou sur un dessert.",

  applicationName: MAISON,
  authors: [{ name: MAISON }],
  creator: MAISON,
  publisher: MAISON,
  category: "food",
  keywords: [
    "liqueur de mandarine",
    "liqueur mandarine Suisse",
    "liqueur artisanale Genève",
    "mandarines siciliennes",
    "digestif suisse",
    "Elisira",
    "H&H Spirits",
    "spiritueux artisanal Genève",
  ],

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: MAISON,
    url: SITE_URL,
    title: "Elisira — Liqueur de mandarines siciliennes",
    description:
      "Recette de famille aux mandarines biologiques de Sicile, élaborée à Genève. 28 % vol.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Elisira — Liqueur de mandarines siciliennes",
    description:
      "Recette de famille aux mandarines biologiques de Sicile, élaborée à Genève. 28 % vol.",
  },

  /* Tant que le site n'a pas remplacé l'ancien, on interdit l'indexation :
     deux sites au contenu identique se concurrencent, et c'est Google qui
     tranche — pas toujours en faveur du bon. */
  robots: SITE_LIVE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Identité de la maison et du site, déclarée une fois pour toutes
            les pages : Google la rapproche des annuaires et de Google
            Business pour valider qui édite le site. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serialiser([organisationJsonLd(), siteJsonLd()]),
          }}
        />
        <LocalCartProvider>
          <MotionProvider>
            <AgeGate />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </MotionProvider>
        </LocalCartProvider>
      </body>
    </html>
  );
}
