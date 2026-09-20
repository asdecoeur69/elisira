import type { Metadata } from "next";
import { LegalPage, type Bloc } from "@/components/molecules/LegalPage";

export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Quelles données nous collectons, pourquoi, combien de temps nous les gardons, et comment exercer vos droits.",
  alternates: { canonical: "/confidentialite" },
};

const BLOCS: Bloc[] = [
  {
    titre: "Notre principe",
    paragraphes: [
      "Nous collectons le minimum : ce qu'il faut pour préparer votre commande et vous répondre. Nous ne vendons ni ne louons vos données à qui que ce soit.",
    ],
  },
  {
    titre: "Données collectées",
    reperes: [
      ["Commande", "Nom, adresse, courriel, téléphone"],
      ["Paiement", "Traité par notre prestataire — nous ne voyons aucune donnée bancaire"],
      ["Contact", "Les informations que vous nous écrivez"],
      ["Panier", "Conservé dans votre navigateur, pas sur nos serveurs"],
    ],
  },
  {
    titre: "Pourquoi",
    liste: [
      "Traiter, préparer et expédier vos commandes.",
      "Vous répondre lorsque vous nous écrivez.",
      "Respecter nos obligations légales et comptables.",
    ],
  },
  {
    titre: "Ce que nous ne faisons pas",
    liste: [
      "Nous ne vendons pas vos données.",
      "Nous ne vous inscrivons à aucune liste de diffusion sans votre accord.",
      "Nous n'utilisons pas de traceurs publicitaires.",
    ],
  },
  {
    titre: "Destinataires",
    paragraphes: [
      "Vos données ne sont transmises qu'aux prestataires nécessaires à l'exécution de la commande, et chacun n'accède qu'à ce qui lui est indispensable :",
    ],
    liste: [
      "Stripe, pour le paiement — c'est lui, et non nous, qui traite vos données bancaires.",
      "Resend, pour l'envoi du courriel de confirmation.",
      "Vercel, pour l'hébergement du site.",
      "La Poste Suisse, pour l'acheminement de votre colis.",
    ],
  },
  {
    titre: "Transferts hors de Suisse",
    paragraphes: [
      "Stripe, Resend et Vercel sont des sociétés américaines : vos données peuvent être traitées hors de Suisse. Ces transferts reposent sur les garanties contractuelles prévues par ces prestataires, conformément à la loi fédérale sur la protection des données.",
      "La Poste Suisse, elle, traite vos données de livraison en Suisse.",
    ],
  },
  {
    titre: "Durée de conservation",
    paragraphes: [
      "Les données de commande sont conservées dix ans, conformément aux obligations comptables suisses. Les courriels que vous nous adressez sont conservés deux ans, puis supprimés.",
    ],
  },
  {
    titre: "Vos droits",
    paragraphes: [
      "Conformément à la loi fédérale sur la protection des données (LPD), vous pouvez demander l'accès, la rectification ou la suppression de vos données, ainsi que vous opposer à leur traitement.",
      "Une demande à info@hh-spirits.com suffit. Nous répondons sous 30 jours.",
    ],
  },
  {
    titre: "Sécurité",
    paragraphes: [
      "Le site est servi en HTTPS et les données de paiement sont traitées directement par notre prestataire, sans transiter par nos serveurs. Aucun système n'étant infaillible, nous vous informerions sans délai en cas d'incident touchant vos données.",
    ],
  },
  {
    titre: "Nous contacter",
    paragraphes: [
      "Pour toute question relative à vos données : info@hh-spirits.com, ou H&H Spirits SNC, Cours des Bastions 13, 1205 Genève, Suisse.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="Informations"
      titre="Protection des"
      accent="données."
      lead="Ce que nous collectons, pourquoi, et comment reprendre la main dessus."
      blocs={BLOCS}
      maj="septembre 2026"
    />
  );
}
