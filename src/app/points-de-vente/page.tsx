import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/molecules/PageHeader";

export const metadata: Metadata = {
  title: "Où nous trouver",
  description:
    "Elisira en vente en ligne, au retrait à Collex-Bossy, et chez nos partenaires à Genève et en Suisse romande.",
  alternates: { canonical: "/points-de-vente" },
};

/**
 * Points de vente.
 *
 * La liste des revendeurs est volontairement vide tant qu'elle n'est pas
 * confirmée : annoncer une adresse où la bouteille n'est pas en rayon
 * coûte plus cher que de ne rien annoncer.
 */
const CANAUX = [
  {
    titre: "En ligne",
    detail: "Livraison partout en Suisse, sous 2 à 4 jours ouvrables.",
    action: { label: "Commander", href: "/commander" },
  },
  {
    titre: "Au domaine, à Collex-Bossy",
    detail:
      "Retrait gratuit sur rendez-vous. Chem. des Chaumets 35, 1239 Collex-Bossy.",
    action: { label: "Prendre rendez-vous", href: "/contact" },
  },
  {
    titre: "Bars, restaurants et caves",
    detail:
      "Elisira est servie chez nos partenaires à Genève et en Suisse romande. Nous travaillons en direct, sans intermédiaire.",
    action: { label: "Espace professionnels", href: "/professionnels" },
  },
];

export default function PointsDeVentePage() {
  return (
    <>
      <PageHeader
        compact
        eyebrow="Points de vente"
        title={
          <>
            Où trouver <span className="accent-italic">Elisira.</span>
          </>
        }
        lead="En ligne, au domaine, ou chez nos partenaires genevois."
      />

      <section className="pb-[var(--spacing-section-mobile)] lg:pb-[var(--spacing-section)]">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10">
          <ul>
            {CANAUX.map((c, i) => (
              <li
                key={c.titre}
                className="grid grid-cols-1 gap-5 border-t py-9 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10"
                style={{
                  borderColor: "var(--hairline)",
                  borderBottomWidth: i === CANAUX.length - 1 ? 1 : 0,
                  borderBottomStyle: "solid",
                }}
              >
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
                    {c.titre}
                  </h2>
                  <p className="mt-2.5 max-w-[52ch] text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
                    {c.detail}
                  </p>
                </div>

                <Link
                  href={c.action.href}
                  className="justify-self-start whitespace-nowrap rounded-[var(--radius-sm)] border px-6 py-3 text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-terracotta)] transition-colors duration-300 hover:bg-[var(--color-terracotta)] hover:text-[var(--color-cream)] sm:justify-self-end"
                  style={{ borderColor: "var(--color-terracotta)" }}
                >
                  {c.action.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className="mt-14 rounded-[var(--radius-lg)] p-9"
            style={{ backgroundColor: "var(--color-cream)" }}
          >
            <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
              Vous tenez un établissement
            </h2>
            <p className="mt-4 max-w-[58ch] text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
              Nous cherchons des bars, restaurants et caves pour porter
              Elisira en Suisse romande. Conditions, tarifs revendeur et
              premiers échantillons : parlons-en directement.
            </p>
            <Link
              href="/professionnels"
              className="mt-7 inline-block rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-8 py-3.5 text-[0.74rem] uppercase tracking-[0.16em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
            >
              Devenir revendeur
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
