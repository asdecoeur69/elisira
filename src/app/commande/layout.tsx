import type { Metadata } from "next";

/**
 * Le tunnel de commande — et la page de confirmation qu'il contient — ne
 * doit pas être indexé : ce sont des étapes de paiement, pas des pages
 * d'entrée, et la confirmation affiche le détail d'une commande.
 */
export const metadata: Metadata = {
  title: "Votre commande",
  robots: { index: false, follow: false },
};

export default function CommandeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
