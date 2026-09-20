/**
 * Limitation de débit — simple, en mémoire, par IP.
 *
 * `/api/checkout` appelle Stripe (création de session, parfois de coupon).
 * Sans borne, une rafale de requêtes sature le quota d'API, pollue le
 * dashboard de sessions jetables et, en production, gonfle la facture.
 *
 * Cette version tient en mémoire : suffisante tant que le site tourne sur
 * une seule instance. Répliqué sur plusieurs instances, chacune aurait son
 * propre compteur — il faudrait alors un magasin partagé (Redis, KV
 * Vercel). Le jour venu, remplacer `verifierLimite` sans toucher aux
 * appelants.
 */

/** Fenêtre glissante, en millisecondes. */
const FENETRE_MS = 60_000;
/** Requêtes autorisées par IP et par fenêtre. */
const MAX_PAR_FENETRE = 10;

/* IP → horodatages des requêtes récentes. */
const journal = new Map<string, number[]>();

/**
 * Enregistre une requête et indique si elle est autorisée.
 *
 * Renvoie `{ ok: false, reessayerDans }` quand la limite est atteinte,
 * `reessayerDans` étant le nombre de secondes avant qu'une place se libère
 * (pour l'en-tête `Retry-After`).
 */
export function verifierLimite(ip: string): {
  ok: boolean;
  reessayerDans: number;
} {
  const maintenant = Date.now();
  const seuil = maintenant - FENETRE_MS;

  const recentes = (journal.get(ip) ?? []).filter((t) => t > seuil);

  if (recentes.length >= MAX_PAR_FENETRE) {
    const plusAncienne = recentes[0];
    const reessayerDans = Math.ceil((plusAncienne + FENETRE_MS - maintenant) / 1000);
    journal.set(ip, recentes);
    return { ok: false, reessayerDans: Math.max(reessayerDans, 1) };
  }

  recentes.push(maintenant);
  journal.set(ip, recentes);

  /* Ménage épisodique : on purge les IP dont toutes les entrées ont
     expiré, pour que la Map ne gonfle pas indéfiniment. */
  if (journal.size > 5000) {
    for (const [cle, ts] of journal) {
      if (ts.every((t) => t <= seuil)) journal.delete(cle);
    }
  }

  return { ok: true, reessayerDans: 0 };
}

/**
 * Adresse de l'appelant, telle que la voit le serveur.
 *
 * Derrière Vercel, l'IP réelle est dans `x-forwarded-for` (premier maillon
 * de la liste). On retombe sur `x-real-ip` puis sur une valeur neutre.
 */
export function adresseAppelant(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "inconnue";
}
