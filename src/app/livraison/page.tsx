import type { Metadata } from "next";
import { LegalPage, type Bloc } from "@/components/molecules/LegalPage";

export const metadata: Metadata = {
  title: "Livraison & retours — H&H Spirits",
  description:
    "Livraison en Suisse sous 2 à 4 jours ouvrables, retrait gratuit à Collex-Bossy sur rendez-vous. Frais, délais et conditions de retour.",
};

const BLOCS: Bloc[] = [
  {
    titre: "En bref",
    reperes: [
      ["Frais de livraison", "CHF 9.— en Suisse"],
      ["Offerte dès", "CHF 120.— d'achat"],
      ["Délai", "2 à 4 jours ouvrables"],
      ["Retrait à Collex-Bossy", "Gratuit, sur rendez-vous"],
    ],
  },
  {
    titre: "Livraison",
    paragraphes: [
      "Nous expédions dans toute la Suisse par la Poste Suisse. Les commandes passées avant 14 h sont préparées le jour même, du lundi au vendredi ; au-delà, elles partent le jour ouvrable suivant.",
      "Chaque bouteille est calée dans un emballage prévu pour le verre. Si un colis arrive endommagé, prenez-le en photo avant de le déballer complètement et écrivez-nous : nous le remplaçons.",
      "Nous ne livrons pas hors de Suisse pour le moment. Pour une commande à l'étranger ou un envoi en nombre, écrivez-nous directement.",
    ],
  },
  {
    titre: "Retrait à Collex-Bossy",
    paragraphes: [
      "Vous pouvez retirer votre commande sur place, sans frais. Choisissez cette option au moment de commander : nous convenons ensemble d'un créneau et vous préparons le tout.",
      "Chem. des Chaumets 35, 1239 Collex-Bossy. Le retrait se fait sur rendez-vous — nous ne sommes pas une boutique ouverte en continu.",
    ],
  },
  {
    titre: "Vente d'alcool",
    paragraphes: [
      "La vente d'alcool est interdite aux mineurs. En commandant, vous certifiez avoir 18 ans révolus. Une pièce d'identité peut être demandée à la remise du colis ou lors du retrait.",
    ],
  },
  {
    titre: "Retours et remboursements",
    paragraphes: [
      "Vous disposez de 14 jours après réception pour nous signaler un problème. Les bouteilles non ouvertes et intactes peuvent être retournées ; nous vous remboursons le produit dès réception.",
      "Une bouteille ouverte ne peut pas être reprise, sauf défaut manifeste — dans ce cas nous la remplaçons ou la remboursons, sans discussion.",
    ],
    liste: [
      "Écrivez-nous à info@hh-spirits.com en indiquant votre numéro de commande.",
      "Nous vous confirmons la marche à suivre sous 48 h.",
      "Les frais de retour sont à notre charge si l'erreur ou le défaut vient de nous.",
    ],
  },
  {
    titre: "Une question",
    paragraphes: [
      "Nous répondons nous-mêmes : info@hh-spirits.com, ou par téléphone aux numéros indiqués sur la page Contact.",
    ],
  },
];

export default function LivraisonPage() {
  return (
    <LegalPage
      eyebrow="Informations"
      titre="Livraison"
      accent="& retours."
      lead="Livraison en Suisse sous 2 à 4 jours ouvrables, ou retrait sur place à Collex-Bossy."
      blocs={BLOCS}
    />
  );
}
