"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { rise, stagger, viewportOnce } from "@/lib/animations";
import { LIEUX_DEGUSTATION } from "@/lib/catalog/partenaires";

/**
 * Les établissements qui servent Elisira.
 *
 * Preuve sociale placée juste avant la clôture : le visiteur vient de
 * lire comment déguster la liqueur, c'est le moment de lui montrer où
 * quelqu'un d'autre la sert déjà. Des noms, pas des logos — tant qu'on
 * n'a pas les fichiers en bonne définition, un PNG flou ferait plus de
 * mal que la typo du site.
 *
 * La bande disparaît d'elle-même si la liste est vide : mieux vaut pas
 * de section qu'une section qui annonce des partenaires et n'en montre
 * aucun.
 */
function PartnersBand() {
  if (LIEUX_DEGUSTATION.length === 0) return null;

  return (
    <section className="relative py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <m.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-[620px] text-center"
        >
          <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
            Sur les tables
          </p>
          <h2 className="text-[length:var(--text-h2)]">
            Ils servent
            <span className="accent-italic"> Elisira.</span>
          </h2>
        </m.div>

        <m.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mt-14 flex max-w-[900px] flex-wrap items-center justify-center gap-x-12 gap-y-7"
        >
          {LIEUX_DEGUSTATION.map((p) => (
            <m.li key={p.nom} variants={rise} className="text-center">
              <span className="font-[family-name:var(--font-heading)] text-[1.35rem] text-[var(--color-earth-deep)]">
                {p.nom}
              </span>
              <span className="mt-1 block text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)]">
                {p.ville}
              </span>
            </m.li>
          ))}
        </m.ul>

        <m.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 text-center"
        >
          <Link
            href="/points-de-vente"
            className="inline-block rounded-[var(--radius-sm)] border px-8 py-3.5 text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-terracotta)] transition-colors duration-300 hover:bg-[var(--color-terracotta)] hover:text-[var(--color-cream)]"
            style={{ borderColor: "var(--color-terracotta)" }}
          >
            Où nous trouver
          </Link>
        </m.div>
      </div>
    </section>
  );
}

export { PartnersBand };
