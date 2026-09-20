import { LOCAL_PRODUCTS } from "@/lib/catalog/local";

/**
 * Tarification — source de vérité, côté serveur.
 *
 * Rien de ce qui vient du navigateur n'est digne de confiance : ni les
 * prix, ni les totaux, ni la remise. Le client envoie seulement *quoi* et
 * *combien* ; tout le reste est recalculé ici.
 */

export const LIVRAISON = 9;
export const LIVRAISON_OFFERTE_DES = 120;
export const DEVISE = "chf";

/**
 * Quantité maximale par ligne.
 *
 * Le panier doit appliquer la même borne, sans quoi le client peut
 * atteindre 25 exemplaires et ne découvrir le refus qu'au moment de payer.
 */
export const QUANTITE_MAX = 24;

/** Codes promo. La remise est une fraction du sous-total. */
export const CODES: Record<string, { remise: number; libelle: string }> = {
  ELISIRA26: { remise: 0.1, libelle: "ELISIRA26 · −10 %" },
};

/**
 * Frais de port pour un sous-total déjà remisé, en francs.
 *
 * Même règle que `calculerPanier`, mais utilisable côté navigateur pour
 * l'affichage : l'écart entre les deux est ce qui faisait payer la
 * livraison à l'écran alors que le serveur l'offrait.
 */
export function fraisDeLivraison(sousTotalRemise: number): number {
  return sousTotalRemise >= LIVRAISON_OFFERTE_DES ? 0 : LIVRAISON;
}

export type LigneDemandee = { merchandiseId: string; quantity: number };

export type LigneValidee = {
  merchandiseId: string;
  quantity: number;
  titre: string;
  /** Prix unitaire en centimes, lu dans le catalogue. */
  prixUnitaire: number;
  image?: string;
};

/** Retrouve une variante du catalogue et son prix, en centimes. */
function trouverVariante(merchandiseId: string) {
  for (const produit of LOCAL_PRODUCTS) {
    for (const edge of produit.variants.edges) {
      if (edge.node.id === merchandiseId) {
        return {
          titre: produit.title,
          prixUnitaire: Math.round(
            Number.parseFloat(edge.node.price.amount) * 100
          ),
          image: produit.featuredImage?.url,
        };
      }
    }
  }
  return null;
}

export type Panier = {
  lignes: LigneValidee[];
  sousTotal: number;
  remise: number;
  livraison: number;
  total: number;
  code: { libelle: string } | null;
};

/**
 * Valide un panier reçu du navigateur et recalcule chaque montant.
 * Lève une erreur si une ligne ne correspond à aucun produit connu.
 */
export function calculerPanier(
  demandees: unknown,
  codeBrut?: unknown
): Panier {
  if (!Array.isArray(demandees) || demandees.length === 0) {
    throw new Error("Panier vide.");
  }
  if (demandees.length > 20) {
    throw new Error("Trop de lignes dans le panier.");
  }

  const lignes: LigneValidee[] = [];

  for (const brut of demandees) {
    const id = (brut as LigneDemandee)?.merchandiseId;
    const qte = Number((brut as LigneDemandee)?.quantity);

    if (typeof id !== "string") throw new Error("Ligne invalide.");
    if (!Number.isInteger(qte) || qte < 1 || qte > QUANTITE_MAX) {
      throw new Error("Quantité invalide.");
    }

    const trouve = trouverVariante(id);
    if (!trouve) throw new Error(`Produit inconnu : ${id}`);

    lignes.push({
      merchandiseId: id,
      quantity: qte,
      titre: trouve.titre,
      prixUnitaire: trouve.prixUnitaire,
      image: trouve.image,
    });
  }

  const sousTotal = lignes.reduce(
    (t, l) => t + l.prixUnitaire * l.quantity,
    0
  );

  /* Code promo : seul le libellé du serveur fait foi. */
  const clef =
    typeof codeBrut === "string" ? codeBrut.trim().toUpperCase() : "";
  const code = clef && CODES[clef] ? CODES[clef] : null;
  const remise = code ? Math.round(sousTotal * code.remise) : 0;

  const apresRemise = sousTotal - remise;
  const livraison =
    apresRemise >= LIVRAISON_OFFERTE_DES * 100 ? 0 : LIVRAISON * 100;

  return {
    lignes,
    sousTotal,
    remise,
    livraison,
    total: apresRemise + livraison,
    code: code ? { libelle: code.libelle } : null,
  };
}
