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

      {/* Mobile : une seule colonne où la bouteille s'intercale entre la
          promesse et l'action (`order`) — on voit le produit avant de
          décider. Desktop : deux colonnes, texte à gauche, produit à droite. */}
      <div className="relative mx-auto flex w-full max-w-[1240px] flex-col items-start gap-0 px-6 pb-10 pt-[calc(var(--header-h)+1rem)] lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center lg:gap-14 lg:px-10 lg:pb-20 lg:pt-[calc(var(--header-h)+1.5rem)]">
        {/* ── Texte : marque + promesse ─────────────────────── */}
        <m.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="contents lg:block"
        >
          <m.p
            variants={rise}
            className="order-1 mb-4 text-[0.66rem] uppercase leading-[1.6] tracking-[0.22em] text-[var(--color-terracotta)] sm:text-[0.7rem] sm:leading-[1.7] sm:tracking-[0.26em] lg:mb-6"
          >
            <span className="sm:hidden">Liqueur de mandarine · Genève</span>
            <span className="hidden sm:inline">
              Liqueur artisanale de mandarine sicilienne · Élaborée à Genève
            </span>
          </m.p>

          <m.h1
            variants={rise}
            className="order-2 text-[length:var(--text-display-mobile)] leading-[1.06] lg:text-[length:var(--text-display)] lg:leading-[1.04]"
          >
            Le soleil de Sicile,{" "}
            <span className="accent-italic">une recette</span> de famille.
          </m.h1>

          <m.p
            variants={rise}
            className="body-copy order-3 mt-4 max-w-[34ch] text-[1.0rem] font-light leading-[1.5] text-[var(--color-earth-500)] sm:max-w-[40ch] lg:mt-8 lg:max-w-[64ch] lg:text-[length:var(--text-lead)] lg:leading-[1.6]"
          >
            Elisira est élaborée à Genève à partir de mandarines biologiques
            siciliennes.{" "}
            <span className="text-[var(--color-earth-deep)]">
              Eau, sucre, alcool, zestes. Rien d&apos;autre.
            </span>
          </m.p>

          {/* Actions — empilées sur mobile : le bouton ne prend pas toute
              la largeur, le lien secondaire respire en dessous. */}
          <m.div
            variants={rise}
            className="order-5 mt-6 flex w-full flex-col items-start gap-4 lg:order-none lg:mt-11 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center"
          >
            <Link
              href="/elisira"
              className="w-[82%] rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-center text-[0.75rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)] sm:w-auto sm:text-[0.78rem]"
            >
              Découvrir Elisira
            </Link>
            <Link
              href="/about"
              className="border-b border-[var(--color-border-strong)] pb-1 text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)] sm:text-[0.82rem]"
            >
              Notre histoire{" "}
              <span aria-hidden className="lg:hidden">
                →
              </span>
            </Link>
          </m.div>

          {/* Mentions produit — signature discrète de fin de hero,
              jamais un troisième appel à l'action. */}
          <m.div
            variants={rise}
            className="order-6 mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.66rem] uppercase tracking-[0.1em] text-[var(--color-earth-500)] lg:order-none lg:mt-12 lg:gap-x-6 lg:gap-y-2 lg:text-[0.78rem] lg:tracking-[0.16em]"
          >
            <span>28 % vol.</span>
            <span
              aria-hidden
              className="h-2.5 w-px bg-[var(--hairline-strong)] lg:h-3"
            />
            <span>50 &amp; 70 cl</span>
            <span
              aria-hidden
              className="h-2.5 w-px bg-[var(--hairline-strong)] lg:h-3"
            />
            <span className="text-[var(--color-terracotta)]">Mandarines bio</span>
          </m.div>
        </m.div>

        {/* ── Bouteille ─────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="order-4 mx-auto mt-5 w-auto lg:order-none lg:mt-0"
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
              sizes="(max-width: 1024px) 130px, 28vw"
              className="relative h-[34vh] max-h-[300px] min-h-[250px] w-auto object-contain sm:max-h-[380px] lg:h-[71vh] lg:min-h-0 lg:max-h-[620px]"
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
