import { getLocalProduct, getLocalProducts } from "./local";
import type { ShopifyProduct, Connection } from "@/lib/catalog/types";

/**
 * Accès au catalogue.
 *
 * Les produits sont écrits à la main dans `local.ts` : trois références,
 * des prix stables, aucune gestion de stock en temps réel. Une API
 * e-commerce serait ici un intermédiaire sans contrepartie.
 *
 * Les fonctions restent `async` : le jour où le catalogue vient d'ailleurs,
 * les appelants n'ont pas à changer.
 */

export async function getProduct(
  handle: string
): Promise<ShopifyProduct | null> {
  return getLocalProduct(handle);
}

export async function getProducts(
  first: number = 20
): Promise<Connection<ShopifyProduct>> {
  return getLocalProducts(first);
}
