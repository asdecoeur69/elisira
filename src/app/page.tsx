import type { Metadata } from "next";
import { faqJsonLd, filAriane, serialiser } from "@/lib/seo/jsonld";
import { HeroSection } from "@/components/organisms/HeroSection";
import { OriginSection } from "@/components/organisms/OriginSection";
import { IngredientsSection } from "@/components/organisms/IngredientsSection";
import { RangeSection } from "@/components/organisms/RangeSection";
import { QuoteBand } from "@/components/organisms/QuoteBand";
import { UsageSection } from "@/components/organisms/UsageSection";

export const metadata: Metadata = {
  /* Le titre par défaut du layout convient à l'accueil ; on ne redéfinit
     que la canonique, pour que `/?utm_source=…` ne devienne pas une
     seconde page aux yeux de Google. */
  alternates: { canonical: "/" },
};

/**
 * Questions fréquentes.
 *
 * Chaque réponse reprend mot pour mot ce que disent les pages Livraison et
 * CGV : déclarer en données structurées une information absente du site
 * est précisément ce que Google sanctionne.
 */
const FAQ = [
  {
    question: "Qu'est-ce qu'Elisira ?",
    reponse:
      "Elisira est une liqueur de mandarines biologiques siciliennes titrant 28 % vol., élaborée à Collex-Bossy près de Genève. Une recette de famille préservée entièrement naturelle : eau, sucre, alcool et zestes de mandarine, sans arôme artificiel, sans conservateur, sans additif.",
  },
  {
    question: "Comment déguster Elisira ?",
    reponse:
      "En digestif, sortie du congélateur dans un petit verre. En cocktail, avec un pétillant ou en twist d'un classique. Ou versée sur un dessert : glace, panna cotta, tiramisu.",
  },
  {
    question: "Livrez-vous partout en Suisse ?",
    reponse:
      "Oui, nous expédions dans toute la Suisse par la Poste Suisse, sous 2 à 4 jours ouvrables. Les commandes passées avant 14 h sont préparées le jour même, du lundi au vendredi. Nous ne livrons pas hors de Suisse pour le moment.",
  },
  {
    question: "La livraison est-elle offerte ?",
    reponse:
      "La livraison coûte 9 CHF en Suisse, et elle est offerte dès 120 CHF d'achat. Le retrait sur place à Collex-Bossy est gratuit, sur rendez-vous.",
  },
  {
    question: "Quels formats sont disponibles ?",
    reponse:
      "Elisira existe en 50 cl (30 CHF) et en édition Nero Imperiale 70 cl (35 CHF). Une bougie parfumée à la mandarine est également proposée à 10 CHF.",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiser([
            faqJsonLd(FAQ),
            filAriane([{ nom: "Accueil", chemin: "/" }]),
          ]),
        }}
      />
      {/* 1. Hero — la bouteille, la promesse */}
      <HeroSection />

      {/* 2. L'origine — le récit familial, les fondateurs */}
      <OriginSection />

      {/* 3. La recette — quatre ingrédients, rien d'autre */}
      <IngredientsSection />

      {/* 4. La gamme — 50 cl, 70 cl, bougie.
             Placée juste après la recette : on vient d'expliquer ce
             qu'il y a dans la bouteille, c'est le moment d'acheter. */}
      <RangeSection />

      {/* 5. Les trois usages — digestif, cocktail, dessert */}
      <UsageSection />

      {/* 6. Respiration — bande immersive pleine largeur, en clôture */}
      <QuoteBand />
    </>
  );
}
