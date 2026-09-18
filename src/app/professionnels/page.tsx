import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/molecules/PageHeader";

export const metadata: Metadata = {
  title: "Professionnels — H&H Spirits",
  description:
    "Bars, restaurants et caves : référencez Elisira, liqueur de mandarines siciliennes élaborée à Genève. Dégustation sur place, livraison directe.",
};

const MAILTO_DEGUSTATION =
  "mailto:info@hh-spirits.com?subject=Demande%20de%20d%C3%A9gustation%20%E2%80%94%20Elisira&body=Bonjour%2C%0A%0AJe%20souhaite%20organiser%20une%20d%C3%A9gustation%20d%27Elisira%20dans%20mon%20%C3%A9tablissement.%0A%0A%C3%89tablissement%20%3A%0AAdresse%20%3A%0AContact%20%3A%0A%0AMerci%20%C3%A0%20vous.";

const MAILTO_TARIFS =
  "mailto:info@hh-spirits.com?subject=Tarifs%20professionnels%20%E2%80%94%20Elisira&body=Bonjour%2C%0A%0AJe%20souhaite%20recevoir%20vos%20tarifs%20professionnels%20et%20vos%20conditions%20de%20livraison.%0A%0A%C3%89tablissement%20%3A%0AAdresse%20%3A%0AContact%20%3A%0A%0AMerci%20%C3%A0%20vous.";

const ARGUMENTS = [
  {
    titre: "Un service en quinze secondes",
    texte:
      "Glace, Elisira, un top de pétillant, un zeste. Aucune recette à apprendre, aucune préparation en amont — votre équipe l'adopte le premier soir.",
  },
  {
    titre: "Trois usages sur une carte",
    texte:
      "En digestif servi frais, en base de cocktail, ou versée sur un dessert. Une seule bouteille, trois lignes possibles sur votre carte.",
  },
  {
    titre: "Une histoire à raconter",
    texte:
      "Mandarines biologiques de Sicile, recette de famille, élaboration genevoise. Vos clients demandent ce que c'est — vos équipes ont de quoi répondre en une phrase.",
  },
  {
    titre: "Un interlocuteur direct",
    texte:
      "De la dégustation à la livraison, vous échangez directement avec Matisse ou Nathan. Un contact simple, rapide et personnel. Livraison directe sur Genève.",
  },
];

const FICHE = [
  ["Produit", "Liqueur de mandarines siciliennes"],
  ["Degré", "28 % vol."],
  ["Formats", "50 cl — Elisira originale · 70 cl — Nero Imperiale"],
  ["Composition", "Eau, sucre, alcool, zestes de mandarine bio"],
  ["Origine", "Mandarines biologiques de Sicile"],
  ["Production", "Collex-Bossy, Genève"],
  ["Service", "Frais en digestif, en cocktail, sur un dessert"],
];

export default function ProfessionnelsPage() {
  return (
    <>
      <PageHeader
        compact
        eyebrow="Professionnels"
        title={
          <>
            Elisira sur votre carte,{" "}
            <span className="accent-italic">dès ce mois-ci.</span>
          </>
        }
        lead="Bars, restaurants et caves : nous travaillons en direct, sans intermédiaire, avec les établissements de Genève et de Suisse romande."
        cta={{ href: MAILTO_DEGUSTATION, label: "Organiser une dégustation" }}
        ctaSecondary={{ href: "#fiche-produit", label: "Voir la fiche produit" }}
      />

      {/* ── Pourquoi Elisira — grille typographique, sans cartes ── */}
      <section className="bg-[var(--color-chalk)] py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
              Pourquoi Elisira
            </p>
            <h2 className="text-[length:var(--text-h2)]">
              Pensée pour la carte,
              <span className="accent-italic"> simple à servir.</span>
            </h2>
            <p className="mt-6 text-[0.92rem] text-[var(--color-earth-500)]">
              Pour le service comme pour la vente en boutique.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2">
            {ARGUMENTS.map((a, i) => (
              <article key={a.titre}>
                <span className="font-[family-name:var(--font-heading)] text-[1.1rem] text-[var(--color-terracotta)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="mt-3 mb-6 h-px w-full"
                  style={{ background: "var(--hairline)" }}
                />
                <h3 className="text-[1.45rem]">{a.titre}</h3>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
                  {a.texte}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fiche produit — plus dense, faite pour être scannée ── */}
      <section
        id="fiche-produit"
        className="plaster bg-[var(--color-cream)] py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]"
      >
        <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[0.8fr_1fr] lg:gap-16 lg:px-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
            <Image
              src="/images/produits/elisira-50-2.jpg"
              alt="Bouteille Elisira 50 cl"
              fill
              sizes="(max-width: 1024px) 90vw, 38vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="mb-5 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
              Fiche produit
            </p>
            <h2 className="text-[length:var(--text-h3)]">
              Elisira, <span className="accent-italic">en deux formats.</span>
            </h2>

            <dl className="mt-8">
              {FICHE.map(([k, v], i) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline justify-between gap-3 border-t py-3"
                  style={{
                    borderColor: "var(--hairline)",
                    borderBottomWidth: i === FICHE.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                  }}
                >
                  <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-earth-300)]">
                    {k}
                  </dt>
                  <dd className="text-right text-[0.95rem] text-[var(--color-earth)]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href={MAILTO_TARIFS}
              className="mt-8 inline-block border-b pb-1 text-[0.76rem] uppercase tracking-[0.16em] text-[var(--color-terracotta)] transition-colors duration-300 hover:text-[var(--color-terracotta-dark)]"
              style={{ borderColor: "var(--color-terracotta)" }}
            >
              Recevoir les tarifs professionnels
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact — une seule action forte ─────────────────── */}
      <section className="py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
        <div className="mx-auto max-w-[720px] px-6 text-center lg:px-10">
          <h2 className="text-[length:var(--text-h2)]">
            Parlons-en <span className="accent-italic">directement.</span>
          </h2>
          <p className="mt-6 text-[var(--color-earth-500)]">
            Appelez-nous, ou écrivez-nous : nous passons volontiers vous faire
            goûter.
          </p>

          <div className="mt-11">
            <a
              href={MAILTO_DEGUSTATION}
              className="inline-block rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-10 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
            >
              Organiser une dégustation
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[0.92rem] text-[var(--color-earth-500)]">
            <a
              href="mailto:info@hh-spirits.com"
              className="transition-colors duration-300 hover:text-[var(--color-terracotta)]"
            >
              info@hh-spirits.com
            </a>
            <a
              href="tel:+41783304683"
              className="transition-colors duration-300 hover:text-[var(--color-terracotta)]"
            >
              +41 78 330 46 83
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
