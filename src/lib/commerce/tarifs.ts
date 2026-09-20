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

/**
 * Modes de livraison.
 *
 * Le choix se fait sur le site, pas chez Stripe : là-bas il est relégué
 * sous le formulaire d'adresse, après deux écrans de défilement, et le
 * total affiché inclut d'emblée les frais de port — un client qui aurait
 * pris le retrait voit donc un prix gonflé sans savoir qu'un choix existe.
 */
export type ModeLivraison = "livraison" | "retrait";

export const MODES: Record<
  ModeLivraison,
  { libelle: string; detail: string; delai: string }
> = {
  livraison: {
    libelle: "Livraison en Suisse",
    detail: "Par la Poste Suisse, à l'adresse de votre choix.",
    delai: "2 à 4 jours ouvrables",
  },
  retrait: {
    libelle: "Retrait à Collex-Bossy",
    detail: "Chem. des Chaumets 35. Nous convenons d'un créneau par téléphone.",
    delai: "Sur rendez-vous",
  },
};

/** Normalise un mode reçu du navigateur ; tout le reste vaut livraison. */
export function normaliserMode(brut: unknown): ModeLivraison {
  return brut === "retrait" ? "retrait" : "livraison";
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
  mode: ModeLivraison;
  total: number;
  /* `clef` et `remise` (fraction, ex. 0.1) permettent à la route de créer
     un coupon Stripe réutilisable — un par code — plutôt qu'un coupon
     jetable à chaque requête. */
  code: { clef: string; libelle: string; remise: number } | null;
};

/**
 * Valide un panier reçu du navigateur et recalcule chaque montant.
 * Lève une erreur si une ligne ne correspond à aucun produit connu.
 */
export function calculerPanier(
  demandees: unknown,
  codeBrut?: unknown,
  modeBrut?: unknown
): Panier {
  const mode = normaliserMode(modeBrut);
  if (!Array.isArray(demandees) || demandees.length === 0) {
    throw new Error("Panier vide.");
  }
  if (demandees.length > 20) {
    throw new Error("Trop de lignes dans le panier.");
  }

  /* Fusion par produit : deux lignes du même `merchandiseId` sont
     additionnées avant de vérifier la borne. Sans ça, `QUANTITE_MAX`
     s'applique par ligne et se contourne en dupliquant la ligne — 20 fois
     24 = 480 exemplaires passaient. On borne le *cumul*, pas la ligne. */
  const parProduit = new Map<string, LigneValidee>();

  for (const brut of demandees) {
    const id = (brut as LigneDemandee)?.merchandiseId;
    const qte = Number((brut as LigneDemandee)?.quantity);

    if (typeof id !== "string") throw new Error("Ligne invalide.");
    if (!Number.isInteger(qte) || qte < 1 || qte > QUANTITE_MAX) {
      throw new Error("Quantité invalide.");
    }

    const trouve = trouverVariante(id);
    if (!trouve) throw new Error(`Produit inconnu : ${id}`);

    const existante = parProduit.get(id);
    if (existante) {
      if (existante.quantity + qte > QUANTITE_MAX) {
        throw new Error("Quantité invalide.");
      }
      existante.quantity += qte;
    } else {
      parProduit.set(id, {
        merchandiseId: id,
        quantity: qte,
        titre: trouve.titre,
        prixUnitaire: trouve.prixUnitaire,
        image: trouve.image,
      });
    }
  }

  const lignes: LigneValidee[] = [...parProduit.values()];

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
  /* Le retrait est gratuit par nature ; sinon le seuil de gratuité
     s'applique. C'est le serveur qui tranche : un mode envoyé par le
     navigateur ne fixe jamais un montant, il ne fait que le désigner. */
  const livraison =
    mode === "retrait"
      ? 0
      : apresRemise >= LIVRAISON_OFFERTE_DES * 100
        ? 0
        : LIVRAISON * 100;

  return {
    lignes,
    sousTotal,
    remise,
    livraison,
    mode,
    total: apresRemise + livraison,
    code: code
      ? { clef, libelle: code.libelle, remise: code.remise }
      : null,
  };
}
