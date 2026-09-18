"use client";

import Link from "next/link";
import Image from "next/image";
import { m, type Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] },
  },
};

function HeroSection() {
  return (
    <section className="plaster relative flex items-center overflow-hidden lg:min-h-[92vh]">
      {/* Fond plâtre — lumière rasante venant de la gauche */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--product-bg)" }}
      />

      {/* Halo chaud derrière la bouteille — le soleil de fin d'après-midi */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 34% 46% at 68% 52%, rgba(232,150,63,0.16) 0%, rgba(217,161,132,0.07) 55%, transparent 74%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-6 pb-20 pt-[calc(var(--header-h)+2rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14 lg:px-10 lg:pb-20 lg:pt-[calc(var(--header-h)+1.5rem)]">
        {/* ── Texte ─────────────────────────────────────────── */}
        <m.div variants={stagger} initial="hidden" animate="show">
          <m.p
            variants={rise}
            className="mb-6 text-[0.7rem] uppercase leading-[1.7] tracking-[0.26em] text-[var(--color-terracotta)]"
          >
            Liqueur artisanale de mandarine sicilienne
            <span className="hidden sm:inline"> · Élaborée à Genève</span>
            <span className="block sm:hidden">Élaborée à Genève</span>
          </m.p>

          <m.h1
            variants={rise}
            className="text-[length:var(--text-display)] leading-[1.04]"
          >
            Le soleil de Sicile,{" "}
            <span className="accent-italic">une recette</span> de famille.
          </m.h1>

          <m.p
            variants={rise}
            className="body-copy mt-8 text-[length:var(--text-lead)] font-light text-[var(--color-earth-500)]"
          >
            Elisira est élaborée à Genève à partir de mandarines biologiques
            siciliennes.{" "}
            <span className="text-[var(--color-earth-deep)]">
              Eau, sucre, alcool, zestes. Rien d&apos;autre.
            </span>
          </m.p>

          <m.div
            variants={rise}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/elisira"
              className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
            >
              Découvrir Elisira
            </Link>
            <Link
              href="/about"
              className="border-b border-[var(--color-border-strong)] pb-1 text-[0.82rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
            >
              Notre histoire
            </Link>
          </m.div>

          {/* Mentions produit — sobres, séparées par des filets */}
          <m.div
            variants={rise}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)]"
          >
            <span>28 % vol.</span>
            <span aria-hidden className="h-3 w-px bg-[var(--hairline-strong)]" />
            <span>50 &amp; 70 cl</span>
            <span aria-hidden className="h-3 w-px bg-[var(--hairline-strong)]" />
            <span className="text-[var(--color-terracotta)]">Mandarines bio</span>
          </m.div>
        </m.div>

        {/* ── Bouteille ─────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative mx-auto w-auto"
        >
          <div className="relative">
            {/* Ombre portée — chaude, décalée à droite, cohérente
                avec une lumière venant de la gauche */}
            <div
              aria-hidden
              className="absolute -bottom-[10px] left-1/2 h-[24px] w-[78%] -translate-x-1/2 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(120,85,55,0.30) 0%, rgba(120,85,55,0.10) 48%, transparent 72%)",
                filter: "blur(10px)",
              }}
            />

            <Image
              src="/images/bouteille-hero.png"
              alt="Bouteille Elisira, liqueur de mandarines siciliennes, 50 cl"
              width={267}
              height={822}
              priority
              sizes="(max-width: 1024px) 58vw, 28vw"
              className="relative h-[53vh] max-h-[494px] w-auto object-contain lg:h-[71vh] lg:max-h-[620px]"
              style={{ filter: "drop-shadow(var(--shadow-product))" }}
            />
          </div>
        </m.div>
      </div>

      {/* Filet de bas de hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: "var(--hairline)" }}
      />
    </section>
  );
}

export { HeroSection };
export default HeroSection;
