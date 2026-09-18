"use client";

import { m } from "framer-motion";

type Repere = { k: string; v: string };

/**
 * Hero de la page Elisira. Deux colonnes : le récit à gauche, les repères
 * techniques à droite — là où la page laissait auparavant du vide. Les
 * repères tenaient dans une bande pleine largeur sous le hero ; ils
 * répondent mieux à la question « qu'est-ce qu'il y a dedans ? » lorsqu'ils
 * accompagnent directement le texte d'introduction.
 */
export function ElisiraHero({ reperes }: { reperes: Repere[] }) {
  return (
    <section className="plaster relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--product-bg)" }}
      />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-12 px-6 pb-[40px] pt-[calc(var(--header-h)+56px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.75fr)] lg:items-center lg:gap-14 lg:px-10 lg:pb-[50px]">
        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
            La liqueur
          </p>
          <h1 className="max-w-[16ch] text-[length:var(--text-h2)]">
            Une même recette,{" "}
            <span className="accent-italic">deux façons de la partager.</span>
          </h1>
          <p className="body-copy mt-7 max-w-[46ch] text-[1.05rem] leading-snug font-light text-[var(--color-earth-500)]">
            Une liqueur artisanale de mandarine sicilienne, élaborée à Genève.
            L&apos;originale en 50 cl et Nero Imperiale en 70 cl partagent
            exactement la même recette.
          </p>
        </m.div>

        {/* Les repères — 2 × 2, séparés par de simples filets. */}
        <m.dl
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.1,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:[&>div]:min-h-[104px]"
        >
          {reperes.map((r, i) => (
            <div
              key={r.k}
              className="border-t py-5"
              style={{
                borderColor: "var(--hairline)",
                /* Sur deux colonnes, la dernière ligne se ferme d'un filet. */
                borderBottomWidth: i >= reperes.length - 2 ? 1 : 0,
                borderBottomStyle: "solid",
              }}
            >
              <dt className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
                {r.k}
              </dt>
              <dd className="mt-2 font-[family-name:var(--font-heading)] text-[1.05rem] leading-snug font-medium text-[var(--color-earth-deep)]">
                {r.v}
              </dd>
            </div>
          ))}
        </m.dl>
      </div>
    </section>
  );
}
