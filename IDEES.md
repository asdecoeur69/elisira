# Idées — H&H Spirits / Elisira

Carnet des idées évoquées au fil des discussions, pour ne rien perdre et
pouvoir y revenir. Tenu à jour par Claude (voir la règle dans `AGENTS.md`).

**Priorités** — `P1` maintenant · `P2` bientôt · `P3` plus tard · `P4` à creuser
**États** — `à faire` · `en cours` · `fait` · `abandonné`

---

## P1 — Fiche Google Business Profile

*Évoquée le 2026-09-18. État : à faire.*

Créer une fiche Google pour que l'entreprise apparaisse dans le « pack
local » (la carte avec trois résultats affichée **au-dessus** des liens
classiques) et pour recueillir des avis clients vérifiables.

**Pour**
- C'est le levier le plus rapide : sur « liqueur artisanale Genève », le
  pack local passe devant tout le reste. Sans fiche, invisible à cet
  endroit quel que soit le travail fait sur le site.
- Crédibilité qu'un site ne peut pas donner : un témoignage sur son propre
  site, c'est l'entreprise qui parle d'elle-même ; un avis Google est
  vérifiable et hors de son contrôle.
- Le canal de vente (cavistes, restaurateurs, particuliers en direct) passe
  par des gens qui cherchent sur Google avant de commander.
- Deux portes d'entrée dans la page de résultats au lieu d'une.

**Contre / risques**
- **Rythme des avis** : 60 avis en moins d'un mois sur une fiche neuve
  déclenche les filtres anti-spam. Sanction la plus probable : les avis
  disparaissent silencieusement, semaines plus tard, sans notification.
  Viser 5 à 10 par mois, étalés.
- **Avis de proches** : même sincères et après achat réel, ils relèvent du
  conflit d'intérêt selon les règles de Google. Le profil « compte sans
  historique, premier avis à vie, très élogieux, cite les prénoms des
  fondateurs » est exactement ce que le filtre attrape. Deux avis de la
  même famille, même réseau, à quelques jours d'intervalle : signal fort.
- **Risque de signalement** par un concurrent qui voit l'accumulation.
- **Éligibilité** : Google demande une adresse recevant des clients ou une
  zone de chalandise. Collex-Bossy est un lieu de production, pas une
  boutique ouverte — l'option propre est *adresse masquée + zone de
  service (Genève et environs)*. Ne jamais inventer une adresse
  commerciale : motif de suspension n°1.
- **Doublon** : si Google a déjà créé une fiche automatiquement, il faut la
  **revendiquer**, pas en créer une seconde.

**À faire**
1. Vérifier en navigation privée s'il existe déjà une fiche
   (« H&H Spirits », « Elisira Collex-Bossy ») et si elle affiche
   « Vous êtes propriétaire de cet établissement ? ».
2. Confirmer qu'ils peuvent recevoir du courrier au Chem. des Chaumets 35
   (vérification par carte postale).
3. Créer/revendiquer la fiche **avant** la mise en ligne du site : la
   vérification prend 1 à 2 semaines et l'ancienneté compte.
4. Cohérence stricte nom / adresse / téléphone avec `src/lib/seo/site.ts`.
5. Demander les avis au fil de l'eau, après chaque vente ou mariage.
   Aucune contrepartie (réduction, bouteille offerte) : interdit et premier
   motif de signalement.
6. Répondre aux avis — Google valorise les fiches actives.

**Notes**
- Sur « liqueur mandarine Genève », c'est aujourd'hui un **restaurant
  revendeur** qui remonte, pas eux. La demande existe, quelqu'un la capte.
- Argument « El Tony Mate n'a pas de fiche » : non transposable. El Tony
  vend en grande distribution, où l'acheteur regarde volumes et marges, pas
  une fiche Google. H&H vend à des cavistes et des particuliers qui, eux,
  googlent avant de commander. Canal différent, besoin différent.
- Cadre légal suisse : pas de publicité visant les mineurs, pas
  d'association de l'alcool à la performance ou au succès social.

---

## P2 — Backlinks depuis les revendeurs

*Évoquée le 2026-09-18. État : à faire.*

Obtenir des liens depuis les sites des cavistes, bars et restaurants qui
distribuent déjà Elisira.

**Pour**
- Les backlinks sont le facteur de classement que le code ne peut pas
  produire. Le SEO technique est fait ; c'est désormais le principal levier.
- Ces partenaires existent déjà et les référencent : le lien est une simple
  demande, pas une négociation.
- Aucun risque, contrairement aux avis.

**À faire**
- Lister les revendeurs actuels.
- Demander une mention avec lien vers le site (page « nos producteurs »,
  carte des boissons en ligne…).
- Cibler aussi : presse locale genevoise, blogs de spiritueux suisses,
  guides d'artisans, Slow Food.

---

## P2 — Google Search Console

*Évoquée le 2026-09-18. État : à faire.*

Indispensable pour soumettre le plan du site et voir les requêtes réelles
qui amènent des visiteurs.

**À faire**
- Créer le compte, récupérer la balise de vérification.
- L'ajouter dans la metadata du site (5 minutes).
- Soumettre `sitemap.xml` **après** la bascule (`NEXT_PUBLIC_SITE_LIVE=1`).

---

## P3 — Mots-clés à viser en priorité

*Évoquée le 2026-09-18. État : à creuser.*

Ne pas se battre sur « liqueur de mandarine » (marques à gros budget).
Viser d'abord les requêtes gagnables, moins volumineuses mais avec une
intention d'achat : « liqueur artisanale Genève », « digestif mandarine
suisse », « spiritueux artisanal Collex-Bossy », « liqueur Genève ».

---

## P3 — Corriger les deux erreurs ESLint

*Évoquée le 2026-09-20. État : reporté (décision du propriétaire).*

`react-hooks/set-state-in-effect` dans `AgeGate.tsx:30` et
`LocalCartProvider.tsx:86` : lecture de `localStorage` dans un effet suivie
d'un `setState`.

**Pour reporter** — ce n'est pas un bug, le site fonctionne (vérifié en
navigateur). Le motif est difficilement évitable : `localStorage` n'existe
pas côté serveur, lire après le montage est le comportement correct.

**Pourquoi y revenir** — `eslint` renvoie un code d'erreur non nul : le jour
où un déploiement automatique est branché (Vercel avec lint, GitHub
Action), l'étape lint échouera et le déploiement sera refusé.

**Deux options** — corriger via initialiseur paresseux ou
`useSyncExternalStore` (≈30 min + retest du parcours panier et age gate),
ou désactiver la règle avec un commentaire expliquant l'exception (5 min,
zéro risque).

---

## P4 — Cocktails en canette

*Évoquée le 2026-09-20. État : à creuser.*

Piste mentionnée en passant : décliner Elisira en cocktails prêts à boire.

**À creuser** — changerait le canal de distribution (grande distribution
plutôt que vente directe), donc aussi les leviers marketing : à ce
moment-là, l'argument « El Tony Mate » deviendrait pertinent. Rien de
décidé, noté pour mémoire.

---

## Archive — idées traitées

### Audit technique du site — *fait le 2026-09-18/20*
Trois bloquants corrigés (montants faux, numéro de commande figé, courriel
de confirmation jamais envoyé), deux incohérences client/serveur (plafond
de quantité, codes promo dupliqués), SEO technique complet, code mort
supprimé. Voir l'historique git, branche `corrections-commande-et-seo`.

### Nettoyage des images — *abandonné le 2026-09-20*
21 MB de photos non référencées identifiées. Le propriétaire a choisi de
toutes les conserver. Liste reconstituable en comparant les fichiers de
`public/images/` aux chemins référencés dans `src/`.
