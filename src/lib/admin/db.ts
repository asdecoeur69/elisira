import "server-only";
import { neon } from "@neondatabase/serverless";

/**
 * Accès à la base — serveur uniquement.
 *
 * La boutique doit continuer à vendre même si la base est injoignable :
 * une commande payée ne doit jamais être perdue parce qu'un stock n'a pas
 * pu être décrémenté. Chaque appel est donc conçu pour échouer sans
 * interrompre le paiement, et `baseConfiguree()` permet au tableau de bord
 * d'expliquer proprement ce qui manque plutôt que de planter.
 */

let schemaPret = false;

export function baseConfiguree() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
    return false;
  }
  return url.length > 30;
}

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL absente.");
  return neon(url);
}

/**
 * Crée les tables au premier appel.
 *
 * Une migration en bonne et due forme serait disproportionnée ici : deux
 * tables, aucun historique de schéma à gérer. `IF NOT EXISTS` suffit et
 * évite d'avoir à lancer quoi que ce soit à la main au déploiement.
 */
export async function assurerSchema() {
  if (schemaPret) return;
  const sql = client();

  await sql`
    CREATE TABLE IF NOT EXISTS stock (
      variante    TEXT PRIMARY KEY,
      quantite    INTEGER NOT NULL DEFAULT 0,
      maj         TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS commandes (
      session_id   TEXT PRIMARY KEY,
      numero       TEXT NOT NULL,
      cree         TIMESTAMPTZ NOT NULL DEFAULT now(),
      client_nom   TEXT,
      client_email TEXT,
      client_tel   TEXT,
      adresse      TEXT,
      mode         TEXT,
      total        INTEGER NOT NULL DEFAULT 0,
      devise       TEXT NOT NULL DEFAULT 'chf',
      lignes       JSONB NOT NULL DEFAULT '[]'::jsonb,
      statut       TEXT NOT NULL DEFAULT 'a_preparer',
      suivi        TEXT,
      expediee     TIMESTAMPTZ
    )`;

  schemaPret = true;
}

export type LigneCommande = {
  titre: string;
  quantite: number;
  montant: number;
};

export type Commande = {
  session_id: string;
  numero: string;
  cree: string;
  client_nom: string | null;
  client_email: string | null;
  client_tel: string | null;
  adresse: string | null;
  mode: string | null;
  total: number;
  devise: string;
  lignes: LigneCommande[];
  statut: "a_preparer" | "expediee" | "retiree";
  suivi: string | null;
  expediee: string | null;
};

/**
 * Enregistre une commande payée.
 *
 * `ON CONFLICT DO NOTHING` : Stripe réémet ses événements en cas de doute,
 * et une commande en double coûte cher à démêler. Le `session_id` est
 * unique par commande, il fait donc office de garde-fou.
 */
export async function enregistrerCommande(c: {
  sessionId: string;
  numero: string;
  nom: string | null;
  email: string | null;
  tel: string | null;
  adresse: string | null;
  mode: string | null;
  total: number;
  devise: string;
  lignes: LigneCommande[];
}) {
  await assurerSchema();
  const sql = client();
  await sql`
    INSERT INTO commandes
      (session_id, numero, client_nom, client_email, client_tel,
       adresse, mode, total, devise, lignes, statut)
    VALUES
      (${c.sessionId}, ${c.numero}, ${c.nom}, ${c.email}, ${c.tel},
       ${c.adresse}, ${c.mode}, ${c.total}, ${c.devise},
       ${JSON.stringify(c.lignes)}::jsonb, 'a_preparer')
    ON CONFLICT (session_id) DO NOTHING`;
}

export async function listerCommandes(limite = 100): Promise<Commande[]> {
  await assurerSchema();
  const sql = client();
  const r = await sql`
    SELECT * FROM commandes ORDER BY cree DESC LIMIT ${limite}`;
  return r as Commande[];
}

export async function marquerExpediee(sessionId: string, suivi: string | null) {
  await assurerSchema();
  const sql = client();
  await sql`
    UPDATE commandes
       SET statut = 'expediee', suivi = ${suivi}, expediee = now()
     WHERE session_id = ${sessionId}`;
}

export async function marquerRetiree(sessionId: string) {
  await assurerSchema();
  const sql = client();
  await sql`
    UPDATE commandes
       SET statut = 'retiree', expediee = now()
     WHERE session_id = ${sessionId}`;
}

/* ---------------------------------------------------------------- stock */

/**
 * Stock par variante, en nombre d'exemplaires.
 *
 * Une variante absente de la table est considérée comme disponible : tant
 * que personne n'a saisi de quantité, le site vend comme avant. C'est
 * volontaire — brancher la base ne doit pas fermer la boutique.
 */
export async function lireStock(): Promise<Record<string, number>> {
  await assurerSchema();
  const sql = client();
  const r = (await sql`SELECT variante, quantite FROM stock`) as Array<{
    variante: string;
    quantite: number;
  }>;
  return Object.fromEntries(r.map((l) => [l.variante, l.quantite]));
}

export async function definirStock(variante: string, quantite: number) {
  await assurerSchema();
  const sql = client();
  await sql`
    INSERT INTO stock (variante, quantite, maj)
    VALUES (${variante}, ${quantite}, now())
    ON CONFLICT (variante)
      DO UPDATE SET quantite = ${quantite}, maj = now()`;
}

/**
 * Décrémente le stock après une vente.
 *
 * `GREATEST(..., 0)` empêche un stock négatif : si deux commandes passent
 * au même instant sur la dernière bouteille, on préfère un compteur à zéro
 * et une explication au client à un nombre absurde dans le tableau de bord.
 * Les variantes jamais saisies sont ignorées.
 */
export async function decrementerStock(lignes: Array<{ variante: string; quantite: number }>) {
  await assurerSchema();
  const sql = client();
  for (const l of lignes) {
    await sql`
      UPDATE stock
         SET quantite = GREATEST(quantite - ${l.quantite}, 0), maj = now()
       WHERE variante = ${l.variante}`;
  }
}
