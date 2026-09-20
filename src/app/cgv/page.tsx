import type { Metadata } from "next";
import { LegalPage, type Bloc } from "@/components/molecules/LegalPage";

export const metadata: Metadata = {
  title: "Conditions générales",
  description:
    "Conditions générales de vente : commandes, prix, paiement, livraison, droit de retour et garanties.",
  alternates: { canonical: "/cgv" },
};

const BLOCS: Bloc[] = [
  {
    titre: "1. Champ d'application",
    paragraphes: [
      "Les présentes conditions régissent les ventes conclues sur hh-spirits.com entre H&H Spirits SNC (CHE-325.125.530), dont le siège est Cours des Bastions 13, 1205 Genève, et ses clients. Toute commande vaut acceptation de ces conditions.",
    ],
  },
  {
    titre: "2. Âge légal",
    paragraphes: [
      "La vente d'alcool est interdite aux mineurs. En passant commande, le client certifie avoir 18 ans révolus. Une pièce d'identité peut être exigée à la livraison ou au retrait ; à défaut, la commande peut être annulée.",
    ],
  },
  {
    titre: "3. Produits",
    paragraphes: [
      "Elisira est une liqueur de mandarines biologiques siciliennes titrant 28 % vol., élaborée à Collex-Bossy. Les photographies sont illustratives : la teinte d'une production artisanale peut varier légèrement d'un lot à l'autre, sans altérer le produit.",
    ],
  },
  {
    titre: "4. Prix",
    paragraphes: [
      "Les prix sont indiqués en francs suisses (CHF), hors frais de livraison. H&H Spirits SNC n'étant pas assujettie à la TVA, aucune taxe sur la valeur ajoutée n'est perçue ni facturée. Les frais de livraison sont affichés avant la validation définitive de la commande.",
      "H&H Spirits se réserve le droit de modifier ses prix à tout moment ; le prix applicable est celui affiché au moment de la commande.",
    ],
  },
  {
    titre: "5. Commande",
    paragraphes: [
      "La commande est ferme dès sa validation et le paiement accepté. Un courriel de confirmation récapitule le détail de la commande. H&H Spirits peut refuser une commande en cas de motif légitime, notamment un doute sur l'âge du client ou une rupture de stock.",
    ],
  },
  {
    titre: "6. Paiement",
    paragraphes: [
      "Le paiement s'effectue au moment de la commande, par les moyens proposés lors du passage en caisse. Les produits restent la propriété de H&H Spirits jusqu'au paiement intégral.",
    ],
  },
  {
    titre: "7. Livraison",
    paragraphes: [
      "Les livraisons sont assurées en Suisse sous 2 à 4 jours ouvrables. Les délais sont indicatifs ; un retard ne donne pas droit à annulation ni à indemnité, sauf dépassement manifestement excessif.",
      "Le retrait sur place à Collex-Bossy est gratuit et se fait sur rendez-vous.",
    ],
  },
  {
    titre: "8. Droit de retour",
    paragraphes: [
      "Le client dispose de 14 jours après réception pour retourner un produit non ouvert et intact, et en obtenir le remboursement. Les bouteilles ouvertes ne sont pas reprises, sauf défaut manifeste.",
      "Les frais de retour sont à la charge de H&H Spirits lorsque l'erreur ou le défaut lui est imputable.",
    ],
  },
  {
    titre: "9. Garantie et réclamations",
    paragraphes: [
      "Tout défaut ou dommage doit être signalé dans les 7 jours suivant la réception, à info@hh-spirits.com, si possible avec des photographies. Nous remplaçons ou remboursons le produit concerné.",
    ],
  },
  {
    titre: "10. Responsabilité",
    paragraphes: [
      "La responsabilité de H&H Spirits est limitée au montant de la commande concernée. Elle ne saurait être engagée pour un usage inapproprié du produit ni pour une consommation excessive d'alcool.",
    ],
  },
  {
    titre: "11. Droit applicable et for",
    paragraphes: [
      "Les présentes conditions sont soumises au droit suisse. Le for juridique exclusif est à Genève, sous réserve des dispositions impératives en faveur des consommateurs.",
    ],
  },
];

export default function CgvPage() {
  return (
    <LegalPage
      eyebrow="Informations"
      titre="Conditions"
      accent="générales."
      lead="Les règles qui encadrent nos ventes, écrites aussi simplement que possible."
      blocs={BLOCS}
      maj="septembre 2026"
    />
  );
}
