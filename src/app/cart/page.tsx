"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocalCart, formatPrice } from "@/lib/cart/LocalCartProvider";
import { PageHeader } from "@/components/molecules/PageHeader";

export default function CartPage() {
  const { resolved, setQuantity, removeLine, subtotal, currency } =
    useLocalCart();

  return (
    <>
      <PageHeader
        eyebrow="Panier"
        title={
          resolved.length === 0 ? (
            <>
              Votre panier est <span className="accent-italic">vide.</span>
            </>
          ) : (
            <>
              Votre <span className="accent-italic">commande.</span>
            </>
          )
        }
      />

      <section className="pb-[var(--spacing-section-mobile)] lg:pb-[var(--spacing-section)]">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          {resolved.length === 0 ? (
            <Link
              href="/commander"
              className="inline-block rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
            >
              Découvrir Elisira
            </Link>
          ) : (
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">
              {/* Lignes */}
              <ul>
                {resolved.map((line, i) => (
                  <li
                    key={line.merchandiseId}
                    className="flex gap-6 border-t py-7"
                    style={{
                      borderColor: "var(--hairline)",
                      borderBottomWidth: i === resolved.length - 1 ? 1 : 0,
                      borderBottomStyle: "solid",
                    }}
                  >
                    <div className="relative h-[130px] w-[100px] shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-cream)]">
                      {line.product.featuredImage && (
                        <Image
                          src={line.product.featuredImage.url}
                          alt={
                            line.product.featuredImage.altText ??
                            line.product.title
                          }
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-[family-name:var(--font-heading)] text-[1.35rem] text-[var(--color-earth-deep)]">
                        {line.product.title}
                      </h2>
                      {line.variant.title !== "Default Title" && (
                        <p className="mt-1 text-[0.8rem] uppercase tracking-[0.14em] text-[var(--color-earth-300)]">
                          {line.variant.title}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div
                          className="flex items-center rounded-[var(--radius-sm)] border"
                          style={{ borderColor: "var(--color-border-strong)" }}
                        >
                          <button
                            type="button"
                            aria-label="Diminuer la quantité"
                            onClick={() =>
                              setQuantity(line.merchandiseId, line.quantity - 1)
                            }
                            className="px-3.5 py-2 text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
                          >
                            −
                          </button>
                          <span className="min-w-[1.75rem] text-center text-[0.95rem] tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Augmenter la quantité"
                            onClick={() =>
                              setQuantity(line.merchandiseId, line.quantity + 1)
                            }
                            className="px-3.5 py-2 text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-[family-name:var(--font-heading)] text-[1.25rem] text-[var(--color-earth-deep)]">
                          {formatPrice(line.lineTotal, currency)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLine(line.merchandiseId)}
                        className="mt-4 text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-earth-300)] underline-offset-4 transition-colors hover:text-[var(--color-terracotta)] hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Récapitulatif */}
              <aside className="h-fit rounded-[var(--radius-lg)] bg-[var(--color-cream)] p-8">
                <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
                  Récapitulatif
                </h2>

                <div className="mt-7 flex items-baseline justify-between">
                  <span className="text-[0.92rem] text-[var(--color-earth-500)]">
                    Sous-total
                  </span>
                  <span className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                <p className="mt-3 text-[0.8rem] text-[var(--color-earth-300)]">
                  Les frais de livraison seront calculés à l&apos;étape
                  suivante.
                </p>

                <Link
                  href="/commande"
                  className="mt-7 block w-full rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-8 py-4 text-center text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
                >
                  Passer commande
                </Link>

                <p className="mt-5 text-[0.75rem] leading-relaxed text-[var(--color-earth-500)]">
                  L&apos;abus d&apos;alcool est dangereux pour la santé. Vente
                  interdite aux mineurs.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
