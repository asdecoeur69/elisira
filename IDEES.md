# Idées — H&H Spirits / Elisira

Carnet des idées évoquées au fil des discussions, pour ne rien perdre et
pouvoir y revenir. Tenu à jour par Claude (voir la règle dans `AGENTS.md`).

**Priorités** — `P1` maintenant · `P2` bientôt · `P3` plus tard · `P4` à creuser
**États** — `à faire` · `en cours` · `fait` · `abandonné`

---

## P1 — Mise en ligne : ce qui bloque encore

*Audit du 2026-09-20. État : à faire.*

Le code est prêt ; ce qui manque est **de la configuration et du compte**,
pas du développement. Rien ici ne demande de réécrire le site.

**Bloquants absolus** (le site ne peut pas encaisser sans)
1. **Compte Stripe inadapté** — le compte lié est français, en euros, et
   non activé (`charges_enabled: false`, `details_submitted: false`). Le
   site vend en CHF avec TWINT : il faut un compte **suisse** activé, sans
   quoi aucun paiement réel n'est possible. C'est le point le plus long
   (vérification d'identité, coordonnées bancaires) → à lancer en premier.
2. **`STRIPE_WEBHOOK_SECRET` vide** — le webhook répond 503, donc aucune
   commande n'est enregistrée et **aucun courriel de confirmation ne
   part**, alors que les CGV (art. 5) le promettent.
3. **`RESEND_API_KEY` absente** — même conséquence sur le courriel ; il
   faut aussi un domaine vérifié chez Resend.
4. **TWINT à confirmer en mode live** — accepté en test, mais il n'apparaît
   pas dans les moyens de paiement activés du compte. À vérifier une fois
   le compte suisse en place, sinon Stripe refusera la session.
5. **`NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_LIVE`** absentes de
   `.env.local` — sans elles le site reste `noindex` et les liens de
   partage pointent vers localhost.

**Incohérence fonctionnelle à trancher**
- **Le retrait à Collex-Bossy est annoncé mais impossible.** La page
  Livraison dit « Choisissez cette option au moment de commander » et le
  récapitulatif affiche « Retrait : à Collex-Bossy, sur demande » — or le
  tunnel facture systématiquement 9 CHF de livraison, sans choix. Soit on
  ajoute l'option au checkout, soit on corrige les deux textes. En l'état,
  c'est une promesse non tenue au moment de payer.

**À corriger avant d'ouvrir** (rapide, côté code)
- **Page 404 en anglais** (« This page could not be found ») sur un site
  suisse francophone, sans en-tête ni pied de page : le visiteur est dans
  une impasse. Ajouter `src/app/not-found.tsx`.
- **Aucune page d'erreur** (`error.tsx`) : une erreur client donne un écran
  blanc.
- **Aucun en-tête de sécurité** (HSTS, X-Frame-Options, X-Content-Type,
  Referrer-Policy, Permissions-Policy) — à déclarer dans `next.config.ts`.
- **Identification légale absente** : ni numéro IDE (CHE-…), ni mention du
  régime TVA dans les mentions légales et les CGV. À vérifier avec eux
  selon leur statut et leur chiffre d'affaires.
- **Paiement indisponible annoncé trop tard** : si Stripe n'est pas
  configuré, le client remplit tout, clique, et découvre l'erreur. Mieux
  vaut désactiver le bouton en amont.

**Vérifié bon** — validation serveur des paniers (prix, quantités, codes
promo recalculés), signature du webhook, aucune clé secrète exposée côté
client, les 16 routes répondent 200, build de production propre.

---

## P2 — Fiche Google Business Profile

*Évoquée le 2026-09-18. Reportée le 2026-09-20 : à discuter avec Matisse et
Nathan avant de lancer. État : en attente.*

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

**Vérifié le 2026-09-20**
- Aucune fiche n'existe à ce jour → création, pas revendication. Pas de
  risque de doublon.
- Ils peuvent recevoir du courrier au Chem. des Chaumets 35 → la
  vérification par carte postale est possible.

**À faire**
1. En discuter avec Matisse et Nathan (décision en attente).
2. Créer la fiche **avant** la mise en ligne du site : la
   vérification prend 1 à 2 semaines et l'ancienneté compte.
3. Cohérence stricte nom / adresse / téléphone avec `src/lib/seo/site.ts`.
4. Demander les avis au fil de l'eau, après chaque vente ou mariage.
   Aucune contrepartie (réduction, bouteille offerte) : interdit et premier
   motif de signalement.
5. Répondre aux avis — Google valorise les fiches actives.

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
