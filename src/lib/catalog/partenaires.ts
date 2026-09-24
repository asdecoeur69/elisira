/**
 * Les établissements qui servent Elisira.
 *
 * Source unique : la page « Où nous trouver », la bande d'accueil et
 * l'espace professionnels lisent tous ce fichier. Ajouter un partenaire,
 * c'est ajouter une entrée ici — aucune divergence possible entre les
 * trois endroits où les noms apparaissent.
 *
 * Deux règles qui ont coûté cher ailleurs :
 *
 * 1. **Ne jamais lister un établissement sans son accord.** Le citer
 *    comme revendeur l'engage commercialement et révèle à ses
 *    concurrents chez qui il s'approvisionne.
 * 2. **Ne jamais laisser une adresse périmée.** Un client qui se déplace
 *    pour rien ne revient pas : mieux vaut une ligne en moins qu'une
 *    ligne fausse. Revoir la liste à chaque retour du terrain.
 *
 * Coordonnées vérifiées sur annuaires publics le 2026-09-23.
 */

/**
 * Ce qu'on peut y faire — la distinction structure la page.
 *
 * `degustation` : on y boit Elisira au verre.
 * `vente`       : on y achète la bouteille à emporter.
 *
 * Les confondre enverrait quelqu'un acheter une bouteille dans un bar.
 */
export type ModeDeVente = "degustation" | "vente";

export type Partenaire = {
  nom: string;
  /** Affiché tel quel sous le nom : « Bar à bières », « Café-restaurant »… */
  type: string;
  mode: ModeDeVente;
  rue: string;
  codePostal: string;
  ville: string;
  telephone?: string;
  /** URL complète, avec le protocole. Absent si l'établissement n'a pas de site. */
  site?: string;
};

export const PARTENAIRES: readonly Partenaire[] = [
  {
    nom: "El Ruedo",
    type: "Café-restaurant espagnol",
    mode: "degustation",
    rue: "Rue de Fribourg 12",
    codePostal: "1201",
    ville: "Genève",
    telephone: "+41227326508",
  },
  {
    nom: "Le Kraken",
    type: "Bar à bières",
    mode: "degustation",
    rue: "Rue de l'École-de-Médecine 8",
    codePostal: "1205",
    ville: "Genève",
    telephone: "+41223215941",
    site: "https://www.lekrakenbar.ch",
  },
  {
    nom: "Restaurant Roberto",
    type: "Restaurant italien",
    mode: "degustation",
    rue: "Rue Pierre-Fatio 10",
    codePostal: "1204",
    ville: "Genève",
    telephone: "+41223118033",
    site: "https://www.restaurantroberto.ch",
  },
  {
    nom: "La Causette",
    type: "Bar",
    mode: "degustation",
    rue: "Rue du Pré-de-la-Reine 26",
    codePostal: "1236",
    ville: "Cartigny",
    telephone: "+41227560976",
  },
] as const;

/** Les adresses où l'on boit Elisira sur place. */
export const LIEUX_DEGUSTATION = PARTENAIRES.filter(
  (p) => p.mode === "degustation",
);

/** Les adresses où l'on achète la bouteille à emporter. */
export const LIEUX_VENTE = PARTENAIRES.filter((p) => p.mode === "vente");

/**
 * Regroupe par ville, l'ordre des villes suivant celui des partenaires.
 *
 * Genève d'abord parce que les premiers partenaires y sont ; Cartigny,
 * à quinze kilomètres, mérite son propre en-tête plutôt que d'être noyé
 * dans une liste « genevoise » qu'il contredirait.
 */
export function grouperParVille(liste: readonly Partenaire[]) {
  const villes = new Map<string, Partenaire[]>();
  for (const p of liste) {
    const existante = villes.get(p.ville);
    if (existante) existante.push(p);
    else villes.set(p.ville, [p]);
  }
  return [...villes.entries()].map(([ville, partenaires]) => ({
    ville,
    partenaires,
  }));
}

/** `+41227326508` → `022 732 65 08`. Le `href` garde la forme internationale. */
export function formaterTelephone(numero: string) {
  const suisse = numero.replace(/^\+41/, "0");
  return suisse.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4");
}
