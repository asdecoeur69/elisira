"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocalCart, formatPrice } from "@/lib/cart/LocalCartProvider";
import { fraisDeLivraison, CODES } from "@/lib/commerce/tarifs";

/**
 * Tunnel de commande.
 *
 * Cette page ne collecte aucune donnée bancaire : elle valide le panier,
 * puis confie le paiement à Stripe Checkout. L'adresse de livraison est
 * demandée par Stripe, qui la renvoie avec la commande.
 */

/* Les codes promo viennent de `tarifs.ts`, comme les frais de port : le
   serveur revalide de toute façon, mais afficher une autre remise que
   celle qui sera appliquée est le meilleur moyen de perdre la vente. */

export default function CommandePage() {
  const { resolved, subtotal, currency, totalQuantity } = useLocalCart();
  const [majeur, setMajeur] = useState(false);

  /* Code promo */
  const [saisie, setSaisie] = useState("");
  const [code, setCode] = useState<{ remise: number; libelle: string } | null>(
    null
  );
  /* Le code retenu, en majuscules : c'est lui que le serveur revalide. */
  const [codeSaisi, setCodeSaisi] = useState("");
  const [erreurCode, setErreurCode] = useState("");

  /* Paiement en cours : le bouton attend la redirection vers Stripe. */
  const [envoi, setEnvoi] = useState(false);

  const remise = code ? subtotal * code.remise : 0;
  const livraison = fraisDeLivraison(subtotal - remise);
  const total = subtotal - remise + livraison;

  function appliquerCode(e?: { preventDefault: () => void }) {
    e?.preventDefault();
    const clef = saisie.trim().toUpperCase();
    if (!clef) return;
    const trouve = CODES[clef];
    if (trouve) {
      setCode(trouve);
      setCodeSaisi(clef);
      setErreurCode("");
      setSaisie("");
    } else {
      setCode(null);
      setCodeSaisi("");
      setErreurCode("Ce code n'est pas valable.");
    }
  }

  /* Erreurs de validation, affichées à l'endroit du problème. */
  const [erreurAge, setErreurAge] = useState("");
  const [erreurPaiement, setErreurPaiement] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreurPaiement("");

    if (!majeur) {
      setErreurAge(
        "Veuillez confirmer que vous avez 18 ans révolus pour continuer."
      );
      document
        .querySelector<HTMLInputElement>('input[type="checkbox"]')
        ?.focus();
      return;
    }
    setErreurAge("");

    /* Pas d'animation intermédiaire : on laisse Stripe prendre la main
       le plus vite possible. Le bouton passe en attente, rien de plus. */
    setEnvoi(true);

    try {
      const rep = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lignes: resolved.map((l) => ({
            merchandiseId: l.merchandiseId,
            quantity: l.quantity,
          })),
          code: codeSaisi,
          majeur,
        }),
      });

      const data = await rep.json();
      if (!rep.ok) throw new Error(data?.error ?? "Paiement indisponible.");

      /* Stripe prend la main : on quitte le site. */
      window.location.href = data.url;
    } catch (err) {
      setEnvoi(false);
      setErreurPaiement(
        err instanceof Error ? err.message : "Paiement indisponible."
      );
    }
  }

  if (resolved.length === 0) {
    return (
      <section className="mx-auto max-w-[1240px] px-6 pb-[var(--spacing-section)] pt-[calc(var(--header-h)+90px)] lg:px-10">
        <h1 className="text-[length:var(--text-h2)]">
          Votre panier est <span className="accent-italic">vide.</span>
        </h1>
        <Link
          href="/commander"
          className="mt-8 inline-block rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
        >
          Découvrir Elisira
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-[var(--spacing-section)] pt-[calc(var(--header-h)+48px)] lg:px-10">
      {/* Fil d'étapes */}
      <ol className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.2em]">
        <li className="text-[var(--color-earth-300)]">Panier</li>
        <li className="text-[var(--color-earth-300)]">·</li>
        <li className="text-[var(--color-terracotta)]">Livraison</li>
        <li className="text-[var(--color-earth-300)]">·</li>
        <li className="text-[var(--color-earth-300)]">Confirmation</li>
      </ol>

      <h1 className="mt-6 text-[length:var(--text-h2)]">
        Votre <span className="accent-italic">commande.</span>
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        {/* Formulaire */}
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <h2 className="text-[0.74rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
              Paiement sécurisé
            </h2>

            <p className="body-copy mt-5 max-w-[54ch] text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
              Le paiement est sécurisé par Stripe. Vous pourrez régler par
              carte bancaire ou TWINT, choisir la livraison ou le retrait
              gratuit à Collex-Bossy, et renseigner votre adresse à
              l&apos;étape suivante. H&amp;H Spirits ne conserve aucune
              donnée bancaire.
            </p>

            {/* Les valeurs restent près de leurs libellés : une colonne
                fixe vaut mieux qu'un justify-between qui les écarte. */}
            <dl className="mt-6">
              {[
                ["Livraison", "Partout en Suisse"],
                ["Paiement", "Carte bancaire, TWINT"],
                ["Retrait", "À Collex-Bossy, sur demande"],
              ].map(([k, v], i, arr) => (
                <div
                  key={k}
                  className="grid grid-cols-[minmax(0,10rem)_1fr] items-baseline gap-4 border-t py-3"
                  style={{
                    borderColor: "var(--hairline)",
                    borderBottomWidth: i === arr.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                  }}
                >
                  <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-earth-300)]">
                    {k}
                  </dt>
                  <dd className="text-[0.95rem] text-[var(--color-earth-deep)]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Vente d'alcool : la confirmation d'âge est obligatoire.
              Le champ reste actif même non coché — un bouton grisé sans
              explication laisse le visiteur chercher ce qui ne va pas. */}
          <label className="group mt-8 flex cursor-pointer items-start gap-3.5">
            <input
              type="checkbox"
              checked={majeur}
              required
              aria-describedby={erreurAge ? "erreur-age" : undefined}
              onChange={(e) => {
                setMajeur(e.target.checked);
                if (e.target.checked) setErreurAge("");
              }}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="mt-[3px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-terracotta)]"
              style={{
                borderColor: majeur
                  ? "var(--color-terracotta)"
                  : erreurAge
                    ? "var(--color-terracotta)"
                    : "var(--color-border-strong)",
                backgroundColor: majeur
                  ? "var(--color-terracotta)"
                  : "transparent",
              }}
            >
              {majeur && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2 4.8 8.5 9.5 3.8"
                    stroke="var(--color-cream)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-[0.88rem] leading-relaxed text-[var(--color-earth-500)]">
              Je certifie avoir 18 ans révolus. La vente d&apos;alcool est
              interdite aux mineurs.
            </span>
          </label>

          {erreurAge && (
            <p
              id="erreur-age"
              role="alert"
              className="mt-3 text-[0.85rem] text-[var(--color-terracotta)]"
            >
              {erreurAge}
            </p>
          )}

          <button
            type="submit"
            disabled={envoi}
            aria-busy={envoi}
            className={`mt-8 w-full rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-[1.15rem] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 sm:w-[340px] ${
              envoi
                ? "cursor-wait opacity-80"
                : "cursor-pointer hover:bg-[var(--color-terracotta-dark)]"
            }`}
          >
            {envoi ? "Redirection…" : "Procéder au paiement"}
          </button>

          {erreurPaiement && (
            <p
              role="alert"
              className="mt-4 text-[0.85rem] text-[var(--color-terracotta)]"
            >
              {erreurPaiement}
            </p>
          )}

          <p className="mt-5 text-[0.75rem] text-[var(--color-earth-500)]">
            L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer
            avec modération.
          </p>
        </form>

        {/* Récapitulatif */}
        <aside className="h-fit rounded-[var(--radius-lg)] bg-[var(--color-cream)] p-8">
          <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
            Votre panier
            {totalQuantity > 0 && (
              <span className="tabular-nums">
                {" · "}
                {totalQuantity} article{totalQuantity > 1 ? "s" : ""}
              </span>
            )}
          </h2>

          <ul className="mt-6">
            {resolved.map((line, i) => (
              <li
                key={line.merchandiseId}
                className="flex gap-4 border-t py-4"
                style={{
                  borderColor: "var(--hairline)",
                  borderBottomWidth: i === resolved.length - 1 ? 1 : 0,
                  borderBottomStyle: "solid",
                }}
              >
                <div
                  className="relative h-[64px] w-[50px] shrink-0 overflow-hidden rounded-[3px] border bg-[var(--color-plaster)]"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  {line.product.featuredImage && (
                    <Image
                      src={line.product.featuredImage.url}
                      alt={
                        line.product.featuredImage.altText ??
                        line.product.title
                      }
                      fill
                      sizes="50px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-[family-name:var(--font-heading)] text-[1rem] leading-snug text-[var(--color-earth-deep)]">
                    {line.product.title}
                  </p>
                  <p className="mt-1 text-[0.78rem] text-[var(--color-earth-300)]">
                    Quantité {line.quantity}
                  </p>
                </div>

                <span className="font-[family-name:var(--font-heading)] text-[1rem] text-[var(--color-earth-deep)]">
                  {formatPrice(line.lineTotal, currency)}
                </span>
              </li>
            ))}
          </ul>

          {/* Code promo */}
          <div className="mt-6">
            {code ? (
              /* Code déjà appliqué : une ligne, pas un encadré — le cadre
                 le faisait passer pour un champ encore à remplir. */
              <div className="flex items-center gap-2.5">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                  className="shrink-0"
                >
                  <path
                    d="M2 6.2 4.5 8.7 10 3.2"
                    stroke="var(--color-terracotta)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="min-w-0 flex-1 text-[0.82rem] text-[var(--color-terracotta)]">
                  Code{" "}
                  <span className="uppercase tracking-[0.1em]">{codeSaisi}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCode(null);
                    setCodeSaisi("");
                  }}
                  className="shrink-0 text-[0.72rem] text-[var(--color-earth-300)] underline-offset-4 transition-colors hover:text-[var(--color-terracotta)] hover:underline"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saisie}
                  onChange={(e) => {
                    setSaisie(e.target.value);
                    setErreurCode("");
                  }}
                  onKeyDown={(e) => {
                    /* Entrée applique le code — sans quoi le formulaire
                       partirait au paiement, remise non prise en compte. */
                    if (e.key === "Enter") {
                      e.preventDefault();
                      appliquerCode();
                    }
                  }}
                  placeholder="Code promo"
                  aria-label="Code promo"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  aria-invalid={Boolean(erreurCode)}
                  aria-describedby={erreurCode ? "erreur-code" : undefined}
                  className="min-w-0 flex-1 rounded-[3px] border bg-transparent px-3.5 py-2.5 text-[0.85rem] uppercase tracking-[0.08em] text-[var(--color-earth-deep)] transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--color-earth-300)] focus:border-[var(--color-terracotta)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-terracotta)]"
                  style={{ borderColor: "var(--hairline-strong)" }}
                />
                <button
                  type="button"
                  onClick={appliquerCode}
                  className="shrink-0 rounded-[3px] border px-4 text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-earth-500)] transition-colors hover:border-[var(--color-terracotta)] hover:text-[var(--color-terracotta)]"
                  style={{ borderColor: "var(--hairline-strong)" }}
                >
                  Appliquer
                </button>
              </div>
            )}

            {erreurCode && (
              <p
                id="erreur-code"
                role="alert"
                className="mt-2 text-[0.78rem] text-[var(--color-terracotta)]"
              >
                {erreurCode}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-2.5">
            <Ligne
              label="Sous-total"
              valeur={formatPrice(subtotal, currency)}
            />
            {code && (
              <Ligne
                label="Remise"
                valeur={`− ${formatPrice(remise, currency)}`}
                accent
              />
            )}
            <Ligne
              label={
                livraison === 0 ? "Livraison offerte" : "Livraison en Suisse"
              }
              valeur={
                livraison === 0 ? "Offerte" : formatPrice(livraison, currency)
              }
              accent={livraison === 0}
            />
          </div>

          <div
            className="mt-5 flex items-baseline justify-between border-t pt-5"
            style={{ borderColor: "var(--hairline-strong)" }}
          >
            <span className="text-[0.76rem] uppercase tracking-[0.2em] text-[var(--color-earth-500)]">
              Total
            </span>
            <span className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
              {formatPrice(total, currency)}
            </span>
          </div>

          <Link
            href="/cart"
            className="mt-7 inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-earth-500)] underline-offset-4 transition-colors hover:text-[var(--color-terracotta)] hover:underline"
          >
            <span aria-hidden>&larr;</span>
            Modifier le panier
          </Link>
        </aside>
      </div>

    </section>
  );
}

function Ligne({
  label,
  valeur,
  accent = false,
}: {
  label: string;
  valeur: string;
  accent?: boolean;
}) {
  const couleur = accent
    ? "text-[var(--color-terracotta)]"
    : "text-[var(--color-earth-deep)]";
  return (
    <div className="flex items-baseline justify-between">
      <span
        className={`text-[0.88rem] ${
          accent ? "text-[var(--color-terracotta)]" : "text-[var(--color-earth-500)]"
        }`}
      >
        {label}
      </span>
      <span className={`text-[0.95rem] tabular-nums ${couleur}`}>{valeur}</span>
    </div>
  );
}

