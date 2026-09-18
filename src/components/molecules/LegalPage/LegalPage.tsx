import { PageHeader } from "@/components/molecules/PageHeader";

export type Bloc = {
  titre: string;
  /** Paragraphes, ou paires clé/valeur pour les blocs d'identité. */
  paragraphes?: string[];
  reperes?: Array<[string, string]>;
  liste?: string[];
};

/**
 * Gabarit des pages d'information (CGV, mentions légales, etc.).
 *
 * Le texte long reste en une colonne étroite : au-delà d'environ
 * 70 caractères par ligne, l'œil perd le début de la ligne suivante.
 */
export function LegalPage({
  eyebrow,
  titre,
  accent,
  lead,
  blocs,
  maj,
}: {
  eyebrow: string;
  titre: string;
  accent: string;
  lead?: string;
  blocs: Bloc[];
  maj?: string;
}) {
  return (
    <>
      <PageHeader
        compact
        eyebrow={eyebrow}
        title={
          <>
            {titre} <span className="accent-italic">{accent}</span>
          </>
        }
        lead={lead}
      />

      <section className="pb-[var(--spacing-section-mobile)] lg:pb-[var(--spacing-section)]">
        <div className="mx-auto max-w-[760px] px-6 lg:px-10">
          {blocs.map((bloc, i) => (
            <div
              key={bloc.titre}
              className={i === 0 ? "" : "mt-14"}
            >
              <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
                {bloc.titre}
              </h2>

              {bloc.paragraphes && (
                <div className="body-copy mt-5 space-y-4 text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]">
                  {bloc.paragraphes.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}

              {bloc.reperes && (
                <dl className="mt-5">
                  {bloc.reperes.map(([k, v], j, arr) => (
                    <div
                      key={k}
                      className="flex flex-wrap items-baseline justify-between gap-3 border-t py-3.5"
                      style={{
                        borderColor: "var(--hairline)",
                        borderBottomWidth: j === arr.length - 1 ? 1 : 0,
                        borderBottomStyle: "solid",
                      }}
                    >
                      <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-earth-300)]">
                        {k}
                      </dt>
                      <dd className="text-right text-[0.95rem] text-[var(--color-earth-deep)]">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {bloc.liste && (
                <ul className="mt-5 space-y-2.5">
                  {bloc.liste.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.98rem] leading-relaxed text-[var(--color-earth-500)]"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.62em] h-px w-3 shrink-0"
                        style={{ background: "var(--color-terracotta)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {maj && (
            <p
              className="mt-16 border-t pt-6 text-[0.8rem] text-[var(--color-earth-300)]"
              style={{ borderColor: "var(--hairline)" }}
            >
              Dernière mise à jour : {maj}.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
