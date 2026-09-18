"use client";

import Image from "next/image";
import { m } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

/**
 * L'origine — le récit. Un dimanche d'été 2023, un repas de famille,
 * une recette retrouvée. C'est le cœur de ce que vend la marque.
 */
function OriginSection() {
  return (
    <section className="plaster relative overflow-hidden bg-[var(--color-cream)] py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <m.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
            L&apos;origine
          </p>

          <h2 className="text-[length:var(--text-h2)]">
            Un dimanche d&apos;été,
            <br />
            <span className="accent-italic">autour d&apos;une table.</span>
          </h2>

          <div className="body-copy mt-8 space-y-5 text-[var(--color-earth-500)]">
            <p>
              L&apos;histoire commence en 2023, lors d&apos;un repas de famille
              où nous avons redécouvert la liqueur de mandarine transmise par
              nos aînés.
            </p>
            <p>
              Cette recette précieuse nous a immédiatement conquis par son
              parfum et sa richesse. Dès la première dégustation, nous avons su
              qu&apos;elle méritait d&apos;exister au-delà de notre table.
            </p>
            <p>
              Nous avons choisi de la préserver entièrement naturelle : sans
              arôme artificiel, sans conservateur, sans additif superflu.
            </p>
          </div>

          <p className="mt-10 font-[family-name:var(--font-heading)] text-[1.35rem] italic text-[var(--color-earth)]">
            Matisse Huchon &amp; Nathan Hubschi
          </p>
          <p className="mt-1 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-earth-300)]">
            Fondateurs · Collex-Bossy, Genève
          </p>
        </m.div>

        <m.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-3)]">
            <Image
              src="/images/fondateurs.jpg"
              alt="Matisse Huchon et Nathan Hubschi, fondateurs de H&H Spirits"
              fill
              sizes="(max-width: 1024px) 90vw, 46vw"
              className="object-cover"
            />
          </div>
        </m.div>
      </div>
    </section>
  );
}

export { OriginSection };
export default OriginSection;
