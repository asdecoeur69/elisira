"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16 } },
};

/**
 * Bloc de clôture — deux colonnes.
 *
 * Le texte tient à gauche sur le fond crème du site, l'image occupe la
 * moitié droite et file jusqu'au bord de l'écran. Pas de texte posé sur
 * la photo : la phrase reste lisible, l'image reste intacte.
 */
function QuoteBand() {
  return (
    <section className="plaster relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-14 lg:px-10">
        {/* ── Texte ─────────────────────────────────────────── */}
        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="flex items-center py-[var(--spacing-section-mobile)] lg:py-16"
        >
          <div className="max-w-[22ch]">
            <m.h2
              variants={rise}
              className="text-[length:var(--text-h2)] leading-[1.14]"
            >
              Un peu de Sicile,
              <br />
              <span className="accent-italic">autour de la table.</span>
            </m.h2>

            <m.div variants={rise} className="mt-10">
              <Link
                href="/commander"
                className="inline-block border-b pb-1.5 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-terracotta)] transition-colors duration-300 hover:text-[var(--color-terracotta-dark)]"
                style={{ borderColor: "var(--color-terracotta)" }}
              >
                Commander Elisira
              </Link>
            </m.div>
          </div>
        </m.div>

        {/* ── Image — file jusqu'au bord droit ──────────────── */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.3, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative h-[220px] lg:h-[340px]"
        >
          <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-lg)]">
            <Image
              src="/images/terrasse-mediterraneenne.jpg"
              alt="Terrasse méditerranéenne en fin d'après-midi, table en bois et poteries"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </m.div>
      </div>
    </section>
  );
}

export { QuoteBand };
export default QuoteBand;
