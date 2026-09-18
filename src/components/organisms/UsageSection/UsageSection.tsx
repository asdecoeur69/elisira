"use client";

import Image from "next/image";
import { m } from "framer-motion";

const USAGES = [
  {
    label: "En digestif",
    title: "Fraîche, servie seule",
    body: "Sortie du congélateur, dans un petit verre. Fraîche et tonique — la façon la plus directe de la découvrir.",
    image: "/images/usage-digestif.jpg",
    alt: "Elisira servie fraîche dans un petit verre, à côté d'une mandarine",
  },
  {
    label: "En cocktail",
    title: "Un twist d'agrumes",
    body: "Sa douceur de mandarine accompagne aussi bien le pétillant que l'amertume. Un spritz, un long drink, un twist de classique.",
    image: "/images/usage-cocktail.jpg",
    alt: "Cocktail à base d'Elisira, glaçons et zeste d'agrume",
  },
  {
    label: "Sur un dessert",
    title: "Un trait suffit",
    body: "Versée sur une glace, une panna cotta ou un tiramisu. Le zeste de mandarine réveille le sucre.",
    image: "/images/usage-dessert.jpg",
    alt: "Panna cotta nappée d'Elisira et suprêmes de mandarine",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16 } },
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

/**
 * Les trois usages. C'est la section qui répond à la question que
 * se pose un barman comme un particulier : qu'est-ce que j'en fais ?
 */
function UsageSection() {
  return (
    <section className="relative py-[var(--spacing-section-mobile)] lg:py-[var(--spacing-section)]">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <m.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-[620px] text-center"
        >
          <p className="mb-6 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
            La dégustation
          </p>
          <h2 className="text-[length:var(--text-h2)]">
            Une bouteille,
            <span className="accent-italic"> trois moments.</span>
          </h2>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3"
        >
          {USAGES.map((u, i) => (
            <m.article
              key={u.label}
              variants={rise}
              className="bg-[var(--color-plaster)] p-5"
            >
              <div className="relative aspect-[37/13] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-cream)]">
                <Image
                  src={u.image}
                  alt={u.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-6 flex items-baseline gap-4 px-2">
                <span className="font-[family-name:var(--font-heading)] text-[1.35rem] leading-none text-[var(--color-terracotta-soft)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--color-terracotta)]">
                  {u.label}
                </span>
              </div>

              <div className="px-2 pb-4">
                <h3 className="mt-3 text-[1.5rem]">{u.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-earth-500)]">
                  {u.body}
                </p>
              </div>
            </m.article>
          ))}
        </m.div>
      </div>
    </section>
  );
}

export { UsageSection };
export default UsageSection;
