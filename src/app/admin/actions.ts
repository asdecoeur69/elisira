"use server";

import { revalidatePath } from "next/cache";
import {
  definirStock,
  marquerExpediee,
  marquerRetiree,
  listerCommandes,
} from "@/lib/admin/db";
import {
  fermerSession,
  motDePasseValide,
  ouvrirSession,
  sessionValide,
} from "@/lib/admin/session";
import { envoyerExpedition } from "@/lib/commerce/courriel";

/**
 * Actions du tableau de bord.
 *
 * Chacune revérifie la session : une action serveur est une URL comme une
 * autre, et quelqu'un qui en connaît l'existence peut l'appeler sans passer
 * par la page. La garde de la page ne protège que l'affichage.
 */

async function garde() {
  if (!(await sessionValide())) {
    throw new Error("Session expirée. Reconnectez-vous.");
  }
}

export async function connexion(_etat: unknown, form: FormData) {
  const saisi = String(form.get("motdepasse") ?? "");
  /* Petite temporisation : rend le tâtonnement automatisé pénible sans
     gêner une saisie humaine. */
  await new Promise((r) => setTimeout(r, 400));

  if (!motDePasseValide(saisi)) {
    return { erreur: "Mot de passe incorrect." };
  }
  await ouvrirSession();
  revalidatePath("/admin");
  return { erreur: "" };
}

export async function deconnexion() {
  await fermerSession();
  revalidatePath("/admin");
}

export async function majStock(_etat: unknown, form: FormData) {
  await garde();
  const variante = String(form.get("variante") ?? "");
  const brut = Number(form.get("quantite"));

  if (!variante) return { erreur: "Produit manquant." };
  if (!Number.isInteger(brut) || brut < 0 || brut > 9999) {
    return { erreur: "Quantité invalide." };
  }

  await definirStock(variante, brut);
  revalidatePath("/admin");
  revalidatePath("/");
  return { erreur: "", ok: true };
}

/**
 * Marque une commande expédiée et prévient le client.
 *
 * L'ordre compte : on enregistre d'abord, on écrit ensuite. Si le courriel
 * échoue, la commande reste marquée expédiée — ce qui est la vérité — et le
 * message le signale pour qu'on reprenne à la main. L'inverse ferait
 * réapparaître une commande déjà partie à chaque échec d'envoi.
 */
export async function expedier(_etat: unknown, form: FormData) {
  await garde();
  const sessionId = String(form.get("session") ?? "");
  const suivi = String(form.get("suivi") ?? "").trim();
  if (!sessionId) return { erreur: "Commande introuvable." };

  const commandes = await listerCommandes(200);
  const commande = commandes.find((c) => c.session_id === sessionId);
  if (!commande) return { erreur: "Commande introuvable." };

  const retrait = /retrait/i.test(commande.mode ?? "");

  if (retrait) {
    await marquerRetiree(sessionId);
    revalidatePath("/admin");
    return { erreur: "", ok: true, message: "Marquée comme retirée." };
  }

  await marquerExpediee(sessionId, suivi || null);
  revalidatePath("/admin");

  const envoye = await envoyerExpedition({
    email: commande.client_email,
    prenom: commande.client_nom?.split(" ")[0] ?? null,
    numero: commande.numero,
    suivi: suivi || null,
  });

  return {
    erreur: "",
    ok: true,
    message: envoye
      ? "Expédiée. Le client a été prévenu."
      : "Expédiée, mais le courriel n'est pas parti — prévenez le client à la main.",
  };
}
