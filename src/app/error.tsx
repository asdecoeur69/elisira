"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Écran d'erreur.
 *
 * Sans ce fichier, une erreur côté client laisse une page blanche : le
 * visiteur ne sait ni ce qui s'est passé, ni quoi faire. On lui propose de
 * réessayer, puis une sortie.
 *
 * Le message technique n'est jamais affiché — il peut contenir des détails
 * internes — mais il est journalisé pour le diagnostic.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[erreur]", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[760px] flex-col justify-center px-6 pb-[var(--spacing-section-mobile)] pt-[calc(var(--header-h)+56px)] lg:px-10 lg:pb-[var(--spacing-section)]">
      <p className="text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
        Incident technique
      </p>

      <h1 className="mt-6 text-[length:var(--text-h2)]">
        Quelque chose <span className="accent-italic">a échoué.</span>
      </h1>

      <p className="body-copy mt-7 text-[length:var(--text-lead)] font-light text-[var(--color-earth-500)]">
        Nous n&apos;avons pas pu afficher cette page. Réessayez : si le
        problème persiste, écrivez-nous, nous prenons votre commande
        directement.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
        >
          Réessayer
        </button>
        <Link
          href="/contact"
          className="border-b pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
          style={{ borderColor: "var(--color-border-strong)" }}
        >
          Nous contacter
        </Link>
      </div>

      {error.digest && (
        <p className="mt-10 text-[0.72rem] text-[var(--color-earth-300)]">
          Référence de l&apos;incident : {error.digest}
        </p>
      )}
    </section>
  );
}
