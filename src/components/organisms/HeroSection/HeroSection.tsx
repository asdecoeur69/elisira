import Link from "next/link";
import Image from "next/image";

/* Composant serveur : aucune animation du hero ne dépend de
   JavaScript. Les entrées sont en CSS (`.entree`, voir globals.css) et
   jouent dès le premier rendu, sans attendre l'hydratation. */

function HeroSection() {
  return (
    <section className="plaster relative flex items-center overflow-hidden lg:h-[92vh] lg:min-h-[92vh]">
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

      {/* Branche — ancrée au bord droit de l'écran, pas au conteneur de
          la bouteille : elle entre dans le cadre par la droite et descend
          en diagonale derrière le produit. `z-0` la garde sous la scène.

          Elle respire : une rotation de ±0,9° autour de son point
          d'entrée dans le cadre, en 9 s. C'est lent et de faible
          amplitude à dessein — assez pour que la scène ne soit pas
          figée, trop peu pour qu'on regarde le mouvement plutôt que le
          produit. On n'anime que `transform`, en CSS (`.branche`).
          `origin-top-right` place le pivot au bord : le mouvement
          s'amplifie vers l'extrémité des feuilles, comme une vraie
          branche portée par l'air, au lieu de tourner sur son centre. */}
      <div
        aria-hidden
        className="branche pointer-events-none absolute right-0 top-[4%] z-0 hidden w-[23%] origin-top-right lg:block"
      >
        <Image
          src="/images/hero/branche.webp"
          alt=""
          aria-hidden
          width={844}
          height={1032}
          sizes="46vw"
          className="w-full max-w-none"
        />
      </div>

      {/* Mobile : une seule colonne où la bouteille s'intercale entre la
          promesse et l'action (`order`) — on voit le produit avant de
          décider. Desktop : deux colonnes, texte à gauche, produit à droite. */}
      <div className="relative mx-auto flex w-full max-w-[1240px] flex-col items-start gap-0 px-6 pb-10 pt-[calc(var(--header-h)+1rem)] lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center lg:gap-14 lg:px-10 lg:pb-20 lg:pt-[calc(var(--header-h)+1.5rem)]">
        {/* ── Texte : marque + promesse ─────────────────────── */}
        <div className="contents lg:block">
          <p
            style={{ "--rang": 0 } as React.CSSProperties}
            className="entree order-1 mb-4 text-[0.66rem] uppercase leading-[1.6] tracking-[0.22em] text-[var(--color-terracotta)] sm:text-[0.7rem] sm:leading-[1.7] sm:tracking-[0.26em] lg:mb-6"
          >
            <span className="sm:hidden">Liqueur de mandarine · Genève</span>
            <span className="hidden sm:inline">
              Liqueur artisanale de mandarine sicilienne · Élaborée à Genève
            </span>
          </p>

          <h1
            style={{ "--rang": 1 } as React.CSSProperties}
            className="entree order-2 text-[length:var(--text-display-mobile)] leading-[1.06] lg:text-[length:var(--text-display)] lg:leading-[1.04]"
          >
            Le soleil de Sicile,{" "}
            <span className="accent-italic">une recette</span> de famille.
          </h1>

          <p
            style={{ "--rang": 2 } as React.CSSProperties}
            className="entree body-copy order-3 mt-4 max-w-[34ch] text-[1.0rem] font-light leading-[1.5] text-[var(--color-earth-500)] sm:max-w-[40ch] lg:mt-8 lg:max-w-[64ch] lg:text-[length:var(--text-lead)] lg:leading-[1.6]"
          >
            Elisira est élaborée à Genève à partir de mandarines biologiques
            siciliennes.{" "}
            <span className="text-[var(--color-earth-deep)]">
              Eau, sucre, alcool, zestes. Rien d&apos;autre.
            </span>
          </p>

          {/* Actions — empilées sur mobile : le bouton ne prend pas toute
              la largeur, le lien secondaire respire en dessous. */}
          <div
            style={{ "--rang": 3 } as React.CSSProperties}
            className="entree order-5 mt-6 flex w-full flex-col items-start gap-4 lg:order-none lg:mt-11 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center"
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
          </div>

          {/* Mentions produit — signature discrète de fin de hero,
              jamais un troisième appel à l'action. */}
          <div
            style={{ "--rang": 4 } as React.CSSProperties}
            className="entree order-6 mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.66rem] uppercase tracking-[0.1em] text-[var(--color-earth-500)] lg:order-none lg:mt-12 lg:gap-x-6 lg:gap-y-2 lg:text-[0.78rem] lg:tracking-[0.16em]"
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
          </div>
        </div>

        {/* ── La scène produit ─────────────────────────────────
            Une seule image : bouteille, mandarines, zeste, fleur et
            leurs ombres. Elle remplace l'assemblage de PNG séparés
            (bouteille + fruits + branche) qui obligeait à recaler à la
            main l'échelle, la direction de la lumière et le raccord des
            ombres entre chaque calque.
            Détourée comme les précédentes : le blanc du fond est
            converti en transparence selon la luminance, de sorte que
            les ombres portées survivent et posent la scène au sol.
            `alt` décrit le produit : c'est la seule image porteuse de
            sens du hero. */}
        <div
          style={{ "--rang": 1 } as React.CSSProperties}
          className="entree order-4 mx-auto mt-5 w-auto lg:order-none lg:mt-0"
        >
          <Image
            src="/images/hero/hero-scene-v2.webp"
            alt="Bouteille Elisira, liqueur de mandarines siciliennes, entourée de mandarines fraîches"
            width={1185}
            height={1200}
            priority
            sizes="(max-width: 1024px) 60vw, 42vw"
            className="h-[34vh] max-h-[300px] min-h-[250px] w-auto object-contain sm:max-h-[380px] lg:-ml-[10%] lg:h-[68vh] lg:max-h-[580px] lg:min-h-0 lg:w-auto lg:max-w-none"
          />
        </div>
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
