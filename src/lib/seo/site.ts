/**
 * Identité du site pour le référencement.
 *
 * Tout ce qui doit être identique d'une page à l'autre — le domaine, le
 * nom de la maison, l'adresse, les coordonnées — vit ici. Google
 * rapproche ces informations de celles qu'il trouve ailleurs (annuaires,
 * Google Business) : la moindre divergence d'adresse ou de numéro affaiblit
 * la confiance qu'il accorde au site.
 */

/** Domaine public, sans barre oblique finale. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

/**
 * Le site n'est indexable que lorsqu'il est officiellement en ligne.
 *
 * Tant que l'ancien site occupe le domaine, laisser Google indexer une
 * préproduction reviendrait à publier deux fois le même contenu et à se
 * concurrencer soi-même. On reste donc en `noindex` par défaut : c'est
 * l'oubli inverse — mettre en ligne en restant bloqué — qui coûte le plus
 * cher, alors on le rend explicite et documenté.
 */
export const SITE_LIVE = process.env.NEXT_PUBLIC_SITE_LIVE === "1";

export const MAISON = "H&H Spirits";
/**
 * Raison sociale et identifiant, tels qu'inscrits au registre IDE de la
 * Confédération (uid.admin.ch, consulté le 2026-09-20). L'entreprise y
 * figure comme active et inscrite au registre du commerce de Genève.
 */
export const RAISON_SOCIALE = "H&H Spirits SNC";
export const IDE = "CHE-325.125.530";
export const PRODUIT = "Elisira";

/**
 * Deux adresses, à ne pas confondre.
 *
 * Le siège social est celui qui engage l'entreprise : mentions légales,
 * conditions de vente, fiche Google. Le site n'affichait que l'atelier,
 * qui est l'adresse utile au client (retrait, visite) mais n'a aucune
 * valeur juridique.
 */
export const SIEGE = {
  rue: "Cours des Bastions 13",
  codePostal: "1205",
  ville: "Genève",
  canton: "Genève",
  pays: "CH",
} as const;

/** Lieu de production et de retrait des commandes. */
export const ADRESSE = {
  rue: "Chem. des Chaumets 35",
  codePostal: "1239",
  ville: "Collex-Bossy",
  canton: "Genève",
  pays: "CH",
} as const;

export const COURRIEL = "info@hh-spirits.com";
export const TELEPHONES = ["+41783304683", "+41775319606"] as const;

/** Construit une URL absolue à partir d'un chemin interne. */
export function url(chemin = "/") {
  return `${SITE_URL}${chemin.startsWith("/") ? chemin : `/${chemin}`}`;
}
