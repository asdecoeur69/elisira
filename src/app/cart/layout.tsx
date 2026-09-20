import type { Metadata } from "next";

/**
 * Le panier n'a aucun intérêt en résultat de recherche : il est vide pour
 * qui arrive de Google. On l'exclut de l'index, tout en laissant les
 * robots suivre les liens vers les fiches produit.
 */
export const metadata: Metadata = {
  title: "Votre panier",
  robots: { index: false, follow: true },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
