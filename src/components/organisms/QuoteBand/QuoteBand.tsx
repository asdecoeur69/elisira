"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { fade, rise, stagger, viewportOnce } from "@/lib/animations";



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
      {/* Le rythme vertical appartient à la section, pas à la colonne de
          texte : sinon l'image, qui n'a pas ce padding, vient coller au
          footer une fois les colonnes empilées sur mobile.

          Empilé, l'écart entre le trait du CTA et l'image reprend ce même
          rythme que le padding bas : l'image est alors centrée entre la
          ligne et le footer. (Le soulignement du lien déborde de ~24 px
          hors de sa colonne, d'où un gap plus large que l'écart perçu.)

          Ce bloc respire moins que les sections pleines sur mobile : le
          rythme de section (5rem) y laissait trop de vide autour d'une
          image de 220 px. */}
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[calc(3rem+24px)] px-6 py-12 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-14 lg:px-10 lg:py-16">
        {/* ── Texte ─────────────────────────────────────────── */}
        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex items-center"
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

            <m.div variants={rise} className="mt-7 lg:mt-10">
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
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
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
