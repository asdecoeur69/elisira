import { Resend } from "resend";
import type Stripe from "stripe";

/**
 * Courriel de confirmation de commande.
 *
 * Les CGV (art. 5) et la page de confirmation promettent ce courriel :
 * tant qu'il n'est pas envoyé, la promesse est tenue en l'air. Il part
 * depuis le webhook Stripe, seul endroit qui sait qu'un paiement a
 * réellement abouti.
 *
 * L'envoi est volontairement tolérant : une commande payée reste une
 * commande payée même si le courriel échoue. On journalise et on rend la
 * main plutôt que de faire échouer le webhook, ce qui pousserait Stripe à
 * rejouer l'événement — et donc à risquer un second courriel.
 */

/** Expéditeur par défaut : domaine à vérifier dans Resend. */
const EXPEDITEUR_DEFAUT = "H&H Spirits <commandes@hh-spirits.com>";
const REPONSE_A = "info@hh-spirits.com";

/**
 * Numéro de commande lisible, dérivé de l'identifiant Stripe.
 *
 * Partagé avec la page de confirmation : le client doit lire le même
 * numéro à l'écran et dans son courriel.
 */
export function numeroLisible(sessionId: string, cree: number) {
  const annee = new Date(cree * 1000).getFullYear();
  const suffixe = sessionId.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `EL-${annee}-${suffixe}`;
}

/** L'envoi n'est tenté que si une clé plausible est configurée. */
export function courrielConfigure() {
  const cle = process.env.RESEND_API_KEY?.trim();
  if (!cle) return false;
  if (!cle.startsWith("re_")) return false;
  if (cle.endsWith("...") || cle.endsWith("…")) return false;
  return cle.length > 10;
}

function francs(centimes: number | null | undefined) {
  return ((centimes ?? 0) / 100).toFixed(2).replace(/\.00$/, ".—");
}

/** Échappe le texte inséré dans le gabarit HTML. */
function esc(valeur: string) {
  return valeur
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Ligne = { titre: string; quantite: number; montant: number };

function gabarit(opts: {
  numero: string;
  prenom: string | null;
  lignes: Ligne[];
  remise: number;
  livraison: number | null;
  total: number;
  devise: string;
}) {
  const d = opts.devise.toUpperCase();

  const lignes = opts.lignes
    .map(
      (l) => `
      <tr>
        <td style="padding:12px 0;border-top:1px solid #e7e0d6;color:#2b2622;">
          ${esc(l.titre)} <span style="color:#a89c8d;">× ${l.quantite}</span>
        </td>
        <td style="padding:12px 0;border-top:1px solid #e7e0d6;text-align:right;color:#2b2622;white-space:nowrap;">
          ${d} ${francs(l.montant)}
        </td>
      </tr>`
    )
    .join("");

  const extra = (label: string, valeur: string) => `
      <tr>
        <td style="padding:6px 0;color:#6b6157;font-size:14px;">${label}</td>
        <td style="padding:6px 0;text-align:right;color:#6b6157;font-size:14px;white-space:nowrap;">${valeur}</td>
      </tr>`;

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:32px 16px;background:#faf7f2;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fffdf9;border-radius:8px;padding:40px 32px;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c0693f;">
          Commande ${esc(opts.numero)}
        </p>
        <h1 style="margin:0 0 20px;font-size:26px;font-weight:400;color:#2b2622;">
          Merci${opts.prenom ? `, ${esc(opts.prenom)}` : ""}.
        </h1>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#6b6157;">
          Votre commande est confirmée et payée. Nous la préparons à
          Collex-Bossy et vous préviendrons dès qu'elle est expédiée.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family:Georgia,serif;font-size:15px;">
          ${lignes}
          ${opts.remise > 0 ? extra("Remise", `− ${d} ${francs(opts.remise)}`) : ""}
          ${
            opts.livraison !== null
              ? extra(
                  opts.livraison === 0 ? "Livraison offerte" : "Livraison",
                  opts.livraison === 0 ? "Offerte" : `${d} ${francs(opts.livraison)}`
                )
              : ""
          }
          <tr>
            <td style="padding:16px 0 0;border-top:1px solid #d9cfc2;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b6157;">
              Total réglé
            </td>
            <td style="padding:16px 0 0;border-top:1px solid #d9cfc2;text-align:right;font-size:20px;color:#2b2622;white-space:nowrap;">
              ${d} ${francs(opts.total)}
            </td>
          </tr>
        </table>

        <p style="margin:32px 0 0;font-size:14px;line-height:1.7;color:#6b6157;">
          Une question ? Répondez simplement à ce courriel.
        </p>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#a89c8d;">
          HH Spirits SNC · Cours des Bastions 13, 1205 Genève<br />
          L'abus d'alcool est dangereux pour la santé. À consommer avec
          modération. Vente interdite aux mineurs.
        </p>
      </td></tr>
    </table>
  </body>
</html>`;
}

/**
 * Envoie la confirmation. Ne lève jamais : renvoie `false` en cas d'échec
 * pour que l'appelant puisse journaliser sans compromettre la commande.
 */
export async function envoyerConfirmation(
  session: Stripe.Checkout.Session,
  lignes: Ligne[],
  numero: string
): Promise<boolean> {
  const destinataire = session.customer_details?.email;
  if (!destinataire) {
    console.warn("[courriel] aucune adresse client", session.id);
    return false;
  }
  if (!courrielConfigure()) {
    console.warn("[courriel] RESEND_API_KEY absente — envoi ignoré", numero);
    return false;
  }

  const prenom = session.customer_details?.name?.split(" ")[0] ?? null;
  const devise = session.currency ?? "chf";

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM?.trim() || EXPEDITEUR_DEFAUT,
      to: destinataire,
      replyTo: REPONSE_A,
      subject: `Votre commande ${numero} est confirmée`,
      html: gabarit({
        numero,
        prenom,
        lignes,
        remise: session.total_details?.amount_discount ?? 0,
        livraison: session.total_details?.amount_shipping ?? null,
        total: session.amount_total ?? 0,
        devise,
      }),
    });

    if (error) {
      console.error("[courriel] refus de Resend", numero, error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[courriel] envoi impossible", numero, e);
    return false;
  }
}
