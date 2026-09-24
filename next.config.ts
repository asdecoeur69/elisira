import type { NextConfig } from "next";

/**
 * En-têtes de sécurité.
 *
 * Appliqués à toutes les réponses. Ils ne remplacent pas le travail fait
 * côté serveur (validation des paniers, signature du webhook) : ils
 * ferment les portes que le navigateur laisse ouvertes par défaut.
 */
const enTetesSecurite = [
  /* Interdit l'encadrement du site dans une iframe. Sans lui, un site
     tiers peut afficher la page de commande dans un cadre invisible et
     capter les clics du visiteur (clickjacking). */
  { key: "X-Frame-Options", value: "DENY" },

  /* Empêche le navigateur de « deviner » qu'un fichier est autre chose
     que ce que le serveur annonce — un .txt interprété comme du script,
     par exemple. */
  { key: "X-Content-Type-Options", value: "nosniff" },

  /* Ne transmet l'adresse complète qu'aux pages du site ; un site externe
     ne reçoit que le domaine. Évite qu'un identifiant de commande présent
     dans l'URL parte chez un tiers. */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  /* Le site n'a besoin ni de la caméra, ni du micro, ni de la position :
     on les refuse explicitement. */
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },

  /* Impose HTTPS pendant deux ans, sous-domaines compris. À n'activer
     qu'une fois le domaine définitivement servi en HTTPS : un site qui
     repasserait en HTTP deviendrait inaccessible le temps du cache. */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  /* Politique de contenu.
     `unsafe-inline` reste nécessaire pour les styles : le rendu de Next
     et les attributs `style=` du site en dépendent. Pour les scripts,
     `unsafe-inline` couvre les données JSON-LD et le bootstrap de Next ;
     les chevrons y sont déjà échappés côté serveur (voir
     `src/lib/seo/jsonld.ts`).
     `frame-ancestors 'none'` double X-Frame-Options, que les navigateurs
     récents n'honorent plus toujours. */
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      /* Stripe Checkout est une page hébergée chez eux : on autorise la
         redirection, pas l'inclusion. */
      "form-action 'self' https://checkout.stripe.com",
      "connect-src 'self' https://api.stripe.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  /* Ne pas annoncer la technologie employée : c'est une information
     gratuite offerte à qui cherche une version vulnérable. */
  poweredByHeader: false,

  images: {
    /* Le catalogue est local et ne sert aucun SVG distant : autoriser les
       SVG rouvrirait une voie d'injection sans rien apporter. */
    remotePatterns: [],
    /* AVIF d'abord : 20 à 30 % plus léger que WebP à qualité égale sur
       ces photos, donc des images qui arrivent plus tôt pendant le
       scroll. Le premier encodage est plus lent côté serveur, mais il
       est mis en cache ; les navigateurs sans AVIF reçoivent du WebP. */
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:chemin*", headers: enTetesSecurite }];
  },
};

export default nextConfig;
