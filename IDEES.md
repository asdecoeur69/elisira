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

**Corrigé le 2026-09-20** (commit `81d663a`)
- En-têtes de sécurité ajoutés : le site était **encadrable en iframe**
  (clickjacking sur la page de commande). X-Frame-Options, CSP, HSTS,
  nosniff, Referrer-Policy, Permissions-Policy. `X-Powered-By` retiré.
- `dangerouslyAllowSVG` et les domaines Shopify supprimés de la config :
  voie d'injection ouverte pour rien, le catalogue étant local.
- Page 404 française avec navigation, et page d'erreur (écran blanc
  auparavant).

**Audit fonctionnel et juridique du 2026-09-20**

*Vérifié bon* — 19 liens internes testés, aucun cassé ; coordonnées
identiques partout (info@hh-spirits.com, deux numéros, Chem. des Chaumets
35) ; prix catalogue = prix affichés (30/35/10) ; frais de port annoncés
= constantes du code (9 CHF, offerte dès 120) ; mention alcool dans le
pied de page donc sur toutes les pages ; CGV datées (septembre 2026) et
complètes (11 sections dont retour à 14 jours, garantie, for juridique) ;
mentions légales et politique de confidentialité structurées ; aucun
débordement horizontal sur mobile ; ancre `#fiche-produit` valide ;
mailtos B2B pré-remplis (établissement, adresse, contact).

*À traiter, par ordre d'impact commercial*
1. **Le panier ne dit pas que la livraison est offerte dès 120 CHF.** Il
   affiche « Les frais de livraison seront calculés à l'étape suivante ».
   C'est l'argument de vente le plus rentable du site, absent du seul
   endroit où il déclencherait un achat supplémentaire (panier à 90 CHF →
   « plus que 30 CHF pour la livraison offerte »).
2. **Aucun point de vente n'est nommé.** La page dit « chez nos
   partenaires à Genève » sans un seul nom : le visiteur qui cherche où
   acheter repart bredouille. Ces noms seraient aussi des backlinks (voir
   l'entrée dédiée) et de la preuve sociale gratuite.
3. **Aucun lien vers les réseaux sociaux**, alors qu'ils sont gérés
   activement. Manque dans le pied de page.
4. **Second numéro non cliquable** : seul le premier est en `tel:` hors de
   la page Contact.

**Reste à traiter**
- **Identification légale absente** : ni numéro IDE (CHE-…), ni mention du
  régime TVA dans les mentions légales et les CGV. À vérifier avec eux
  selon leur statut et leur chiffre d'affaires. *(Ne peut pas être
  inventé — information à leur demander.)*
- **La politique de confidentialité mentionne un « formulaire de
  contact »** qui n'existe pas (contact par téléphone et courriel
  uniquement), et annonce une suppression des messages à deux ans.
- **Sous-traitants non nommés** dans la politique : Stripe, Resend et
  Vercel n'y figurent pas, et aucun transfert de données hors de Suisse
  n'est mentionné alors que les trois sont américains. La LPD demande
  d'informer sur ces communications.
- **Paiement indisponible annoncé trop tard** : si Stripe n'est pas
  configuré, le client remplit tout, clique, et découvre l'erreur.

**Audit de sécurité du 2026-09-20 — ce qui a été attaqué et a tenu**

Tests réels contre l'API, pas une relecture de code :
- *Prix* — injection de `price`/`prixUnitaire`/`amount` dans les lignes :
  ignorée, Stripe facture bien 39 CHF au lieu de 0.01.
- *Quantités* — 0, négatives, décimales, `Infinity`, `NaN`, texte : toutes
  refusées sauf `"5"` (chaîne numérique), qui donne correctement 150 CHF.
- *Âge* — `majeur` en chaîne, en nombre, absent : tous refusés.
- *Codes promo* — `__proto__`, `constructor`, `toString`, `valueOf`,
  objets, tableaux : aucune remise accordée (vérifié sur Stripe, remise 0).
- *Pollution de prototype* — `__proto__` dans le corps : sans effet.
- *Déni de service* — 500 lignes refusées, corps de 5 Mo absorbé.
- *Webhook avec secret* (conditions Vercel) — signature absente, bidon ou
  malformée, faux paiement de 9 999 CHF : **tous rejetés en 400**.
- *XSS* — `<script>` et `onerror` dans `session_id`, les chemins produit
  et `utm_source` : aucune réflexion non échappée.
- *Fuite de secrets* — aucune clé (`sk_`, `whsec_`, Resend) dans le HTML
  servi.
- *Données client* — une session non payée ou inventée n'affiche ni
  récapitulatif, ni numéro, ni courriel ; la page est en `noindex`.
- *Méthodes HTTP* — GET/PUT/DELETE/PATCH sur l'API : 405.
- *Vie privée* — **aucun cookie déposé, aucune requête externe, aucun
  traceur** ; polices auto-hébergées. Juridiquement confortable : pas de
  bandeau cookies nécessaire.

**Vérifié bon par ailleurs** — validation serveur des paniers, les 16
routes répondent 200, build de production propre, parcours complet
(age gate → panier → commande → session Stripe) testé sous CSP sans une
seule erreur de console.

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
