import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/catalog";
import { ProductDetail } from "@/components/organisms/ProductDetail";

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
  if (!product) return { title: "Produit introuvable | Elisira" };
  return {
    title: product.seo.title ?? `${product.title} | Elisira`,
    description: product.seo.description ?? product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage
        ? [{ url: product.featuredImage.url, width: 1200, height: 1200 }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
