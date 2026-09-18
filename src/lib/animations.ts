import type { Variants } from "framer-motion";

/**
 * Le vocabulaire d'apparition du site.
 *
 * Trois règles tenues partout, parce que ce sont elles qui font la
 * différence entre une apparition qui glisse et une qui saccade :
 *
 * 1. On n'anime que `opacity` et `transform`. Toute autre propriété
 *    (hauteur, filtre, couleur) repasse par le layout ou le paint à
 *    chaque image et coûte une saccade sur mobile.
 * 2. Des durées courtes. Une apparition d'une seconde laisse le temps
 *    de voir les images perdues ; à 0,55 s le même mouvement se lit
 *    comme un fondu franc, et les frames manquées deviennent
 *    invisibles.
 * 3. Des déplacements courts (14-16 px). Au-delà, la fin du mouvement
 *    traîne et c'est cette traîne qu'on perçoit comme un à-coup.
 *
 * L'easing est une sortie douce sans rebond : rapide au départ, posé à
 * l'arrivée, sans overshoot qui obligerait l'œil à suivre un retour.
 */
const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;

/** Durée de référence d'une apparition. */
const DURATION = 0.55;

/**
 * L'apparition standard : un fondu monté de 14 px.
 * C'est la seule que les sections devraient utiliser.
 */
export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE_OUT },
  },
};

/**
 * Pour les blocs qui portent une grande image : le déplacement est
 * inutile (la masse bouge mal), un fondu seul suffit et ne demande
 * aucune recomposition de la texture sous-jacente.
 */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/**
 * Le décalage entre enfants. 0,07 s : assez pour qu'on lise une
 * cascade, assez court pour que le dernier élément n'arrive pas
 * longtemps après que l'œil s'est posé dessus.
 *
 * `delayChildren: 0` évite que le conteneur retienne le premier
 * enfant — c'est ce temps mort qu'on lisait comme un à-coup de départ.
 */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};

/**
 * Le réglage de déclenchement, partagé par toutes les sections.
 *
 * `amount: 0.15` plutôt que 0,3-0,4 : au-delà, sur un bloc plus haut
 * que l'écran, le seuil peut n'être jamais atteint — on scrolle et
 * l'apparition se déclenche trop tard, en plein milieu du geste, ce
 * qui la rend impossible à lire comme fluide.
 */
export const viewportOnce = { once: true, amount: 0.15 } as const;

export const fadeInUp = rise;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION, ease: EASE_OUT },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION, ease: EASE_OUT },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION, ease: EASE_OUT },
  },
};

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};
