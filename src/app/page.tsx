import { HeroSection } from "@/components/organisms/HeroSection";
import { OriginSection } from "@/components/organisms/OriginSection";
import { IngredientsSection } from "@/components/organisms/IngredientsSection";
import { RangeSection } from "@/components/organisms/RangeSection";
import { QuoteBand } from "@/components/organisms/QuoteBand";
import { UsageSection } from "@/components/organisms/UsageSection";

export default function HomePage() {
  return (
    <>
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
