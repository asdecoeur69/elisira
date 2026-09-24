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

**Lien avec l'entrée « Nommer les partenaires »** — les citer sur le site
est le prétexte naturel pour demander la réciproque. Les deux demandes
tiennent dans le même courriel : « on vous a mis sur notre page points de
vente, accepteriez-vous un lien en retour ? »

---

## P1 — Nommer les partenaires sur le site

*Évoquée le 2026-09-22. **Fait le 2026-09-23** pour les quatre premiers.*

Le site ne nommait aucun partenaire : la page points de vente disait
« chez nos partenaires à Genève et en Suisse romande », et c'était tout.
C'était le point 2 de l'audit commercial du 2026-09-20.

**Les quatre premiers partenaires** *(donnés par le propriétaire,
coordonnées vérifiées sur annuaires publics le 2026-09-23)*

| Établissement | Type | Adresse | Téléphone | Site |
|---|---|---|---|---|
| El Ruedo | Café-restaurant espagnol | Rue de Fribourg 12, 1201 Genève | 022 732 65 08 | aucun |
| Le Kraken | Bar à bières | Rue de l'École-de-Médecine 8, 1205 Genève | 022 321 59 41 | lekrakenbar.ch |
| Restaurant Roberto | Restaurant italien | Rue Pierre-Fatio 10, 1204 Genève | 022 311 80 33 | restaurantroberto.ch |
| La Causette | Bar | Rue du Pré-de-la-Reine 26, 1236 Cartigny | 022 756 09 76 | aucun |

Tous les quatre : **consommation sur place, encore actifs**, et le
propriétaire confirme n'avoir aucun problème de publication (2026-09-23).
L'ambiguïté sur « Roberto » (deux établissements à Genève) a été tranchée
par lui : c'est bien le Rue Pierre-Fatio, inscrit au registre sous
« Roberto et Cie ».

**La conséquence à ne pas manquer** — les quatre sont de la dégustation.
La page points de vente n'offre donc **aucune adresse où acheter une
bouteille**, et elle le dit désormais explicitement (« Elisira n'est pas
encore vendue à l'emporter en boutique »). Laisser croire le contraire
aurait fait se déplacer des clients pour rien. Dès qu'un caviste entre
au catalogue, il passe en `mode: "vente"` et le paragraphe disparaît tout
seul.

**Fait le 2026-09-23**
- `src/lib/catalog/partenaires.ts` — source unique. Type `ModeDeVente`
  (`degustation` | `vente`), regroupement par ville, formatage des
  numéros (`+41227326508` → `022 732 65 08`, le `href` gardant la forme
  internationale). Ajouter un partenaire = une entrée.
- `/points-de-vente` refondue en deux sections : « Acheter une
  bouteille » (en ligne, au domaine) et « Déguster sur place »
  (les quatre, groupés par ville — Cartigny a son propre en-tête,
  à 15 km de Genève-ville il aurait détonné dans une liste genevoise).
  Les noms cliquables quand l'établissement a un site.
- **Bande d'accueil** `PartnersBand`, placée entre `UsageSection` et
  `QuoteBand` : le visiteur vient de lire comment déguster, c'est le
  moment de montrer qui la sert déjà. Elle se retire d'elle-même si la
  liste est vide. Noms en typo du site, pas de logos — tant qu'on n'a
  pas les fichiers en bonne définition, un PNG flou nuirait plus.
- `/professionnels` : une ligne de référence vers la page, sans citer de
  nom, pour n'avoir pas à la modifier à chaque ajout.
- **Pas de JSON-LD.** Aucun type schema.org ne décrit honnêtement « nos
  revendeurs ». Le gain SEO vient du lien retour depuis leur site.
- Vérifié : `tsc` et `eslint` propres, build de production réussi,
  `/points-de-vente` toujours statique, aucun débordement horizontal en
  375 px (la bande passe en 2×2 sur mobile).

**Une ou deux pages ? — tranché le 2026-09-23 : une seule**

Question posée : faut-il « Où nous trouver » ou « Nos partenaires », ou
les deux ? Une seule page, et celle-ci.
- Deux pages se videraient mutuellement : avec quatre noms, la seconde ne
  contiendrait rien que la première n'a pas. Google devrait choisir
  laquelle classer sur « où acheter Elisira Genève » et se trompe souvent.
- « Où nous trouver » épouse la question du visiteur (« où acheter
  Elisira »), alors que « Nos partenaires » parle de la maison, pas d'eux
  — et ne couvre qu'un canal sur trois.
- **Deux pages redeviendront justes** à quinze ou vingt établissements, ou
  dès qu'il y aura de vrais revendeurs à l'emporter : « Où acheter » et
  « Où déguster » seront alors deux intentions distinctes avec assez de
  contenu chacune. En attendant, la page fait déjà la distinction à
  l'intérieur, en deux sections.
- *Manque identifié* : rien dans l'**en-tête** ne mène à cette page (elle
  n'est qu'en pied de page). C'est le vrai problème, pas le titre.

**Qui lit cette page — précision du 2026-09-23**

Le propriétaire fait remarquer, à juste titre, qu'**envoyer un client chez
un partenaire arrange H&H** : la bouteille servie au Kraken est une
bouteille achetée à H&H, et un revendeur qui tourne recommande. En marge
unitaire la vente directe est meilleure, mais en volume et en durée un
revendeur régulier vaut mieux qu'un particulier qui commande une fois.

*Précision du même jour* — la question portait en réalité sur l'intérêt
**des partenaires** : est-ce que ça les arrange qu'on achète directement
chez eux ? Oui, et c'est l'argument de démarchage. Un client envoyé au
Kraken, c'est une consommation vendue à **leur** marge, plus ce qu'il
prend en plus : du trafic gratuit pour eux. Ce qui les desservirait, ce
serait une page qui pousse à commander en ligne plutôt qu'à passer chez
eux. C'est aussi ce qui rend la demande de lien retour légitime — on leur
envoie du monde, la réciproque n'est pas une faveur.

**Limite à ne pas franchir en démarchant** : avec quatre adresses et un
site pas encore en ligne, le trafic envoyé est aujourd'hui proche de zéro.
Vendre de la *visibilité*, pas un flux de clients. Un restaurateur qui
attend des visites qui ne viennent pas se souviendra de la promesse.

Il en déduisait que la page vise les prospects partenaires. Nuance : elle
sert **deux publics qui ne lisent pas la même chose**. Le consommateur y
cherche une adresse — c'est lui le trafic (« liqueur Genève ») et c'est
lui qui fait tourner le stock des partenaires. Le prospect partenaire, lui,
arrive par `/professionnels` ou par démarchage : la liste lui sert de
référence, pas de porte d'entrée. La page reste donc orientée
consommateur.

*Corrigé en conséquence* — la section dégustation était écrite comme une
consolation (« on n'y achète pas de bouteille, mais… »). Réécrite comme
une destination : « Poussez leur porte : c'est là qu'on la découvre le
mieux ». Et le paragraphe sur l'absence de vente à l'emporter renvoie
désormais vers elle (« Pour la boire ce soir, voir plus bas ») au lieu de
se terminer sur un manque.

**Arbitrage B2C / B2B — tranché le 2026-09-23**

Constat du propriétaire, juste : en **B2C** il vaut mieux qu'on achète sur
le site que chez Roberto ; en **B2B**, un prospect qui voit Elisira déjà
installée dans plusieurs endroits de Genève est plus facile à convaincre.

*Ce qu'on en tire* — les deux publics veulent la même liste pour des
raisons opposées, et un seul des deux doit pouvoir s'en servir. Le
prospect a besoin de **voir les noms** ; il n'ira jamais vérifier chez
Roberto. Le consommateur, lui, peut s'en servir d'annuaire et aller boire
là-bas au lieu de commander. La liste doit donc **exister** sans
**fonctionner comme un guide de sortie**.

*Fait*
- `/points-de-vente` : noms et types seulement. Rue, téléphone et lien
  retirés. « El Ruedo — Café-restaurant espagnol » prouve autant qu'une
  adresse sans faire itinéraire. L'intro n'invite plus à pousser la porte
  (« Elisira est à la carte de ces établissements genevois »).
- `/professionnels` : nouvelle section « Nos références », coordonnées
  **complètes**, en grille deux colonnes, juste avant le bloc de contact.
  C'est le seul endroit où la liste ne travaille que pour H&H — et un
  prospect qui appelle un partenaire pour se renseigner est une bonne
  chose. La phrase de renvoi sans nom y est remplacée par la vraie liste.

*Réserves assumées* — la cannibalisation B2C est probablement faible :
quelqu'un qui veut une bouteille ne va pas boire un verre au bar, ce sont
deux envies différentes. Le vrai risque viendrait d'un **caviste** dans la
liste ; pour des bars et restaurants, c'est marginal.

*Et le SEO ?* — l'essentiel est conservé : les noms d'établissements et
les villes restent sur `/points-de-vente`, et les noms sont eux-mêmes des
termes de recherche. Les rues et numéros n'apportaient presque rien (Google
ne classe pas une page tierce sur « rue de Fribourg 12 » ; une adresse pèse
pour le référencement local de l'établissement sur sa *propre* fiche). Et
elles ne sont pas perdues : elles figurent désormais sur
`/professionnels`, indexée elle aussi. Le vrai levier local reste la fiche
Google Business et les liens retour, tous deux hors du site.

*Vérifié* — `tsc` et `eslint` propres, build de production réussi, les
deux pages toujours statiques, rendu contrôlé en desktop.

**Reste à faire**
0. **Ajouter « Où nous trouver » dans l'en-tête** — proposé, en attente de
   la réponse du propriétaire.
1. **Demander les liens retour.** Le Kraken et Restaurant Roberto ont un
   site : ce sont les deux seuls candidats immédiats (voir l'entrée
   backlinks). Les citer chez nous est le prétexte du courriel.
2. **Revoir la liste périodiquement.** Une adresse périmée coûte plus
   qu'une ligne absente : un client qui se déplace pour rien ne revient
   pas.
3. **Trouver un vrai point de vente à l'emporter** (caviste, épicerie
   fine). C'est le manque structurel de la page, pas un oubli de code.
4. Le CRM reste la source pour élargir la liste : requête d'extraction
   fournie ci-dessus.

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

## P2 — Page recettes de cocktails

*Évoquée le 2026-09-22. État : en attente des photos et des recettes.*

Trois photos de cocktails existent côté propriétaire, avec leurs recettes.
À publier sur une page dédiée `/cocktails` plutôt que sur la page
d'accueil.

**Pour**
- La section dégustation dit « En cocktail » sans donner une seule
  recette : la carte pose la question et ne répond pas. C'est le premier
  réflexe d'un particulier qui vient d'acheter la bouteille.
- **C'est le seul contenu du site éligible au balisage `Recipe`** en
  JSON-LD : photo et temps de préparation affichés directement dans les
  résultats Google. Ni la page produit ni les pages légales n'y ont droit.
  Vise des requêtes gagnables (« cocktail liqueur mandarine », « spritz
  mandarine ») que le catalogue ne capte pas — cohérent avec l'entrée
  P3 mots-clés.
- Argument de vente indirect : une recette donne une raison d'acheter la
  bouteille, là où la fiche produit ne décrit que le liquide.
- Si une recette vient d'un barman partenaire, la créditer nommément
  alimente l'entrée « backlinks revendeurs ».

**Contre / risques**
- **Trois recettes, c'est le plancher.** En dessous la page paraît vide et
  ne mérite pas une entrée de menu. Prévoir d'en ajouter au fil du temps :
  une page recettes figée vieillit mal.
- Pas de vocabulaire de performance, de succès social ou de désinhibition
  dans les textes : interdit par le cadre suisse de la publicité pour
  l'alcool. La mention de modération du pied de page couvre déjà la page.
- Ne jamais inventer une dose ni un nom de créateur : si une information
  manque, la demander.

**À faire**
1. Photos dans `public/images/cocktails/`, nommées d'après le cocktail,
   sans accent ni espace. JPG ~1600 px, carré ou 4/5, < 400 Ko.
   Cadrage portrait/carré volontairement différent du 37/13 de la section
   dégustation, qui ne convient pas à un verre.
2. Recueillir pour chaque recette : nom, ingrédients **avec doses**,
   préparation, verre, garniture, créateur éventuel.
3. Page `/cocktails` : grille de 3 fiches, JSON-LD `Recipe` par recette.
4. Rendre cliquable la carte « En cocktail » de `UsageSection.tsx` vers la
   page, et ajouter l'entrée au menu.

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

## P2 — Hero plein écran et image à refaire

*Évoquée et traitée le 2026-09-21. État : fait (hauteur) · à faire (image).*

Le hero desktop s'arrêtait à `92vh` : on apercevait une bande de la
section suivante en bas d'écran, et la différence de fond la soulignait
(le hero finit en sable `#e8dccb`, la section d'après est un crème uni
`#f4ece0`, avec un filet d'1px par-dessus). Passé à `100dvh`.

**Le `92vh` n'était pas un bug** — c'était un signal de défilement : la
lisière visible disait « la page continue ». En plein écran ce signal
disparaît. À surveiller : si les visiteurs ne scrollent pas, c'est la
première cause à regarder. Un indicateur discret en bas de hero (chevron,
ou un mot) le remplacerait sans revenir en arrière.

**Fait le 2026-09-21**
- `lg:min-h-[92vh]` → `lg:min-h-[100dvh]`. `dvh` plutôt que `vh` pour
  rester juste au redimensionnement.
- **Typo indexée sur la hauteur.** L'échelle du site est en `clamp()` sur
  `vw` seul : à largeur égale, un 13" (837 px utiles) et un 27" (1080 px)
  affichaient le même titre pendant que le cadre grandissait de 240 px.
  Trois variables dédiées au hero (`--text-display-hero`,
  `--text-lead-hero`, `--text-eyebrow-hero`) mêlent `vw` et `vh` à parts
  égales.
- **Tout le texte du hero grossi d'environ 10 %** (demande du 2026-09-21).
  Planchers *et* plafonds des trois `clamp` relevés ensemble — ne monter
  que le terme variable aurait laissé les petits écrans écrêtés au
  plancher, donc inchangés. Le bouton « Découvrir Elisira » et le lien
  « Notre histoire » étaient en tailles fixes (`0.78rem`, `0.82rem`) :
  indexés sur `--text-eyebrow-hero` en desktop, sinon le bloc d'actions
  serait resté en arrière pendant que le titre grandissait.
  Mesuré après coup : titre 55 px en 720 px de haut, 62,8 px en 837 px ;
  chapô 20,3 px ; sur-titre, mentions, bouton et lien tous à 12,3 px.
- **Marge restante en 720 px de haut : 11 px.** C'est le format le plus
  serré (contenu 709 px dans 720). Ça tient, mais il n'y a plus de
  réserve : un nouveau grossissement du texte, une troisième ligne de
  titre ou un chapô rallongé ferait déborder. À vérifier en 720 px avant
  toute prochaine retouche du hero.
- Marges verticales du hero passées de valeurs fixes à `clamp(…vh…)`.
- Plafond de la bouteille relevé de 620 à 760 px : à 620 elle se figeait
  dès ~873 px de fenêtre pendant que la section continuait de grandir, ce
  qui aurait creusé le vide en plein écran.
- Vérifié en 720, 837 et 1080 px de haut : section = fenêtre exactement,
  rien de rogné, contenu 709 px dans 720. Mobile inchangé (tout est
  sous `lg:`).

**À faire — l'image du hero**
Elle va être remplacée. Deux points à reprendre à ce moment-là, laissés
en l'état exprès :
1. **Les décors sont calés en pourcentage** sur la bouteille ou la
   section (`fruits.png` à `-left-[145.5%]`, la mandarine à `w-[21%]`, la
   branche à `top-[4%]`). Ces valeurs sont accordées à l'image actuelle :
   elles seront à refaire, pas à ajuster.
2. **Au-delà de 1080 px de haut**, la bouteille replafonne à 760 px. Rare,
   et sans objet si la nouvelle image est cadrée autrement.

**Reste ouvert** — la démarcation de *teinte* entre le hero et la section
suivante n'a pas été traitée : ce n'était pas la gêne. Si elle se voit
encore une fois la nouvelle image posée, il s'agit de faire finir
`--product-bg` en crème plutôt qu'en sable, et de retirer le filet
(`HeroSection.tsx`, dernier bloc).

---

## Archive — idées traitées

### Audit de fluidité (animations, scroll, rendu) — *fait le 2026-09-23*
Demandé : rendre le site « le plus fluide possible ». Corrigé :
1. **Changement de page** : depuis Next 16, le `scroll-behavior: smooth`
   n'était plus suspendu à la navigation — chaque clic faisait défiler
   toute l'ancienne page jusqu'en haut avant d'afficher la nouvelle.
   Attribut `data-scroll-behavior="smooth"` sur `<html>` : saut instantané
   vérifié (63 ms, sans défilement visible).
2. **Hero, en-têtes de page, fiche produit invisibles jusqu'au JS** :
   Framer les rendait à `opacity: 0` côté serveur. Passés en animation CSS
   (`.entree`), ils apparaissent dès le premier rendu. Hero, PageHeader et
   ElisiraHero redevenus composants serveur (moins de JS).
3. **Apparitions au scroll** : le déplacement était en `y`, recalculé en
   JavaScript à chaque image. Réécrit en `transform` : Framer le confie au
   compositeur (vérifié : toutes les apparitions passent par
   `Element.animate`). Même chose pour le tiroir panier et le menu mobile.
4. **Branche du hero** : rotation infinie en JS → keyframes CSS.
5. Images servies en **AVIF** (repli WebP).
6. `prefers-reduced-motion` : respecté pour les nouvelles animations
   (durée nulle, délais annulés).
7. Au passage : la carte 70 cl de l'accueil menait à la fiche 50 cl.

**Écarté — bibliothèque de « smooth scroll » (Lenis, Locomotive)** : elle
remplace le défilement natif par une inertie simulée en JS. Plus « soyeux »
sur une souris à molette, mais moins bon sur trackpad et mobile (là où est
la majorité des visites), et nuisible à l'accessibilité. À ne pas
reproposer sans une raison nouvelle.

**Reste à mesurer** — le vrai test est un PageSpeed Insights sur mobile
une fois le site en ligne (le mode dev ne dit rien des performances
réelles). À faire après la mise en ligne.

### Audit technique du site — *fait le 2026-09-18/20*
Trois bloquants corrigés (montants faux, numéro de commande figé, courriel
de confirmation jamais envoyé), deux incohérences client/serveur (plafond
de quantité, codes promo dupliqués), SEO technique complet, code mort
supprimé. Voir l'historique git, branche `corrections-commande-et-seo`.

### Audit de sécurité — attaque poussée — *fait le 2026-09-20*
Deux passes d'attaque réelle contre l'API en marche (requêtes envoyées,
montants et objets vérifiés directement chez Stripe, pas une relecture de
code).

*A tenu sans faille* — injection de prix, pollution de prototype
(`__proto__`), codes promo trafiqués (objets, tableaux, `constructor`…),
quantités aberrantes, coercion de type ; **webhook infalsifiable**
(signature absente/bidon/malformée → 400, corps modifié sous signature
valide → 400, rejeu d'un événement signé → détecté `duplicate`) ; pas de
SSRF par l'image, pas de traversée de chemin, `.env`/`.git`/config → 404 ;
pas de XSS réfléchi ; aucune fuite de clé dans le HTML ; en-têtes de
sécurité présents jusque sur les 404 et les routes API ; aucun cookie ni
traceur.

*Deux faiblesses trouvées, toutes deux corrigées le 2026-09-20 :*
1. **Plafond de 24 contournable par duplication de lignes** (480
   exemplaires passaient ; montant juste, donc pas de fraude au prix mais
   promesse de stock intenable). Corrigé dans `calculerPanier` : les
   lignes d'un même produit sont fusionnées et le cumul est borné à
   `QUANTITE_MAX`. Vérifié : 12+12 → une seule ligne de 24, 12+13 → refus.
2. **Aucune limitation de débit sur `/api/checkout`**, et un coupon Stripe
   permanent créé à *chaque* commande remisée (fuite de coupons + risque
   de saturation du quota et de facture gonflée en live). Corrigé :
   coupon `percent_off` réutilisable (un seul `promo_ELISIRA26`, réutilisé
   d'une commande à l'autre — vérifié) et limiteur en mémoire, 10 req/min
   par IP avec `Retry-After` (nouveau `src/lib/commerce/limite.ts`).
   Vérifié : bascule en 429 après 10 requêtes, non-régression du parcours
   normal confirmée.

*Limite assumée (pas un défaut)* — l'age gate reste déclaratif : un
`majeur:true` envoyé directement à l'API suffit. C'est le standard suisse
pour la vente d'alcool en ligne ; à ne traiter que si un contrôle d'âge
réel devient une exigence (p. ex. à la livraison, côté transporteur).

*Hygiène* — les tests ont créé des sessions et coupons **en mode test**
(clés `sk_test_`, aucun argent) : dashboard de test à purger si besoin,
sans effet sur le live.

### Nettoyage des images — *abandonné le 2026-09-20*
21 MB de photos non référencées identifiées. Le propriétaire a choisi de
toutes les conserver. Liste reconstituable en comparant les fichiers de
`public/images/` aux chemins référencés dans `src/`.
