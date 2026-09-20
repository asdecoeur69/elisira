import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/molecules/PageHeader";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "L'histoire de H&H Spirits débute en 2023, autour d'un repas de famille où nous avons redécouvert la liqueur de mandarine transmise par nos aînés.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="La maison"
        title={
          <>
            Un héritage que nous souhaitons{" "}
            <span className="accent-italic">honorer chaque jour.</span>
          </>
        }
        lead="H&H Spirits est né en 2023 à Collex-Bossy, de la rencontre entre une recette de famille et deux amis décidés à la faire exister au-delà de leur table."
        aside={{
          src: "/images/cocktail-verre.jpg",
          alt: "Elisira servie en cocktail, à côté de la bouteille",
        }}
      />

      {/* L'histoire */}
      <section className="py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <h2 className="text-[length:var(--text-h3)]">L&apos;histoire</h2>
            <div className="body-copy mt-7 space-y-5 text-[var(--color-earth-500)]">
              <p>
                L&apos;histoire de H&amp;H Spirits commence en 2023, un
                dimanche d&apos;été, autour d&apos;un repas de famille. Nous y
                redécouvrons une liqueur de mandarine transmise par nos aînés.
              </p>
              <p>
                Son parfum, sa simplicité et son caractère nous convainquent
                qu&apos;elle mérite d&apos;exister au-delà de notre table.
              </p>
              <p>
                Nous décidons alors d&apos;en préserver l&apos;essentiel : une
                recette courte, des ingrédients choisis avec soin et une
                fabrication artisanale à Genève.
              </p>
            </div>

            {/* Les repères — ce que le récit affirme, en chiffres. */}
            <dl className="mt-12 border-t" style={{ borderColor: "var(--hairline)" }}>
              {[
                ["2023", "La recette retrouvée"],
                ["4", "Ingrédients, pas un de plus"],
                ["2", "Fondateurs, joignables"],
                ["100 %", "Élaborée à Collex-Bossy"],
              ].map(([k, v]) => (
                <div
                  key={v}
                  className="flex items-baseline gap-6 border-b py-4"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <dt className="min-w-[4.5rem] font-[family-name:var(--font-heading)] text-[1.6rem] leading-none text-[var(--color-terracotta)]">
                    {k}
                  </dt>
                  <dd className="text-[0.92rem] text-[var(--color-earth-500)]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-3)] lg:h-full lg:aspect-auto">
            <Image
              src="/images/fondateurs.jpg"
              alt="Matisse Huchon et Nathan Hubschi, fondateurs de H&H Spirits"
              fill
              sizes="(max-width: 1024px) 90vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Les valeurs */}
      <section className="plaster bg-[var(--color-cream)] py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
        <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
              Nos valeurs
            </p>
            <h2 className="text-[length:var(--text-h2)]">
              Le cœur de <span className="accent-italic">H&amp;H Spirits.</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
            {[
              {
                title: "Une recette préservée",
                body: "Quatre ingrédients. Aucun arôme artificiel, aucun conservateur, aucun additif superflu.",
              },
              {
                title: "Une fabrication exigeante",
                body: "Des mandarines biologiques siciliennes, et une élaboration artisanale à Collex-Bossy, Genève.",
              },
              {
                title: "Une maison à taille humaine",
                body: "Une production volontairement maîtrisée, et une relation directe avec ceux qui choisissent Elisira.",
              },
            ].map((v) => (
              <article key={v.title} className="bg-[var(--color-plaster)] px-9 py-12">
                <h3 className="text-[1.5rem]">{v.title}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-earth-500)]">
                  {v.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* La vision */}
      <section className="py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10">
          <div>
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
              Notre vision
            </p>
            <h2 className="text-[length:var(--text-h2)]">
              Ambitieuse, mais ancrée dans{" "}
              <span className="accent-italic">l&apos;authenticité.</span>
            </h2>
            <div className="body-copy mt-7 space-y-5 text-[var(--color-earth-500)]">
              <p>
                Nous voulons faire grandir Elisira sans perdre ce qui lui a
                donné naissance : une recette simple, une fabrication exigeante
                et le plaisir de la partager.
              </p>
              <p>
                Demain, H&amp;H Spirits explorera de nouvelles créations avec
                la même règle : ne jamais ajouter pour impressionner,
                seulement ce qui mérite d&apos;être là.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/elisira"
                className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
              >
                Découvrir Elisira
              </Link>
              <Link
                href="/contact"
                className="border-b border-[var(--color-border-strong)] pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
              >
                Nous contacter
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
            <Image
              src="/images/fleur-oranger.jpg"
              alt="Fleur d'oranger posée sur du lin"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
