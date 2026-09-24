import Image from "next/image";
import Link from "next/link";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  /** Visuel discret à droite du titre — un détail, pas une photo marketing. */
  aside?: { src: string; alt: string };
  /** Action principale, quand la page en appelle une dès l'entrée (B2B). */
  cta?: { href: string; label: string };
  /** Lien secondaire, discret, à côté du CTA. */
  ctaSecondary?: { href: string; label: string };
  /** Hero resserré : pour les pages où l'on doit arriver vite au contenu. */
  compact?: boolean;
};

/**
 * En-tête de page intérieure. Même respiration que le hero, mais
 * sans image : on laisse le contenu commencer vite.
 *
 * Composant serveur : l'entrée est en CSS (`.entree`) et joue dès le
 * premier rendu. Avec Framer, le titre restait invisible jusqu'à
 * l'hydratation.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  aside,
  cta,
  ctaSecondary,
  compact = false,
}: Props) {
  return (
    <section className="plaster relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--product-bg)" }}
      />
      <div
        className={`relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 lg:px-10 ${
          compact
            ? "pb-12 pt-[calc(var(--header-h)+3.5rem)] lg:pb-12 lg:pt-[calc(var(--header-h)+3.75rem)]"
            : "pb-16 pt-[calc(var(--header-h)+5rem)] lg:pb-20 lg:pt-[calc(var(--header-h)+6rem)]"
        } ${
          aside ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:gap-14" : ""
        }`}
      >
        <div className="entree">
          <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
            {eyebrow}
          </p>
          <h1 className="max-w-[16ch] text-[length:var(--text-h2)]">{title}</h1>
          {lead && (
            <p className="body-copy mt-7 text-[length:var(--text-lead)] font-light text-[var(--color-earth-500)]">
              {lead}
            </p>
          )}

          {(cta || ctaSecondary) && (
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {cta && (
                <Link
                  href={cta.href}
                  className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
                >
                  {cta.label}
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="border-b border-[var(--color-border-strong)] pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {aside && (
          <div
            style={{ "--rang": 2 } as React.CSSProperties}
            className="entree-fondu relative mx-auto aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-2)] lg:max-w-[260px]"
          >
            <Image
              src={aside.src}
              alt={aside.alt}
              fill
              sizes="(max-width: 1024px) 60vw, 22vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
