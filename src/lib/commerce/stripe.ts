import Stripe from "stripe";

/**
 * Client Stripe — serveur uniquement.
 *
 * La clé secrète ne doit jamais atteindre le navigateur : ce module ne
 * s'importe que depuis une route d'API ou un composant serveur.
 */

let cache: Stripe | null = null;

export function getStripe(): Stripe {
  if (cache) return cache;

  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) {
    throw new Error(
      "STRIPE_SECRET_KEY absente. Ajoutez-la dans .env.local (voir .env.example)."
    );
  }

  cache = new Stripe(cle);
  return cache;
}

/**
 * Le paiement n'est proposé que si une clé plausible est configurée.
 *
 * Un gabarit non rempli (`<à remplir>`, `sk_test_...`) doit compter comme
 * absent : sinon la page tente un paiement et échoue en 502, au lieu
 * d'afficher proprement la démonstration.
 */
export function paiementConfigure() {
  const cle = process.env.STRIPE_SECRET_KEY?.trim();
  if (!cle) return false;
  if (!cle.startsWith("sk_")) return false;
  /* Les exemples de la doc se terminent par des points de suspension. */
  if (cle.endsWith("...") || cle.endsWith("…")) return false;
  return cle.length > 20;
}
