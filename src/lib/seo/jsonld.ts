import {
  ADRESSE,
  COURRIEL,
  MAISON,
  SITE_URL,
  TELEPHONES,
  url,
} from "@/lib/seo/site";
import type { ShopifyProduct } from "@/lib/catalog/types";

/**
 * Données structurées (JSON-LD).
 *
 * Ce sont elles qui permettent à Google d'afficher le prix, la
 * disponibilité et le fil d'Ariane directement dans les résultats, au lieu
 * d'un simple lien bleu. Rien ici n'améliore le classement en soi : ça
 * améliore le *taux de clic*, ce qui finit par compter.
 *
 * Règle d'or : ne jamais déclarer ce qui n'est pas visible sur la page.
 * Un avis client inventé ou une note moyenne sans avis réels est une
 * violation des règles de Google, sanctionnée par le retrait des rich
 * results — c'est pourquoi on ne déclare aucun `aggregateRating` ici.
 */

/** L'organisation — déclarée une fois, sur la page d'accueil. */
export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organisation`,
    name: MAISON,
    url: SITE_URL,
    email: COURRIEL,
    telephone: TELEPHONES[0],
    logo: url("/images/logo-noir.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: ADRESSE.rue,
      postalCode: ADRESSE.codePostal,
      addressLocality: ADRESSE.ville,
      addressRegion: ADRESSE.canton,
      addressCountry: ADRESSE.pays,
    },
  };
}

/**
 * Le site lui-même. `WebSite` permet à Google d'associer le nom de la
 * marque au domaine dans les résultats.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#site`,
    name: `${MAISON} — Elisira`,
    url: SITE_URL,
    inLanguage: "fr-CH",
    publisher: { "@id": `${SITE_URL}/#organisation` },
  };
}

/**
 * Une fiche produit.
 *
 * `priceValidUntil` est exigé par Google pour les offres : sans date, la
 * rich result est parfois ignorée. On la fixe à un an glissant, ce qui
 * correspond à des prix stables sans promettre l'éternité.
 */
export function produitJsonLd(produit: ShopifyProduct) {
  const prix = produit.priceRange.minVariantPrice;
  const variante = produit.variants.edges[0]?.node;

  const dans12Mois = new Date();
  dans12Mois.setFullYear(dans12Mois.getFullYear() + 1);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url(`/products/${produit.handle}#produit`),
    name: produit.title,
    description: produit.description,
    image: produit.featuredImage?.url
      ? [url(produit.featuredImage.url)]
      : undefined,
    sku: variante?.sku ?? undefined,
    category: produit.productType,
    brand: { "@type": "Brand", name: produit.vendor || MAISON },
    offers: {
      "@type": "Offer",
      url: url(`/products/${produit.handle}`),
      price: Number.parseFloat(prix.amount).toFixed(2),
      priceCurrency: prix.currencyCode,
      priceValidUntil: dans12Mois.toISOString().slice(0, 10),
      availability: produit.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organisation` },
      /* Livraison : déclarée telle qu'elle l'est sur la page Livraison —
         Suisse uniquement, offerte dès 120 CHF. */
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CH",
        },
      },
    },
  };
}

/** Fil d'Ariane : affiché par Google à la place de l'URL brute. */
export function filAriane(etapes: Array<{ nom: string; chemin: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: etapes.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.nom,
      item: url(e.chemin),
    })),
  };
}

/** Questions fréquentes — éligible aux résultats enrichis. */
export function faqJsonLd(qr: Array<{ question: string; reponse: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qr.map((x) => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: { "@type": "Answer", text: x.reponse },
    })),
  };
}

/**
 * Sérialise un bloc JSON-LD pour insertion dans le HTML.
 *
 * `JSON.stringify` n'échappe pas `<`, ce qui permettrait à une donnée
 * contenant `</script>` de refermer la balise et d'injecter du code. On
 * neutralise donc les chevrons et les séparateurs de ligne Unicode.
 */
export function serialiser(donnees: object) {
  return JSON.stringify(donnees)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
