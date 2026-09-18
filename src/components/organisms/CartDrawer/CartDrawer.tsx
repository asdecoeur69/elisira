"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { useLocalCart, formatPrice } from "@/lib/cart/LocalCartProvider";

export function CartDrawer() {
  const {
    resolved,
    isOpen,
    close,
    setQuantity,
    removeLine,
    subtotal,
    currency,
    totalQuantity,
  } = useLocalCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Voile */}
          <m.button
            type="button"
            aria-label="Fermer le panier"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
            className="fixed inset-0 z-[90] cursor-default"
            style={{ backgroundColor: "rgba(46,38,32,0.42)" }}
          />

          {/* Tiroir */}
          <m.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            className="plaster-grain fixed right-0 top-0 z-[95] flex h-dvh w-full max-w-[440px] flex-col"
            style={{ backgroundColor: "var(--color-plaster)" }}
          >
            {/* En-tête */}
            <header
              className="relative flex items-center justify-between border-b px-7 py-6"
              style={{ borderColor: "var(--hairline)" }}
            >
              <h2 className="text-[0.74rem] uppercase tracking-[0.24em] text-[var(--color-terracotta)]">
                Panier
                {totalQuantity > 0 && (
                  <span className="tabular-nums"> ({totalQuantity})</span>
                )}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer le panier"
                className="text-[0.74rem] uppercase tracking-[0.18em] text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
              >
                Fermer
              </button>
            </header>

            {/* Lignes */}
            {resolved.length === 0 ? (
              <div className="relative flex flex-1 flex-col items-center justify-center px-7 text-center">
                <p className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
                  Votre panier est vide.
                </p>
                <p className="mt-3 text-[0.92rem] text-[var(--color-earth-500)]">
                  Elisira vous attend.
                </p>
              </div>
            ) : (
              <div className="relative flex-1 overflow-y-auto px-7">
                <ul>
                  {resolved.map((line) => (
                    <li
                      key={line.merchandiseId}
                      className="flex gap-5 border-b py-6"
                      style={{ borderColor: "var(--hairline)" }}
                    >
                      <div
                        className="relative h-[92px] w-[72px] shrink-0 overflow-hidden rounded-[3px] border bg-[var(--color-cream)]"
                        style={{ borderColor: "var(--hairline)" }}
                      >
                        {line.product.featuredImage && (
                          <Image
                            src={line.product.featuredImage.url}
                            alt={line.product.featuredImage.altText ?? line.product.title}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-[family-name:var(--font-heading)] text-[1.22rem] leading-snug text-[var(--color-earth-deep)]">
                          {line.product.title}
                        </h3>
                        {line.variant.title !== "Default Title" && (
                          <p className="mt-0.5 text-[0.8rem] uppercase tracking-[0.14em] text-[var(--color-earth-300)]">
                            {line.variant.title}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {/* Quantité */}
                            <div
                              className="flex items-center rounded-[3px] border"
                              style={{ borderColor: "var(--hairline-strong)" }}
                            >
                              <button
                                type="button"
                                aria-label="Diminuer la quantité"
                                onClick={() =>
                                  setQuantity(line.merchandiseId, line.quantity - 1)
                                }
                                className="px-2.5 py-1 text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
                              >
                                −
                              </button>
                              <span className="min-w-[1.25rem] text-center text-[0.85rem] tabular-nums">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Augmenter la quantité"
                                onClick={() =>
                                  setQuantity(line.merchandiseId, line.quantity + 1)
                                }
                                className="px-2.5 py-1 text-[var(--color-earth-500)] transition-colors hover:text-[var(--color-terracotta)]"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeLine(line.merchandiseId)}
                              className="text-[0.7rem] tracking-[0.02em] text-[var(--color-earth-300)] underline-offset-4 transition-colors hover:text-[var(--color-terracotta)] hover:underline"
                            >
                              Retirer
                            </button>
                          </div>

                          <span className="font-[family-name:var(--font-heading)] text-[1.22rem] text-[var(--color-earth-deep)]">
                            {formatPrice(line.lineTotal, currency)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pied */}
            {resolved.length > 0 && (
              <footer
                className="relative border-t px-7 py-7"
                style={{ borderColor: "var(--hairline)" }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.76rem] uppercase tracking-[0.2em] text-[var(--color-earth-500)]">
                    Sous-total
                  </span>
                  <span className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                <p className="mt-2 text-[0.78rem] text-[var(--color-earth-300)]">
                  Les frais de livraison seront calculés à l&apos;étape suivante.
                </p>

                <Link
                  href="/commande"
                  onClick={close}
                  className="mt-6 block w-full rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-center text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
                >
                  Passer commande
                </Link>

                <p className="mt-4 text-center text-[0.72rem] text-[var(--color-earth-500)]">
                  L&apos;abus d&apos;alcool est dangereux pour la santé.
                </p>
              </footer>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
