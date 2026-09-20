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
export const PRODUIT = "Elisira";

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
