/**
 * Contenu éditorial des fiches produit.
 *
 * Séparé du catalogue : ce sont les textes de marque, pas des données
 * commerciales. Indexé par handle, avec un repli neutre si un produit
 * n'a pas encore sa fiche rédigée.
 */

export type FicheEditoriale = {
  /** Surtitre en petites capitales, au-dessus du titre. */
  eyebrow: string;
  /** Titre éditorial — remplace le nom technique du produit. */
  titre: React.ReactNode;
  /** Deux ou trois phrases, pas davantage. */
  accroche: string;
  /** Repères factuels affichés sous le bouton d'achat. */
  reperes: Array<[string, string]>;
  /** Sections dépliables. Aucune promesse que la maison ne tient pas. */
  sections: Array<{
    titre: string;
    corps: string;
    /** Renvoi vers la page Elisira plutôt que de dupliquer son contenu. */
    lien?: { href: string; label: string };
  }>;
};

const LIVRAISON_SUISSE =
  "Expédition depuis Collex-Bossy, en Suisse. Les frais et les délais " +
  "sont indiqués avant la validation de la commande. Retrait possible " +
  "sur place, sur rendez-vous.";

export const EDITORIAL: Record<string, FicheEditoriale> = {
  "elisira-50cl": {
    eyebrow: "La bouteille d'origine",
    titre: "Elisira, la recette de famille.",
    accroche:
      "Le format d'origine, celui de la première dégustation. Une recette simple : eau, sucre, alcool et zestes de mandarines biologiques de Sicile. Rien d'autre.",
    reperes: [
      ["Contenance", "50 cl"],
      ["Degré", "28 % vol."],
      ["Origine", "Mandarines bio de Sicile"],
      ["Élaboration", "Collex-Bossy, Genève"],
    ],
    sections: [
      {
        titre: "La recette",
        corps:
          "Quatre ingrédients : eau, sucre, alcool et zestes de mandarine biologique sicilienne. Sans arôme artificiel, sans conservateur, sans additif.",
        lien: { href: "/elisira", label: "En savoir plus sur Elisira" },
      },
      {
        titre: "La dégustation",
        corps:
          "Fraîche en digestif, en base de cocktail, ou versée sur un dessert.",
        lien: { href: "/elisira#degustation", label: "Températures et proportions" },
      },
      { titre: "Livraison", corps: LIVRAISON_SUISSE },
    ],
  },

  "elisira-70cl": {
    eyebrow: "Édition Nero Imperiale",
    titre: "La recette originale, dans son édition noire.",
    accroche:
      "Exactement la même liqueur que l'originale. Seuls le format et l'habillage changent : 70 cl, dans l'édition noire Nero Imperiale, pensée pour recevoir, partager ou offrir.",
    reperes: [
      ["Contenance", "70 cl"],
      ["Degré", "28 % vol."],
      ["Origine", "Mandarines bio de Sicile"],
      ["Élaboration", "Collex-Bossy, Genève"],
    ],
    sections: [
      {
        titre: "La recette",
        corps:
          "Identique à celle de la 50 cl : eau, sucre, alcool et zestes de mandarine biologique sicilienne. Ce n'est pas une autre cuvée.",
        lien: { href: "/elisira", label: "En savoir plus sur Elisira" },
      },
      {
        titre: "La dégustation",
        corps:
          "Fraîche en digestif, en base de cocktail, ou versée sur un dessert.",
        lien: { href: "/elisira#degustation", label: "Températures et proportions" },
      },
      { titre: "Livraison", corps: LIVRAISON_SUISSE },
    ],
  },

  "bougie-mandarine": {
    eyebrow: "La bougie",
    titre: "Le parfum d'Elisira, autour de la table.",
    accroche:
      "Une bougie parfumée à la mandarine, habillée de l'étiquette de la maison. Une façon de prolonger l'univers d'Elisira au-delà du verre.",
    reperes: [
      ["Parfum", "Mandarine de Sicile"],
      // À compléter par H&H : cire, mèche, durée de combustion, poids.
    ],
    sections: [
      {
        titre: "Le parfum",
        corps:
          "La mandarine sicilienne, celle d'Elisira, en note dominante. Une odeur franche et solaire, sans excès.",
      },
      {
        titre: "Entretien",
        corps:
          "Laisser la cire fondre jusqu'aux bords à la première utilisation. Recouper la mèche avant chaque allumage. Ne jamais laisser une bougie allumée sans surveillance.",
      },
      { titre: "Livraison", corps: LIVRAISON_SUISSE },
    ],
  },
};

/** Une seule suggestion, choisie selon le produit consulté. */
export const SUGGESTION: Record<
  string,
  { texte: string; href: string; label: string }
> = {
  "elisira-50cl": {
    texte: "Envie d'un format à offrir ?",
    href: "/products/elisira-70cl",
    label: "Découvrir Nero Imperiale",
  },
  "elisira-70cl": {
    texte: "Pour découvrir Elisira dans son format d'origine.",
    href: "/products/elisira-50cl",
    label: "Voir la 50 cl",
  },
  "bougie-mandarine": {
    texte: "Retrouvez le parfum à l'origine de la bougie.",
    href: "/elisira",
    label: "Découvrir Elisira",
  },
};

export function getEditorial(handle: string): FicheEditoriale | null {
  return EDITORIAL[handle] ?? null;
}
