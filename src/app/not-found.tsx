import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

/**
 * Page 404.
 *
 * Next affiche autrement un écran anglais sans en-tête ni pied de page :
 * le visiteur est dans une impasse, sur un site francophone. Ici il garde
 * la navigation du site et deux portes de sortie utiles.
 */
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[760px] flex-col justify-center px-6 pb-[var(--spacing-section-mobile)] pt-[calc(var(--header-h)+56px)] lg:px-10 lg:pb-[var(--spacing-section)]">
      <p className="text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
        Erreur 404
      </p>

      <h1 className="mt-6 text-[length:var(--text-h2)]">
        Cette page <span className="accent-italic">n&apos;existe pas.</span>
      </h1>

      <p className="body-copy mt-7 text-[length:var(--text-lead)] font-light text-[var(--color-earth-500)]">
        Le lien est peut-être erroné, ou la page a été déplacée. Reprenons
        depuis le début.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <Link
          href="/"
          className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/commander"
          className="border-b pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
          style={{ borderColor: "var(--color-border-strong)" }}
        >
          Découvrir Elisira
        </Link>
      </div>
    </section>
  );
}
