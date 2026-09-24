"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { rise, stagger, viewportOnce } from "@/lib/animations";
import { AddToCartButton } from "@/components/molecules/AddToCartButton";



/**
 * La gamme — trois colonnes.
 *
 * Les deux formats d'Elisira sont le cœur de l'offre ; la bougie reste
 * dans la même grille mais avec moins de poids visuel (image plus
 * courte, titres plus petits, mention « pour prolonger l'expérience »),
 * pour qu'on ne la lise pas comme un troisième produit équivalent.
 */
function RangeSection() {
  return (
    <section className="plaster relative bg-[var(--color-cream)] py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <m.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-[620px] text-center"
        >
          <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
            La collection
          </p>
          <h2 className="text-[length:var(--text-h2)]">
            Elisira,
            <span className="accent-italic"> à votre façon.</span>
          </h2>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {/* ── Elisira 50 cl ───────────────────────────────── */}
          <m.article variants={rise} className="group flex flex-col">
            <Link href="/products/elisira-50cl" className="block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-plaster)]">
                <Image
                  src="/images/produits/elisira-50-2.jpg"
                  alt="Elisira 50 cl, posée sur un mur de plâtre"
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-6">
                <h3 className="text-[1.55rem] transition-colors duration-300 group-hover:text-[var(--color-terracotta)]">
                  Elisira — 50 cl
                </h3>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
                  La bouteille d&apos;origine
                </p>
                <p className="mt-3 text-[0.95rem] text-[var(--color-earth-500)] md:min-h-[3.4em]">
                  La recette de famille, dans son format de référence. 28 % vol.
                </p>
              </div>
            </Link>

            {/* Pied de carte — poussé en bas pour que les trois
                colonnes s'alignent quelle que soit la longueur du texte. */}
            <div className="mt-auto flex items-center justify-between gap-4 pt-5">
              <span className="font-[family-name:var(--font-heading)] text-[1.4rem] text-[var(--color-earth-deep)]">
                CHF 30.—
              </span>
              <AddToCartButton
                merchandiseId="local/elisira/50cl"
                label="Ajouter"
                className="!px-7 !py-2.5 !text-[0.7rem]"
              />
            </div>
          </m.article>

          {/* ── Elisira 70 cl — même recette, édition noire ──── */}
          <m.article variants={rise} className="group flex flex-col">
            <Link href="/products/elisira-70cl" className="block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-plaster)]">
                <Image
                  src="/images/produits/elisira-70-2.jpg"
                  alt="Elisira 70 cl, édition Nero Imperiale"
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-6">
                <h3 className="text-[1.55rem] transition-colors duration-300 group-hover:text-[var(--color-terracotta)]">
                  Elisira — 70 cl
                </h3>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
                  Édition Nero Imperiale
                </p>
                <p className="mt-3 text-[0.95rem] text-[var(--color-earth-500)] md:min-h-[3.4em]">
                  La recette originale dans son édition noire, en 70 cl. 28 % vol.
                </p>
              </div>
            </Link>

            <div className="mt-auto flex items-center justify-between gap-4 pt-5">
              <span className="font-[family-name:var(--font-heading)] text-[1.4rem] text-[var(--color-earth-deep)]">
                CHF 35.—
              </span>
              <AddToCartButton
                merchandiseId="local/elisira/70cl"
                label="Ajouter"
                className="!px-7 !py-2.5 !text-[0.7rem]"
              />
            </div>
          </m.article>

          {/* ── La bougie — volontairement plus discrète ─────── */}
          <m.article variants={rise} className="group flex flex-col">
            <Link href="/products/bougie-mandarine" className="block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-plaster)]">
                <Image
                  src="/images/produits/bougie-1.jpg"
                  alt="Bougie parfumée à la mandarine, étiquette Elisira"
                  fill
                  sizes="(max-width: 768px) 90vw, 26vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-6">
                <h3 className="flex items-center text-[1.25rem] transition-colors duration-300 group-hover:text-[var(--color-terracotta)] md:min-h-[28px]">
                  La bougie Elisira
                </h3>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-earth-300)]">
                  Pour prolonger l&apos;expérience
                </p>
                <p className="mt-3 text-[0.9rem] text-[var(--color-earth-500)] md:min-h-[3.4em]">
                  Le parfum de la mandarine sicilienne, sur votre table.
                </p>
              </div>
            </Link>

            <div className="mt-auto flex items-center justify-between gap-4 pt-5">
              <span className="font-[family-name:var(--font-heading)] text-[1.15rem] text-[var(--color-earth)]">
                CHF 10.—
              </span>
              <AddToCartButton
                merchandiseId="local/bougie/default"
                label="Ajouter"
                className="!px-6 !py-2 !text-[0.68rem]"
              />
            </div>
          </m.article>
        </m.div>
      </div>
    </section>
  );
}

export { RangeSection };
export default RangeSection;
