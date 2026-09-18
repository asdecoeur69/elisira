"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { useLocalCart, formatPrice } from "@/lib/cart/LocalCartProvider";
import Link from "next/link";
import { getEditorial, SUGGESTION } from "@/lib/catalog/editorial";
import type { ShopifyProduct } from "@/lib/catalog/types";

export interface ProductDetailProps {
  product: ShopifyProduct;
}

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function ProductDetail({ product }: ProductDetailProps) {
  const { linesAdd } = useLocalCart();
  const images = product.images.edges.map((e) => e.node);
  const variant = product.variants.edges[0]?.node;
  const editorial = getEditorial(product.handle);
  const suggestion = SUGGESTION[product.handle];

  const [imageActive, setImageActive] = useState(0);
  const pisteRef = useRef<HTMLDivElement>(null);
  // Évite que le scroll natif (mobile) ne « rattrape » l'index pendant
  // qu'une flèche ou une vignette fait défiler la piste.
  const pilotage = useRef(false);

  /** Fait défiler la piste jusqu'à une image (index absolu) ou d'un
      cran (pas relatif). Le cran part de la position réellement visée,
      pas de l'état React : sinon deux clics rapides se cumulent pendant
      que le défilement doux est encore en cours. */
  const vise = useRef(0);
  const allerA = useCallback((i: number, relatif = false) => {
    const piste = pisteRef.current;
    if (!piste) return;
    const total = piste.children.length;
    if (total === 0) return;
    const brut = relatif ? vise.current + i : i;
    const cible = ((brut % total) + total) % total;
    vise.current = cible;
    setImageActive(cible);
    pilotage.current = true;
    // Le scroll-snap « mandatory » annule les défilements animés sur
    // certains moteurs : on vise la diapo elle-même, et on retombe sur
    // un positionnement instantané si l'animation n'a pas pris.
    const diapo = piste.children[cible] as HTMLElement;
    diapo.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    window.setTimeout(() => {
      if (Math.round(piste.scrollLeft / piste.clientWidth) !== cible) {
        piste.scrollLeft = cible * piste.clientWidth;
      }
    }, 400);
    window.setTimeout(() => {
      pilotage.current = false;
    }, 600);
  }, []);
  // Le scroll-snap se recalcule sur la nouvelle largeur : on réaligne
  // la piste sur l'image courante après un redimensionnement.
  useEffect(() => {
    function realigner() {
      const piste = pisteRef.current;
      if (!piste) return;
      piste.scrollLeft = imageActive * piste.clientWidth;
    }
    window.addEventListener("resize", realigner);
    return () => window.removeEventListener("resize", realigner);
  }, [imageActive]);

  const [quantite, setQuantite] = useState(1);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [ajoute, setAjoute] = useState(false);

  const prix = parseFloat(
    variant?.price.amount ?? product.priceRange.minVariantPrice.amount
  );
  const devise =
    variant?.price.currencyCode ??
    product.priceRange.minVariantPrice.currencyCode;
  const disponible = variant?.availableForSale ?? product.availableForSale;

  function ajouter() {
    if (!variant?.id) return;
    linesAdd([{ merchandiseId: variant.id, quantity: quantite }]);
    setAjoute(true);
    window.setTimeout(() => setAjoute(false), 1800);
  }

  return (
    <section className="pb-[var(--spacing-section-mobile)] pt-[calc(var(--header-h)+3rem)] lg:pb-[var(--spacing-section)] lg:pt-[calc(var(--header-h)+4rem)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-12 px-6 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:gap-16 lg:px-10">
        {/* ── Visuels ───────────────────────────────────────────
            Collants au scroll : la photo accompagne la lecture des
            informations plutôt que de laisser un vide à gauche. */}
        <div>
          <div
            className="group relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-cream)]"
            role="group"
            aria-roledescription="carrousel"
            aria-label={`Photos — ${product.title}`}
          >
            {/* Piste défilante : swipe natif sur mobile, flèches au clic. */}
            <div
              ref={pisteRef}
              onScroll={(e) => {
                if (pilotage.current) return;
                const piste = e.currentTarget;
                const i = Math.round(piste.scrollLeft / piste.clientWidth);
                vise.current = i;
                setImageActive((prev) => (prev === i ? prev : i));
              }}
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {images.map((img, i) => (
                <div
                  key={img.url}
                  className="relative aspect-[4/5] w-full shrink-0 snap-center"
                  aria-hidden={i === imageActive ? undefined : true}
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                {/* Flèches discrètes : voile crème translucide, trait
                    terracotta — visibles sans écraser la photo. */}
                {([
                  ["prev", "Image précédente", "left-3 lg:left-4", "M15 5 8 12l7 7"],
                  ["next", "Image suivante", "right-3 lg:right-4", "M9 5l7 7-7 7"],
                ] as const).map(([sens, label, position, trace]) => (
                  <button
                    key={sens}
                    type="button"
                    aria-label={label}
                    onClick={() => allerA(sens === "next" ? 1 : -1, true)}
                    className={`absolute top-1/2 ${position} z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-[2px] transition-all duration-300 hover:bg-[var(--color-cream)] focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100`}
                    style={{
                      background: "color-mix(in srgb, var(--color-cream) 78%, transparent)",
                      border: "1px solid var(--hairline)",
                      color: "var(--color-earth)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d={trace} />
                    </svg>
                  </button>
                ))}

                {/* Pastilles : repère de position, surtout au doigt. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2 lg:hidden">
                  {images.map((img, i) => (
                    <span
                      key={img.url}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === imageActive ? "18px" : "6px",
                        background:
                          i === imageActive
                            ? "var(--color-terracotta)"
                            : "color-mix(in srgb, var(--color-cream) 70%, transparent)",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 hidden gap-4 lg:flex">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => allerA(i)}
                  aria-label={`Voir l'image ${i + 1}`}
                  aria-current={i === imageActive ? "true" : undefined}
                  className="relative aspect-[4/5] w-[72px] overflow-hidden rounded-[var(--radius-sm)] transition-opacity duration-300 hover:opacity-100"
                  style={{
                    opacity: i === imageActive ? 1 : 0.82,
                    outline:
                      i === imageActive
                        ? "1px solid var(--color-terracotta)"
                        : "1px solid var(--color-border)",
                    outlineOffset: "2px",
                  }}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Informations ──────────────────────────────────── */}
        <m.div variants={stagger} initial="hidden" animate="show">
          <m.p
            variants={rise}
            className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--color-terracotta)]"
          >
            {editorial?.eyebrow ?? product.productType}
          </m.p>

          <m.h1
            variants={rise}
            className="mt-5 max-w-[18ch] text-[length:var(--text-h2)] leading-[1.14]"
          >
            {editorial?.titre ?? product.title}
          </m.h1>

          <m.p
            variants={rise}
            className="mt-6 font-[family-name:var(--font-heading)] text-[1.75rem] text-[var(--color-earth-deep)]"
          >
            {formatPrice(prix, devise)}
          </m.p>

          <m.p
            variants={rise}
            className="body-copy mt-6 text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]"
          >
            {editorial?.accroche ?? product.description}
          </m.p>

          {/* Quantité */}
          <m.div variants={rise} className="mt-10">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-earth-300)]">
              Quantité
            </p>
            <div
              className="mt-3 inline-flex w-[130px] items-center justify-between rounded-[4px] border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <button
                type="button"
                aria-label="Diminuer la quantité"
                onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                className="px-4 py-1.5 text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-[0.95rem] tabular-nums">
                {quantite}
              </span>
              <button
                type="button"
                aria-label="Augmenter la quantité"
                onClick={() => setQuantite((q) => q + 1)}
                className="px-4 py-1.5 text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
              >
                +
              </button>
            </div>
          </m.div>

          {/* Achat */}
          <m.div variants={rise} className="mt-7">
            <button
              type="button"
              onClick={ajouter}
              disabled={!disponible}
              className="w-full rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-8 py-4 text-[0.76rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-[370px]"
            >
              {!disponible
                ? "Épuisé"
                : ajoute
                ? "Ajouté au panier ✓"
                : `Ajouter au panier — ${formatPrice(prix * quantite, devise)}`}
            </button>
          </m.div>

          <m.p
            variants={rise}
            className="mt-4 text-[0.8rem] text-[var(--color-earth-500)]"
          >
            Livraison en Suisse · Retrait à Collex-Bossy
          </m.p>

          {/* Repères */}
          {editorial && editorial.reperes.length > 0 && (
            <m.dl variants={rise} className="mt-12">
              {editorial.reperes.map(([k, v], i, arr) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline justify-between gap-3 border-t py-3.5"
                  style={{
                    borderColor: "var(--hairline)",
                    borderBottomWidth: i === arr.length - 1 ? 1 : 0,
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
            </m.dl>
          )}

          {product.productType === "Liqueur" && (
            <m.p
              variants={rise}
              className="mt-8 text-[0.8rem] text-[var(--color-earth-500)]"
            >
              L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer
              avec modération. Vente interdite aux mineurs.
            </m.p>
          )}
        </m.div>
      </div>


      {/* Les sections détaillées passent en pleine largeur : la colonne
          droite s'arrête après les caractéristiques, ce qui évite un
          grand vide sous la galerie. */}
      {editorial && (
        <div className="mx-auto mt-16 max-w-[820px] px-6 lg:mt-24 lg:px-10">
          {editorial.sections.map((sec) => {
            const actif = ouvert === sec.titre;
            return (
              <div
                key={sec.titre}
                className="border-t"
                style={{ borderColor: "var(--hairline)" }}
              >
                <button
                  type="button"
                  onClick={() => setOuvert(actif ? null : sec.titre)}
                  aria-expanded={actif}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-300 hover:text-[var(--color-terracotta)]"
                >
                  <span className="text-[0.78rem] uppercase tracking-[0.2em]">
                    {sec.titre}
                  </span>
                  <span
                    className="text-[1.2rem] leading-none text-[var(--color-terracotta)] transition-transform duration-300"
                    style={{ transform: actif ? "rotate(45deg)" : "none" }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {actif && (
                  <div className="pb-6">
                    <p className="max-w-[60ch] text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
                      {sec.corps}
                    </p>
                    {sec.lien && (
                      <Link
                        href={sec.lien.href}
                        className="mt-4 inline-block border-b pb-0.5 text-[0.85rem] text-[var(--color-terracotta)] transition-colors duration-300 hover:text-[var(--color-terracotta-dark)]"
                        style={{ borderColor: "var(--color-terracotta)" }}
                      >
                        {sec.lien.label} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div className="border-t" style={{ borderColor: "var(--hairline)" }} />
        </div>
      )}

      {/* Une seule suggestion, choisie selon le produit — pas un
          carrousel de cross-selling. */}
      {suggestion && (
        <div className="mx-auto mt-16 max-w-[820px] px-6 lg:mt-20 lg:px-10">
          <div
            className="flex flex-wrap items-baseline justify-between gap-4 border-t pt-8"
            style={{ borderColor: "var(--hairline)" }}
          >
            <p className="text-[1.1rem] text-[var(--color-earth-500)]">
              {suggestion.texte}
            </p>
            <Link
              href={suggestion.href}
              className="border-b pb-1 text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-terracotta)] transition-colors duration-300 hover:text-[var(--color-terracotta-dark)]"
              style={{ borderColor: "var(--color-terracotta)" }}
            >
              {suggestion.label} →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export { ProductDetail };
export default ProductDetail;
