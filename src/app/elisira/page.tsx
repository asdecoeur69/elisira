import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ElisiraHero } from "@/components/organisms/ElisiraHero";
import { AddToCartButton } from "@/components/molecules/AddToCartButton";

export const metadata: Metadata = {
  title: "Elisira — Liqueur de mandarines siciliennes | H&H Spirits",
  description:
    "La recette de famille aux mandarines biologiques de Sicile, élaborée à Genève. Disponible en 50 cl et en édition Nero Imperiale 70 cl. 28 % vol.",
};

const REPERES = [
  { k: "Origine", v: "Mandarines biologiques de Sicile" },
  { k: "Élaboration", v: "Collex-Bossy, Genève" },
  { k: "Degré", v: "28 % vol." },
  { k: "Composition", v: "Eau, sucre, alcool, zestes" },
];

const FORMATS = [
  {
    handle: "elisira-50cl",
    variantId: "local/elisira/50cl",
    image: "/images/produits/elisira-50-2.jpg",
    alt: "Elisira 50 cl, posée sur un mur de plâtre",
    titre: "Elisira — 50 cl",
    surtitre: "La bouteille d'origine",
    texte:
      "Le format de référence, celui de la première dégustation. À garder au frais, à sortir au moment du digestif.",
    prix: "CHF 30.—",
  },
  {
    handle: "elisira-70cl",
    variantId: "local/elisira/70cl",
    image: "/images/produits/elisira-70-2.jpg",
    alt: "Elisira Nero Imperiale, 70 cl",
    titre: "Elisira Nero Imperiale — 70 cl",
    surtitre: "L'édition noire",
    texte:
      "La même liqueur en 70 cl, dans son habillage noir. Pensée pour partager, recevoir ou offrir.",
    prix: "CHF 35.—",
  },
];

const SERVICES = [
  {
    image: "/images/usage-digestif.jpg",
    alt: "Elisira servie fraîche dans un petit verre",
    titre: "Fraîche, servie seule",
    texte:
      "Sortie du congélateur, dans un petit verre. La façon la plus directe de découvrir la mandarine : fraîche, tonique, sans rien pour la masquer.",
    details: [
      ["Température", "Sortie du congélateur, −6 à −10 °C"],
      ["Verre", "Petit verre à digestif, 4 à 5 cl"],
      ["Moment", "Fin de repas"],
    ] as Array<[string, string]>,
  },
  {
    image: "/images/usage-cocktail.jpg",
    alt: "Cocktail à base d'Elisira, glaçons et zeste d'agrume",
    titre: "En cocktail",
    texte:
      "Sa douceur de mandarine accompagne aussi bien le pétillant que l'amertume. Le service le plus simple : Elisira, un top de pétillant, un zeste.",
    details: [
      ["Spritz Elisira", "5 cl Elisira · 10 cl pétillant · zeste"],
      ["Verre", "Verre à vin, glace abondante"],
      ["Garniture", "Zeste de mandarine, éventuellement menthe"],
    ] as Array<[string, string]>,
  },
  {
    image: "/images/usage-dessert.jpg",
    alt: "Panna cotta nappée d'Elisira",
    titre: "Sur un dessert",
    texte:
      "Un trait suffit. Le zeste de mandarine réveille le sucre sans l'alourdir — sur une glace vanille, une panna cotta ou un tiramisu.",
    details: [
      ["Quantité", "1 à 2 cl, versés au moment de servir"],
      ["Accords", "Glace vanille, panna cotta, tiramisu"],
      ["À éviter", "Les desserts déjà très acidulés"],
    ] as Array<[string, string]>,
  },
];

export default function ElisiraPage() {
  return (
    <>
      {/* Hero — le texte à gauche, les repères à droite : la question
          « qu'est-ce qu'Elisira ? » trouve sa réponse sans défilement. */}
      <ElisiraHero reperes={REPERES} />

      {/* Les deux formats */}
      <section className="plaster bg-[var(--color-cream)] py-[var(--spacing-section-mobile)] lg:pb-[var(--spacing-section)] lg:pt-[60px]">
        <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
              Les formats
            </p>
            <h2 className="text-[length:var(--text-h2)]">
              Une recette,
              <span className="accent-italic"> deux bouteilles.</span>
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-[920px] grid-cols-1 gap-10 sm:grid-cols-2">
            {FORMATS.map((f) => (
              <article key={f.handle} className="group flex flex-col">
                <Link href={`/products/${f.handle}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-plaster)]">
                    <Image
                      src={f.image}
                      alt={f.alt}
                      fill
                      sizes="(max-width: 640px) 90vw, 44vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-[1.5rem] transition-colors duration-300 group-hover:text-[var(--color-terracotta)]">
                      {f.titre}
                    </h3>
                    <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-terracotta)]">
                      {f.surtitre}
                    </p>
                    <p className="mt-3 text-[0.95rem] text-[var(--color-earth-500)] md:min-h-[4.2em]">
                      {f.texte}
                    </p>
                  </div>
                </Link>

                <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                  <span className="font-[family-name:var(--font-heading)] text-[1.4rem] text-[var(--color-earth-deep)]">
                    {f.prix}
                  </span>
                  <AddToCartButton
                    merchandiseId={f.variantId}
                    label="Ajouter"
                    className="!px-7 !py-2.5 !text-[0.7rem]"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* La différence — la question que tout le monde se pose */}
      <section className="py-[var(--spacing-section-mobile)] lg:py-24">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:px-10">
          <div>
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
              La différence
            </p>
            <h2 className="text-[length:var(--text-h2)]">
              Dans le verre,
              <span className="accent-italic"> exactement la même.</span>
            </h2>
            <div className="body-copy mt-8 space-y-5 text-[var(--color-earth-500)]">
              <p>
                La 50 cl et la Nero Imperiale contiennent rigoureusement la
                même liqueur : mêmes mandarines biologiques siciliennes, même
                recette, même degré. Ce n&apos;est pas une autre cuvée.
              </p>
              <p>
                Ce qui change, c&apos;est le format — 50 ou 70 cl — et
                l&apos;habillage. L&apos;originale pour découvrir Elisira au
                quotidien ; Nero Imperiale pour partager ou offrir.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
            <Image
              src="/images/zestes.jpg"
              alt="Zestes de mandarine sur une planche de bois"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* La dégustation — plus détaillée que l'aperçu de l'accueil :
          ici on donne les températures, les verres et les proportions. */}
      <section
        id="degustation"
        className="plaster bg-[var(--color-cream)] py-[var(--spacing-section-mobile)] lg:py-24"
      >
        <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
              La dégustation
            </p>
            <h2 className="text-[length:var(--text-h2)]">
              Trois façons de
              <span className="accent-italic"> révéler Elisira.</span>
            </h2>
          </div>

          <div className="mt-16 space-y-14 lg:space-y-20">
            {SERVICES.map((sv, i) => (
              <article
                key={sv.titre}
                className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-plaster)]">
                  <Image
                    src={sv.image}
                    alt={sv.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 46vw"
                    className="object-cover"
                  />
                </div>

                <div>
                  <span className="font-[family-name:var(--font-heading)] text-[1.1rem] text-[var(--color-terracotta)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="mt-3 mb-5 h-px w-full"
                    style={{ background: "var(--hairline)" }}
                  />

                  <h3 className="text-[1.6rem]">{sv.titre}</h3>
                  <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
                    {sv.texte}
                  </p>

                  <dl className="mt-7">
                    {sv.details.map(([k, v], j, arr) => (
                      <div
                        key={k}
                        className="flex flex-wrap items-baseline justify-between gap-3 border-t py-3"
                        style={{
                          borderColor: "var(--hairline)",
                          borderBottomWidth: j === arr.length - 1 ? 1 : 0,
                          borderBottomStyle: "solid",
                        }}
                      >
                        <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-earth-300)]">
                          {k}
                        </dt>
                        <dd className="text-right text-[0.95rem] text-[var(--color-earth)]">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-16 text-center text-[0.85rem] text-[var(--color-earth-500)]">
            L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer
            avec modération.
          </p>
        </div>
      </section>

    </>
  );
}
