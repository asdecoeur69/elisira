import type { MetadataRoute } from "next";
import { SITE_LIVE, url } from "@/lib/seo/site";
import { LOCAL_PRODUCTS } from "@/lib/catalog/local";

/**
 * Plan du site.
 *
 * Seules les pages utiles à un visiteur qui arrive par Google y figurent :
 * le panier, le tunnel de commande et la confirmation n'ont rien à y
 * faire — ce sont des étapes, pas des destinations, et les proposer en
 * résultat de recherche ne ferait qu'égarer.
 *
 * `priority` n'est qu'une indication d'importance *relative* au sein du
 * site ; Google s'en sert peu. `lastModified` compte davantage : il
 * signale ce qui mérite d'être revisité.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /* Tant que le site n'a pas remplacé l'ancien, on ne publie pas de plan :
     inviter Google à explorer une préproduction reviendrait à dupliquer
     le site officiel. */
  if (!SITE_LIVE) return [];

  const maj = new Date();

  const pages: Array<{
    chemin: string;
    priorite: number;
    frequence: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { chemin: "/", priorite: 1, frequence: "weekly" },
    { chemin: "/elisira", priorite: 0.9, frequence: "monthly" },
    { chemin: "/commander", priorite: 0.9, frequence: "weekly" },
    { chemin: "/about", priorite: 0.7, frequence: "yearly" },
    { chemin: "/points-de-vente", priorite: 0.7, frequence: "monthly" },
    { chemin: "/professionnels", priorite: 0.6, frequence: "yearly" },
    { chemin: "/contact", priorite: 0.6, frequence: "yearly" },
    { chemin: "/livraison", priorite: 0.5, frequence: "yearly" },
    { chemin: "/cgv", priorite: 0.3, frequence: "yearly" },
    { chemin: "/mentions-legales", priorite: 0.2, frequence: "yearly" },
    { chemin: "/confidentialite", priorite: 0.2, frequence: "yearly" },
  ];

  const produits = LOCAL_PRODUCTS.map((p) => ({
    url: url(`/products/${p.handle}`),
    lastModified: maj,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...pages.map((p) => ({
      url: url(p.chemin),
      lastModified: maj,
      changeFrequency: p.frequence,
      priority: p.priorite,
    })),
    ...produits,
  ];
}
