import type { Metadata } from "next";
import { LegalPage, type Bloc } from "@/components/molecules/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Éditeur, hébergement, propriété intellectuelle et responsabilité du site hh-spirits.com.",
  alternates: { canonical: "/mentions-legales" },
};

const BLOCS: Bloc[] = [
  {
    titre: "Éditeur du site",
    reperes: [
      ["Raison sociale", "H&H Spirits SNC"],
      ["Numéro IDE", "CHE-325.125.530"],
      ["Siège social", "Cours des Bastions 13, 1205 Genève"],
      ["Lieu de production", "Chem. des Chaumets 35, 1239 Collex-Bossy"],
      ["Pays", "Suisse"],
      ["Courriel", "info@hh-spirits.com"],
      ["Téléphone", "+41 78 330 46 83"],
    ],
  },
  {
    titre: "Taxe sur la valeur ajoutée",
    paragraphes: [
      "H&H Spirits SNC n'est pas assujettie à la TVA : les prix affichés sur ce site ne comportent aucune taxe sur la valeur ajoutée, et aucune n'est facturée.",
    ],
  },
  {
    titre: "Responsables de la publication",
    paragraphes: [
      "Matisse Huchon et Nathan Hubschi, fondateurs de H&H Spirits.",
    ],
  },
  {
    titre: "Hébergement",
    paragraphes: [
      "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.",
    ],
  },
  {
    titre: "Propriété intellectuelle",
    paragraphes: [
      "L'ensemble du contenu de ce site — textes, photographies, identité visuelle, nom Elisira et Nero Imperiale — est la propriété de H&H Spirits, sauf mention contraire.",
      "Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable, est interdite. Pour une demande de presse ou l'utilisation de nos visuels, écrivez-nous.",
    ],
  },
  {
    titre: "Responsabilité",
    paragraphes: [
      "Nous mettons à jour ce site avec soin, mais ne garantissons pas que les informations qu'il contient soient à tout moment exactes, complètes ou à jour. Les photographies des produits ne sont pas contractuelles.",
      "H&H Spirits ne saurait être tenue responsable de l'usage fait des informations publiées, ni du contenu des sites tiers vers lesquels ce site renvoie.",
    ],
  },
  {
    titre: "Consommation d'alcool",
    paragraphes: [
      "Elisira est une boisson alcoolisée titrant 28 % vol. L'abus d'alcool est dangereux pour la santé ; à consommer avec modération. La vente d'alcool est interdite aux mineurs en vertu du droit suisse.",
    ],
  },
  {
    titre: "Droit applicable",
    paragraphes: [
      "Le présent site et son utilisation sont régis par le droit suisse. Tout litige relève des tribunaux compétents du canton de Genève.",
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      eyebrow="Informations"
      titre="Mentions"
      accent="légales."
      blocs={BLOCS}
      maj="septembre 2026"
    />
  );
}
