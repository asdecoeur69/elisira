"use client";

import Image from "next/image";
import { m } from "framer-motion";

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const INGREDIENTS = [
  { name: "Eau", note: "" },
  { name: "Sucre", note: "" },
  { name: "Alcool", note: "" },
  { name: "Zestes de mandarine", note: "biologiques, de Sicile" },
];

/**
 * La recette. Quatre ingrédients, rien d'autre — c'est l'argument
 * le plus fort de la marque, et il mérite sa propre section.
 */
function IngredientsSection() {
  return (
    <section className="relative overflow-hidden py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
        {/* Les zestes — l'ingrédient qui fait la liqueur */}
        <m.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
            <Image
              src="/images/zestes.jpg"
              alt="Zestes de mandarine sur une planche de bois"
              fill
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover"
            />
          </div>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="order-1 lg:order-2"
        >
          <m.p
            variants={rise}
            className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]"
          >
            La recette
          </m.p>

          <m.h2 variants={rise} className="text-[length:var(--text-h2)]">
            Quatre ingrédients.
            <br />
            <span className="accent-italic">Rien d&apos;autre.</span>
          </m.h2>

          <m.p
            variants={rise}
            className="body-copy mt-8 text-[var(--color-earth-500)]"
          >
            Pas d&apos;arôme artificiel, pas de conservateur, pas
            d&apos;additif. Ce que vous lisez sur l&apos;étiquette est
            exactement ce qu&apos;il y a dans la bouteille.
          </m.p>

          {/* La liste, posée sur des filets — registre étiquette */}
          <m.ul variants={stagger} className="mt-11">
            {INGREDIENTS.map((ing, i) => (
              <m.li
                key={ing.name}
                variants={rise}
                className="flex items-baseline gap-5 border-t py-4"
                style={{
                  borderColor: "var(--hairline)",
                  borderBottomWidth: i === INGREDIENTS.length - 1 ? 1 : 0,
                  borderBottomStyle: "solid",
                }}
              >
                <span className="font-[family-name:var(--font-heading)] text-[0.95rem] text-[var(--color-terracotta-soft)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-[family-name:var(--font-heading)] text-[1.35rem] text-[var(--color-earth-deep)]">
                  {ing.name}
                </span>
                {ing.note && (
                  <span className="ml-auto text-right text-[0.78rem] uppercase tracking-[0.14em] text-[var(--color-earth-300)]">
                    {ing.note}
                  </span>
                )}
              </m.li>
            ))}
          </m.ul>

          <m.p
            variants={rise}
            className="mt-8 text-[0.8rem] uppercase tracking-[0.2em] text-[var(--color-earth-300)]"
          >
            28 % vol. · Élaborée à Genève
          </m.p>
        </m.div>
      </div>
    </section>
  );
}

export { IngredientsSection };
export default IngredientsSection;
