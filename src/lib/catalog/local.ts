import type {
  Connection,
  ShopifyProduct,
  ShopifyProductVariant,
} from "@/lib/catalog/types";

/**
 * Catalogue local — les produits Elisira, écrits à la main.
 *
 * Tant que Shopify n'est pas branché, c'est cette source qui alimente
 * le site : les fiches produit s'affichent, on peut travailler le design
 * et montrer le résultat au client sans aucune clé d'API.
 *
 * Dès que `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` et le token sont renseignés
 * dans .env.local, les requêtes repassent automatiquement sur Shopify et
 * ce fichier n'est plus utilisé (voir src/lib/catalog/index.ts).
 *
 * Les prix sont ceux communiqués par H&H Spirits : 30.— la 50 cl,
 * 35.— la 70 cl, 10.— la bougie.
 */

const CURRENCY = "CHF";

function money(amount: string) {
  return { amount, currencyCode: CURRENCY };
}

function connection<T>(nodes: T[]): Connection<T> {
  return {
    edges: nodes.map((node, i) => ({ node, cursor: `cursor-${i}` })),
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "cursor-0",
      endCursor: `cursor-${Math.max(nodes.length - 1, 0)}`,
    },
  };
}

function variant(
  id: string,
  title: string,
  price: string,
  options: Array<{ name: string; value: string }>,
  sku: string
): ShopifyProductVariant {
  return {
    id,
    title,
    availableForSale: true,
    quantityAvailable: null,
    selectedOptions: options,
    price: money(price),
    compareAtPrice: null,
    image: null,
    sku,
  };
}

const NOW = "2026-01-01T00:00:00Z";

const ELISIRA_50: ShopifyProduct = {
  id: "local/elisira-50cl",
  handle: "elisira-50cl",
  title: "Elisira — 50 cl",
  description:
    "Liqueur de mandarines biologiques siciliennes, élaborée à Genève. " +
    "Recette de famille, 28 % vol. Eau, sucre, alcool, zestes de mandarine — " +
    "sans arôme artificiel, sans conservateur, sans additif.",
  descriptionHtml:
    "<p>Liqueur de mandarines biologiques siciliennes, élaborée à Genève.</p>" +
    "<p>Une recette de famille redécouverte en 2023, préservée entièrement " +
    "naturelle : eau, sucre, alcool et zestes de mandarine. Rien d'autre.</p>" +
    "<p>Fraîche et tonique en digestif, délicate en cocktail, pleine de " +
    "caractère sur un dessert.</p>",
  availableForSale: true,
  productType: "Liqueur",
  vendor: "H&H Spirits",
  tags: ["liqueur", "mandarine", "sicile", "artisanal"],
  options: [
    {
      id: "local/elisira-50cl/option-title",
      name: "Title",
      values: ["Default Title"],
    },
  ],
  priceRange: {
    minVariantPrice: money("30.00"),
    maxVariantPrice: money("30.00"),
  },
  compareAtPriceRange: {
    minVariantPrice: money("30.00"),
    maxVariantPrice: money("30.00"),
  },
  variants: connection<ShopifyProductVariant>([
    variant(
      "local/elisira/50cl",
      "Default Title",
      "30.00",
      [{ name: "Title", value: "Default Title" }],
      "ELISIRA-50"
    ),
  ]),
  images: connection([
    { url: "/images/produits/elisira-50-1.jpg", altText: "Elisira 50 cl, sur un mur de plâtre", width: 928, height: 1152 },
    { url: "/images/produits/elisira-50-2.jpg", altText: "Elisira 50 cl entourée de mandarines siciliennes", width: 928, height: 1152 },
    { url: "/images/produits/elisira-50-3.jpg", altText: "Elisira 50 cl, détail de l'étiquette", width: 928, height: 1152 },
    { url: "/images/produits/elisira-50-4.jpg", altText: "Elisira 50 cl en situation", width: 928, height: 1152 },
    { url: "/images/produits/elisira-50-5.jpg", altText: "Elisira 50 cl, vue rapprochée", width: 1024, height: 1024 },
  ]),
  featuredImage: {
    url: "/images/produits/elisira-50-1.jpg",
    altText: "Elisira 50 cl, liqueur de mandarines siciliennes",
    width: 928,
    height: 1152,
  },
  seo: {
    title: "Elisira 50 cl — Liqueur de mandarines siciliennes",
    description:
      "La bouteille d'origine. Recette de famille aux mandarines biologiques de Sicile, élaborée à Genève. 28 % vol.",
  },
  createdAt: NOW,
  updatedAt: NOW,
};

const ELISIRA_70: ShopifyProduct = {
  id: "local/elisira-70cl",
  handle: "elisira-70cl",
  title: "Elisira Nero Imperiale — 70 cl",
  description:
    "La recette originale dans son édition noire, en 70 cl. 28 % vol. " +
    "Mêmes mandarines biologiques siciliennes, même savoir-faire — " +
    "un habillage d'exception et un grand format.",
  descriptionHtml:
    "<p>La recette originale dans son édition noire.</p>" +
    "<p>Rigoureusement la même liqueur que la 50 cl : eau, sucre, alcool " +
    "et zestes de mandarine biologique de Sicile. Seuls le format et " +
    "l'habillage changent.</p>" +
    "<p>Le grand format de la maison, pensé pour les tables qui reçoivent " +
    "et pour être offert.</p>",
  availableForSale: true,
  productType: "Liqueur",
  vendor: "H&H Spirits",
  tags: ["liqueur", "mandarine", "sicile", "artisanal", "edition"],
  options: [
    {
      id: "local/elisira-70cl/option-title",
      name: "Title",
      values: ["Default Title"],
    },
  ],
  priceRange: {
    minVariantPrice: money("35.00"),
    maxVariantPrice: money("35.00"),
  },
  compareAtPriceRange: {
    minVariantPrice: money("35.00"),
    maxVariantPrice: money("35.00"),
  },
  variants: connection<ShopifyProductVariant>([
    variant(
      "local/elisira/70cl",
      "Default Title",
      "35.00",
      [{ name: "Title", value: "Default Title" }],
      "ELISIRA-70"
    ),
  ]),
  images: connection([
    { url: "/images/produits/elisira-70-1.jpg", altText: "Elisira Nero Imperiale 70 cl", width: 928, height: 1152 },
    { url: "/images/produits/elisira-70-2.jpg", altText: "Nero Imperiale couchée près de mandarines coupées", width: 928, height: 1152 },
    { url: "/images/produits/elisira-70-3.jpg", altText: "Nero Imperiale, détail de l'étiquette", width: 928, height: 1152 },
    { url: "/images/produits/elisira-70-4.jpg", altText: "Nero Imperiale en situation", width: 928, height: 1152 },
    { url: "/images/produits/elisira-70-5.jpg", altText: "Nero Imperiale, vue rapprochée", width: 1024, height: 1024 },
  ]),
  featuredImage: {
    url: "/images/produits/elisira-70-1.jpg",
    altText: "Elisira Nero Imperiale, 70 cl",
    width: 928,
    height: 1152,
  },
  seo: {
    title: "Elisira Nero Imperiale 70 cl — Liqueur de mandarines siciliennes",
    description:
      "La recette originale dans son édition noire, en 70 cl. 28 % vol.",
  },
  createdAt: NOW,
  updatedAt: NOW,
};

const BOUGIE: ShopifyProduct = {
  id: "local/bougie-mandarine",
  handle: "bougie-mandarine",
  title: "Bougie mandarine",
  description:
    "Le parfum d'Elisira sur votre table. Bougie parfumée à la mandarine, " +
    "habillée de l'étiquette de la maison.",
  descriptionHtml:
    "<p>Le parfum d'Elisira sur votre table.</p>" +
    "<p>Une bougie à la mandarine, habillée de l'étiquette de la maison — " +
    "à offrir, ou à garder pour prolonger le moment.</p>",
  availableForSale: true,
  productType: "Bougie",
  vendor: "H&H Spirits",
  tags: ["bougie", "mandarine", "cadeau"],
  options: [
    {
      id: "local/bougie/option-title",
      name: "Title",
      values: ["Default Title"],
    },
  ],
  priceRange: {
    minVariantPrice: money("10.00"),
    maxVariantPrice: money("10.00"),
  },
  compareAtPriceRange: {
    minVariantPrice: money("10.00"),
    maxVariantPrice: money("10.00"),
  },
  variants: connection<ShopifyProductVariant>([
    variant(
      "local/bougie/default",
      "Default Title",
      "10.00",
      [{ name: "Title", value: "Default Title" }],
      "BOUGIE-MANDARINE"
    ),
  ]),
  images: connection([
    { url: "/images/produits/bougie-1.jpg", altText: "Bougie Elisira à la mandarine", width: 896, height: 1188 },
    { url: "/images/produits/bougie-2.jpg", altText: "Bougie Elisira allumée", width: 928, height: 1152 },
    { url: "/images/produits/bougie-3.jpg", altText: "Bougie Elisira, détail de l'étiquette", width: 896, height: 1188 },
    { url: "/images/produits/bougie-4.jpg", altText: "Bougie Elisira en situation", width: 928, height: 1152 },
  ]),
  featuredImage: {
    url: "/images/produits/bougie-1.jpg",
    altText: "Bougie parfumée à la mandarine, étiquette Elisira",
    width: 896,
    height: 1188,
  },
  seo: {
    title: "Bougie parfumée à la mandarine sicilienne",
    description:
      "Bougie parfumée à la mandarine, habillée de l'étiquette Elisira.",
  },
  createdAt: NOW,
  updatedAt: NOW,
};

export const LOCAL_PRODUCTS: ShopifyProduct[] = [
  ELISIRA_50,
  ELISIRA_70,
  BOUGIE,
];

export function getLocalProduct(handle: string): ShopifyProduct | null {
  return LOCAL_PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export function getLocalProducts(first = 20): Connection<ShopifyProduct> {
  return connection(LOCAL_PRODUCTS.slice(0, first));
}
