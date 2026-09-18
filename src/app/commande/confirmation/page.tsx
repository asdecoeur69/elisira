"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocalCart, formatPrice } from "@/lib/cart/LocalCartProvider";

/**
 * Confirmation de commande.
 *
 * Le retour de Stripe recharge entièrement la page : le panier local
 * n'est donc pas encore hydraté au premier rendu (il se relit depuis
 * localStorage de façon asynchrone). On attend la première lecture non
 * vide, on la fige pour l'affichage, puis on vide le panier — sans quoi
 * le récapitulatif disparaîtrait sous les yeux du visiteur.
 */
export default function ConfirmationPage() {
  const { resolved, currency, removeLine } = useLocalCart();

  /* Total réglé transmis par l'étape de paiement (remise éventuelle
     comprise) — lu une seule fois, indépendamment du panier. */
  const [regle] = useState<number | null>(() => {
    try {
      const brut = sessionStorage.getItem("elisira-commande");
      if (brut) {
        const d = JSON.parse(brut);
        if (typeof d?.total === "number") return d.total;
      }
    } catch {
      /* Rien de stocké : on retombe sur le calcul simple. */
    }
    return null;
  });
  const [codePromo] = useState<string | null>(() => {
    try {
      const brut = sessionStorage.getItem("elisira-commande");
      if (brut) {
        const d = JSON.parse(brut);
        if (typeof d?.code === "string") return d.code;
      }
    } catch {
      /* idem */
    }
    return null;
  });

  /* Instantané du panier avant vidage : le panier ne s'hydrate depuis
     localStorage qu'après le premier rendu (retour Stripe = rechargement
     complet de la page), donc `resolved` peut être vide un court instant.
     On retient la première liste non vide observée, en ajustant le state
     pendant le rendu plutôt que dans un effet — cf. la doc React sur
     l'ajustement de state pendant le rendu. */
  const [fige, setFige] = useState<typeof resolved>([]);
  if (fige.length === 0 && resolved.length > 0) {
    setFige(resolved);
  }

  const vide = useRef(false);
  useEffect(() => {
    if (vide.current) return;
    if (resolved.length === 0) return; // pas encore hydraté (ou vraiment vide)
    vide.current = true;
    resolved.forEach((l) => removeLine(l.merchandiseId));
  }, [resolved, removeLine]);

  const numero = `EL-${new Date().getFullYear()}-0148`;

  return (
    <section className="mx-auto max-w-[760px] px-6 pb-[var(--spacing-section)] pt-[calc(var(--header-h)+56px)] lg:px-10">
      <ol className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.2em]">
        <li className="text-[var(--color-earth-300)]">Panier</li>
        <li className="text-[var(--color-earth-300)]">·</li>
        <li className="text-[var(--color-earth-300)]">Livraison</li>
        <li className="text-[var(--color-earth-300)]">·</li>
        <li className="text-[var(--color-terracotta)]">Confirmation</li>
      </ol>

      <p className="mt-10 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
        Commande {numero}
      </p>

      <h1 className="mt-6 text-[length:var(--text-h2)]">
        Merci, votre commande{" "}
        <span className="accent-italic">est confirmée.</span>
      </h1>

      <p className="body-copy mt-7 text-[length:var(--text-lead)] font-light text-[var(--color-earth-500)]">
        Vous recevrez un courriel de confirmation dans quelques minutes. Nous
        préparons votre commande à Collex-Bossy et vous préviendrons dès
        qu&apos;elle part.
      </p>


      {fige.length > 0 && (
        <div className="mt-14">
          <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
            Votre commande
          </h2>

          <ul className="mt-6">
            {fige.map((line, i) => (
              <li
                key={line.merchandiseId}
                className="flex items-baseline justify-between gap-4 border-t py-4"
                style={{
                  borderColor: "var(--hairline)",
                  borderBottomWidth: i === fige.length - 1 ? 1 : 0,
                  borderBottomStyle: "solid",
                }}
              >
                <span className="font-[family-name:var(--font-heading)] text-[1.05rem] text-[var(--color-earth-deep)]">
                  {line.product.title}
                  <span className="ml-2 text-[0.85rem] text-[var(--color-earth-300)]">
                    × {line.quantity}
                  </span>
                </span>
                <span className="font-[family-name:var(--font-heading)] text-[1.05rem] tabular-nums text-[var(--color-earth-deep)]">
                  {formatPrice(line.lineTotal, currency)}
                </span>
              </li>
            ))}
          </ul>

          {codePromo && (
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-[0.8rem] text-[var(--color-terracotta)]">
                Code appliqué
              </span>
              <span className="text-[0.8rem] uppercase tracking-[0.12em] text-[var(--color-terracotta)]">
                {codePromo}
              </span>
            </div>
          )}

          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-[0.76rem] uppercase tracking-[0.2em] text-[var(--color-earth-500)]">
              Total réglé
            </span>
            <span className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
              {formatPrice(
                regle ??
                  fige.reduce((sum, l) => sum + l.lineTotal, 0) + 9,
                currency
              )}
            </span>
          </div>
        </div>
      )}

      <div className="mt-14 flex flex-wrap items-center gap-6">
        <Link
          href="/commander"
          className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
        >
          Retour à la boutique
        </Link>
        <Link
          href="/contact"
          className="border-b pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
          style={{ borderColor: "var(--color-border-strong)" }}
        >
          Une question ?
        </Link>
      </div>

      <p className="mt-12 text-[0.75rem] text-[var(--color-earth-500)]">
        L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec
        modération. Vente interdite aux mineurs.
      </p>
    </section>
  );
}
