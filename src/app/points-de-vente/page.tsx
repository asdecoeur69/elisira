import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  LIEUX_DEGUSTATION,
  LIEUX_VENTE,
  grouperParVille,
  type Partenaire,
} from "@/lib/catalog/partenaires";

export const metadata: Metadata = {
  title: "Où nous trouver",
  description:
    "Elisira en vente en ligne, au retrait à Collex-Bossy, et servie dans les bars et restaurants de Genève.",
  alternates: { canonical: "/points-de-vente" },
};

/**
 * Points de vente.
 *
 * Deux listes distinctes, et la distinction n'est pas cosmétique : les
 * établissements partenaires servent Elisira au verre, on n'y achète pas
 * de bouteille. Les fondre en une seule liste enverrait quelqu'un
 * repartir bredouille d'un restaurant. Tant que `LIEUX_VENTE` est vide,
 * on le dit franchement plutôt que de le laisser deviner.
 *
 * **Pourquoi les noms sans les adresses.** La liste sert deux publics
 * aux intérêts opposés : le prospect revendeur doit voir qu'Elisira est
 * déjà installée à Genève (plus il y a de noms, mieux c'est), le
 * consommateur ne doit pas y trouver un guide de sortie qui le détourne
 * de la commande. Le nom et la ville prouvent autant que la rue et le
 * téléphone, sans faire itinéraire. Les coordonnées complètes existent
 * dans `partenaires.ts` et sont affichées sur `/professionnels`, où
 * elles ne travaillent que pour nous.
 *
 * Coût assumé : on perd un peu de référencement local (ce sont les
 * adresses qui font remonter sur « où boire une liqueur à Genève »).
 * Arbitrage tranché le 2026-09-23 en faveur du B2B.
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
];

/**
 * Un partenaire, en mention sobre.
 *
 * Nom et type, pas d'adresse, pas de téléphone, pas de lien : la liste
 * prouve l'implantation sans devenir un itinéraire. Voir le commentaire
 * de tête pour l'arbitrage.
 */
function MentionPartenaire({ p }: { p: Partenaire }) {
  return (
    <li className="border-t py-5" style={{ borderColor: "var(--hairline)" }}>
      <span className="font-[family-name:var(--font-heading)] text-[1.2rem] text-[var(--color-earth-deep)]">
        {p.nom}
      </span>
      <span className="mt-1 block text-[0.76rem] uppercase tracking-[0.14em] text-[var(--color-terracotta)]">
        {p.type}
      </span>
    </li>
  );
}

export default function PointsDeVentePage() {
  const parVille = grouperParVille(LIEUX_DEGUSTATION);

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
        lead="En ligne, au domaine, ou au verre chez nos partenaires genevois."
      />

      <section className="pb-[var(--spacing-section-mobile)] lg:pb-[var(--spacing-section)]">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10">
          {/* 1. Acheter une bouteille */}
          <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
            Acheter une bouteille
          </h2>

          <ul className="mt-6">
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
                  <h3 className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
                    {c.titre}
                  </h3>
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

          {/* Les caves viendront ici. Tant qu'il n'y en a aucune, le dire :
              un visiteur qui croit pouvoir acheter en boutique et ne trouve
              rien repart avec une mauvaise impression du produit. */}
          {LIEUX_VENTE.length === 0 && (
            <p className="mt-7 max-w-[58ch] text-[0.92rem] leading-relaxed text-[var(--color-earth-500)]">
              Elisira n&apos;est pas encore vendue à l&apos;emporter en
              boutique : pour une bouteille, c&apos;est en ligne ou au
              domaine.
            </p>
          )}

          {/* 2. Déguster sur place */}
          {parVille.length > 0 && (
            <div className="mt-20">
              <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
                Déguster sur place
              </h2>
              <p className="mt-4 max-w-[58ch] text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
                Elisira est à la carte de ces établissements genevois. Si
                vous y passez, demandez-la au verre.
              </p>

              {parVille.map((groupe) => (
                <div key={groupe.ville} className="mt-12">
                  <h3 className="font-[family-name:var(--font-heading)] text-[1.05rem] text-[var(--color-earth-deep)]">
                    {groupe.ville}
                  </h3>
                  <ul className="mt-4">
                    {groupe.partenaires.map((p) => (
                      <MentionPartenaire key={p.nom} p={p} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* 3. Devenir revendeur */}
          <div
            className="mt-20 rounded-[var(--radius-lg)] p-9"
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
