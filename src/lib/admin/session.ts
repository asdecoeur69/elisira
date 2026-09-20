import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

/**
 * Accès au tableau de bord.
 *
 * Un mot de passe unique et partagé suffit ici : deux personnes, aucun
 * besoin de distinguer qui fait quoi. Ce qui compte, en revanche :
 *
 * 1. **La vérification est côté serveur.** Un mot de passe comparé dans le
 *    navigateur se lit dans le code de la page — autant ne pas en mettre.
 * 2. **Le cookie est signé.** Sans signature, n'importe qui se fabrique un
 *    cookie « je suis connecté » et entre.
 * 3. **La comparaison est à temps constant.** Un `===` sur une chaîne
 *    s'arrête au premier caractère faux : en mesurant le temps de réponse,
 *    on devine le mot de passe lettre par lettre.
 */

const COOKIE = "elisira-admin";
const DUREE_HEURES = 12;

export function adminConfigure() {
  const mdp = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!mdp || mdp.length < 12) return false;
  if (!secret || secret.length < 24) return false;
  return true;
}

function signer(valeur: string) {
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "")
    .update(valeur)
    .digest("hex");
}

/** Comparaison insensible au temps de réponse. */
function egal(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  /* `timingSafeEqual` exige des longueurs identiques : on compare d'abord
     un condensé, qui en a toujours une. */
  const ha = createHmac("sha256", "cmp").update(ba).digest();
  const hb = createHmac("sha256", "cmp").update(bb).digest();
  return timingSafeEqual(ha, hb);
}

export function motDePasseValide(saisi: string) {
  const attendu = process.env.ADMIN_PASSWORD ?? "";
  if (!attendu) return false;
  return egal(saisi, attendu);
}

/** Ouvre une session : un jeton aléatoire, signé, valable 12 h. */
export async function ouvrirSession() {
  const expire = Date.now() + DUREE_HEURES * 3600 * 1000;
  const jeton = `${randomBytes(16).toString("hex")}.${expire}`;
  const valeur = `${jeton}.${signer(jeton)}`;

  const c = await cookies();
  c.set(COOKIE, valeur, {
    httpOnly: true,
    /* En développement le site est servi en clair : un cookie `secure` ne
       serait jamais renvoyé et la connexion tournerait en boucle. */
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expire),
  });
}

export async function fermerSession() {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function sessionValide() {
  if (!adminConfigure()) return false;

  const c = await cookies();
  const brut = c.get(COOKIE)?.value;
  if (!brut) return false;

  const sep = brut.lastIndexOf(".");
  if (sep < 0) return false;

  const jeton = brut.slice(0, sep);
  const signature = brut.slice(sep + 1);
  if (!egal(signature, signer(jeton))) return false;

  const expire = Number(jeton.split(".")[1]);
  if (!Number.isFinite(expire) || Date.now() > expire) return false;

  return true;
}
