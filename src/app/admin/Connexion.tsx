"use client";

import { useActionState } from "react";
import { connexion } from "./actions";

/**
 * Écran de connexion.
 *
 * Le mot de passe part au serveur, qui seul le vérifie : rien de
 * comparable n'existe dans le code envoyé au navigateur.
 */
export function Connexion() {
  const [etat, action, enCours] = useActionState(connexion, { erreur: "" });

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[420px] flex-col justify-center px-6 pb-[var(--spacing-section-mobile)] pt-[calc(var(--header-h)+40px)]">
      <p className="text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
        Gestion
      </p>
      <h1 className="mt-5 text-[length:var(--text-h3)]">
        Espace <span className="accent-italic">réservé.</span>
      </h1>

      <form action={action} className="mt-9">
        <label
          htmlFor="motdepasse"
          className="block text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)]"
        >
          Mot de passe
        </label>
        <input
          id="motdepasse"
          name="motdepasse"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-describedby={etat.erreur ? "erreur-connexion" : undefined}
          className="mt-3 w-full rounded-[3px] border bg-transparent px-4 py-3 text-[0.95rem] text-[var(--color-earth-deep)] transition-colors focus:border-[var(--color-terracotta)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-terracotta)]"
          style={{ borderColor: "var(--color-border-strong)" }}
        />

        {etat.erreur && (
          <p
            id="erreur-connexion"
            role="alert"
            className="mt-3 text-[0.82rem] text-[var(--color-terracotta)]"
          >
            {etat.erreur}
          </p>
        )}

        <button
          type="submit"
          disabled={enCours}
          className="mt-7 w-full rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-8 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60"
        >
          {enCours ? "Vérification…" : "Entrer"}
        </button>
      </form>
    </section>
  );
}
