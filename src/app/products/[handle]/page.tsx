import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/catalog";
import { ProductDetail } from "@/components/organisms/ProductDetail";
import { produitJsonLd, filAriane, serialiser } from "@/lib/seo/jsonld";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  // Shopify peut être injoignable au build (boutique non branchée) :
  // on rend alors les pages à la demande plutôt que de casser le build.
  try {
    const connection = await getProducts(250);
    return connection.edges.map((e) => ({ handle: e.node.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Produit introuvable" };

  const chemin = `/products/${product.handle}`;
  const description = product.seo.description ?? product.description;

  return {
    /* Le modèle du layout ajoute déjà « | H&H Spirits » : on ne répète
       pas la marque ici, sinon le titre est tronqué dans les résultats. */
    title: product.seo.title ?? product.title,
    description,

    /* Canonique explicite : sans elle, une visite avec un paramètre de
       campagne (?utm_source=…) crée une seconde URL au même contenu, et
       Google dilue le classement entre les deux. */
    alternates: { canonical: chemin },

    openGraph: {
      type: "website",
      url: chemin,
      title: product.title,
      description,
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: 1200,
              height: 1200,
              alt: product.featuredImage.altText ?? product.title,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return (
    <>
      {/* Prix, disponibilité et fil d'Ariane affichés directement dans les
          résultats Google plutôt qu'un simple lien. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiser([
            produitJsonLd(product),
            filAriane([
              { nom: "Accueil", chemin: "/" },
              { nom: "Commander", chemin: "/commander" },
              { nom: product.title, chemin: `/products/${product.handle}` },
            ]),
          ]),
        }}
      />
      <ProductDetail product={product} />
    </>
  );
}
