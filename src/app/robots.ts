import type { MetadataRoute } from "next";
import { SITE_LIVE, url } from "@/lib/seo/site";

/**
 * Instructions aux robots d'indexation.
 *
 * Deux régimes, selon que le site a remplacé l'ancien ou non :
 *
 * — Avant la bascule, tout est interdit. Une préproduction indexée entre
 *   en concurrence avec hh-spirits.com sur les mêmes textes, et c'est
 *   Google qui choisit laquelle garder — parfois la mauvaise.
 * — Après, tout est ouvert sauf le tunnel d'achat : panier, commande et
 *   confirmation n'ont aucun intérêt en résultat de recherche, et la page
 *   de confirmation contient des données de commande.
 *
 * `robots.txt` n'empêche pas l'indexation à lui seul (une page bloquée ici
 * mais liée ailleurs peut tout de même apparaître) : c'est pourquoi le
 * `noindex` du layout, lui, est une vraie barrière.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_LIVE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/commande", "/commande/", "/api/"],
      },
    ],
    sitemap: url("/sitemap.xml"),
    host: url("/"),
  };
}
