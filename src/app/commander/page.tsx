import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/molecules/PageHeader";
import { AddToCartButton } from "@/components/molecules/AddToCartButton";

export const metadata: Metadata = {
  title: "Commander",
  description:
    "Commandez Elisira : la bouteille d'origine 50 cl, l'édition Nero Imperiale 70 cl, et la bougie à la mandarine.",
  alternates: { canonical: "/commander" },
};

const PRODUITS = [
  {
    handle: "elisira-50cl",
    variantId: "local/elisira/50cl",
    image: "/images/produits/elisira-50-2.jpg",
    alt: "Elisira 50 cl",
    titre: "Elisira — 50 cl",
    surtitre: "La bouteille d'origine",
    texte: "La recette de famille, dans son format de référence. 28 % vol.",
    prix: "CHF 30.—",
  },
  {
    handle: "elisira-70cl",
    variantId: "local/elisira/70cl",
    image: "/images/produits/elisira-70-2.jpg",
    alt: "Elisira Nero Imperiale, 70 cl",
    titre: "Elisira Nero Imperiale — 70 cl",
    surtitre: "L'édition noire",
    texte: "La recette originale dans son édition noire, en 70 cl. 28 % vol.",
    prix: "CHF 35.—",
  },
  {
    handle: "bougie-mandarine",
    variantId: "local/bougie/default",
    image: "/images/produits/bougie-1.jpg",
    alt: "Bougie parfumée à la mandarine",
    titre: "La bougie Elisira",
    surtitre: "Pour prolonger l'expérience",
    texte: "Le parfum de la mandarine sicilienne, sur votre table.",
    prix: "CHF 10.—",
  },
];

export default function CommanderPage() {
  return (
    <>
      <PageHeader
        compact
        eyebrow="La collection"
        title={
          <>
            Elisira, <span className="accent-italic">à votre façon.</span>
          </>
        }
        lead="Livraison en Suisse · Retrait à Collex-Bossy sur rendez-vous"
      />

      <section className="pb-14 pt-[52px] lg:pb-16 lg:pt-[65px]">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PRODUITS.map((p) => (
              <article key={p.handle} className="group flex flex-col">
                <Link href={`/products/${p.handle}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-plaster)]">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="mt-6">
                    <h2 className="flex items-center text-[1.35rem] transition-colors duration-300 group-hover:text-[var(--color-terracotta)] md:min-h-[28px]">
                      {p.titre}
                    </h2>
                    <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
                      {p.surtitre}
                    </p>
                    <p className="mt-3 text-[0.95rem] text-[var(--color-earth-500)] md:min-h-[3.4em]">
                      {p.texte}
                    </p>
                  </div>
                </Link>

                <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                  <span className="font-[family-name:var(--font-heading)] text-[1.4rem] text-[var(--color-earth-deep)]">
                    {p.prix}
                  </span>
                  <AddToCartButton
                    merchandiseId={p.variantId}
                    label="Ajouter"
                    className="!px-7 !py-2.5 !text-[0.7rem]"
                  />
                </div>
              </article>
            ))}
          </div>

          <p className="mt-14 text-center text-[0.8rem] text-[var(--color-earth-500)]">
            L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer
            avec modération. Vente interdite aux mineurs.
          </p>
        </div>
      </section>
    </>
  );
}
