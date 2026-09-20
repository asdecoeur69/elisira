import Link from "next/link";
import type { Metadata } from "next";
import Stripe from "stripe";
import { getStripe, paiementConfigure } from "@/lib/commerce/stripe";
import { numeroLisible } from "@/lib/commerce/courriel";
import { ViderPanier } from "./ConfirmationClient";

export const metadata: Metadata = {
  title: "Commande confirmée — H&H Spirits",
  robots: { index: false, follow: false },
};

/**
 * Confirmation de commande.
 *
 * Le récapitulatif est lu chez Stripe à partir du `session_id` renvoyé
 * dans l'URL de retour : c'est la seule source qui connaisse le montant
 * réellement débité, la remise appliquée et les frais de port. Le panier
 * du navigateur, lui, a déjà été vidé et ne peut pas servir de référence.
 */

type Recap = {
  numero: string;
  lignes: Array<{ titre: string; quantite: number; montant: number }>;
  total: number;
  livraison: number | null;
  remise: number;
  code: string | null;
  devise: string;
  courriel: string | null;
};

/** Montants Stripe : centimes → francs. */
function francs(centimes: number | null | undefined) {
  return (centimes ?? 0) / 100;
}

function formater(montant: number, devise: string) {
  return `${devise.toUpperCase()} ${montant.toFixed(2).replace(/\.00$/, ".—")}`;
}

async function lireCommande(sessionId: string): Promise<Recap | null> {
  if (!paiementConfigure()) return null;

  let session: Stripe.Response<Stripe.Checkout.Session>;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch (e) {
    /* Identifiant inconnu ou trafiqué : on retombe sur le message
       générique plutôt que d'afficher une erreur au client. */
    console.error("[confirmation] session illisible", e);
    return null;
  }

  /* On n'affiche un récapitulatif que pour une commande réellement payée :
     un `session_id` valide mais abandonné ne doit pas ressembler à un
     achat confirmé. */
  if (session.payment_status !== "paid") return null;

  const devise = session.currency ?? "chf";

  return {
    numero: numeroLisible(session.id, session.created),
    lignes: (session.line_items?.data ?? []).map((l) => ({
      titre: l.description ?? "Article",
      quantite: l.quantity ?? 1,
      montant: francs(l.amount_total),
    })),
    total: francs(session.amount_total),
    livraison: session.total_details?.amount_shipping != null
      ? francs(session.total_details.amount_shipping)
      : null,
    remise: francs(session.total_details?.amount_discount),
    code: session.metadata?.code || null,
    devise,
    courriel: session.customer_details?.email ?? null,
  };
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const commande = session_id ? await lireCommande(session_id) : null;

  return (
    <section className="mx-auto max-w-[760px] px-6 pb-[var(--spacing-section)] pt-[calc(var(--header-h)+56px)] lg:px-10">
      <ViderPanier />

      <ol className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.2em]">
        <li className="text-[var(--color-earth-300)]">Panier</li>
        <li className="text-[var(--color-earth-300)]">·</li>
        <li className="text-[var(--color-earth-300)]">Livraison</li>
        <li className="text-[var(--color-earth-300)]">·</li>
        <li className="text-[var(--color-terracotta)]">Confirmation</li>
      </ol>

      {commande && (
        <p className="mt-10 text-[0.7rem] uppercase tracking-[0.34em] text-[var(--color-terracotta)]">
          Commande {commande.numero}
        </p>
      )}

      <h1 className="mt-6 text-[length:var(--text-h2)]">
        Merci, votre commande{" "}
        <span className="accent-italic">est confirmée.</span>
      </h1>

      <p className="body-copy mt-7 text-[length:var(--text-lead)] font-light text-[var(--color-earth-500)]">
        {commande?.courriel ? (
          <>
            Un courriel de confirmation part vers {commande.courriel}. Nous
            préparons votre commande à Collex-Bossy et vous écrivons, avec le
            numéro de suivi, dès qu&apos;elle part.
          </>
        ) : (
          <>
            Vous recevrez un courriel de confirmation dans quelques minutes.
            Nous préparons votre commande à Collex-Bossy et vous écrivons, avec
            le numéro de suivi, dès qu&apos;elle part.
          </>
        )}
      </p>

      {commande && (
        <div className="mt-14">
          <h2 className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-terracotta)]">
            Votre commande
          </h2>

          <ul className="mt-6">
            {commande.lignes.map((ligne, i) => (
              <li
                key={`${ligne.titre}-${i}`}
                className="flex items-baseline justify-between gap-4 border-t py-4"
                style={{
                  borderColor: "var(--hairline)",
                  borderBottomWidth: i === commande.lignes.length - 1 ? 1 : 0,
                  borderBottomStyle: "solid",
                }}
              >
                <span className="font-[family-name:var(--font-heading)] text-[1.05rem] text-[var(--color-earth-deep)]">
                  {ligne.titre}
                  <span className="ml-2 text-[0.85rem] text-[var(--color-earth-300)]">
                    × {ligne.quantite}
                  </span>
                </span>
                <span className="font-[family-name:var(--font-heading)] text-[1.05rem] tabular-nums text-[var(--color-earth-deep)]">
                  {formater(ligne.montant, commande.devise)}
                </span>
              </li>
            ))}
          </ul>

          {commande.remise > 0 && (
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-[0.8rem] text-[var(--color-terracotta)]">
                Remise{commande.code ? ` · ${commande.code}` : ""}
              </span>
              <span className="text-[0.8rem] text-[var(--color-terracotta)]">
                − {formater(commande.remise, commande.devise)}
              </span>
            </div>
          )}

          {commande.livraison !== null && (
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[0.8rem] text-[var(--color-earth-500)]">
                {commande.livraison === 0
                  ? "Livraison offerte"
                  : "Livraison en Suisse"}
              </span>
              <span className="text-[0.8rem] text-[var(--color-earth-500)]">
                {commande.livraison === 0
                  ? "Offerte"
                  : formater(commande.livraison, commande.devise)}
              </span>
            </div>
          )}

          <div className="mt-5 flex items-baseline justify-between border-t pt-5" style={{ borderColor: "var(--hairline-strong)" }}>
            <span className="text-[0.76rem] uppercase tracking-[0.2em] text-[var(--color-earth-500)]">
              Total réglé
            </span>
            <span className="font-[family-name:var(--font-heading)] text-[1.5rem] text-[var(--color-earth-deep)]">
              {formater(commande.total, commande.devise)}
            </span>
          </div>
        </div>
      )}

      <div className="mt-14 flex flex-wrap items-center gap-6">
        <Link
          href="/commander"
          className="rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-cream)] transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)]"
        >
          Retour à la boutique
        </Link>
        <Link
          href="/contact"
          className="border-b pb-1 text-[0.8rem] uppercase tracking-[0.16em] text-[var(--color-earth-500)] transition-colors duration-300 hover:text-[var(--color-terracotta)]"
          style={{ borderColor: "var(--color-border-strong)" }}
        >
          Une question ?
        </Link>
      </div>

      <p className="mt-12 text-[0.75rem] text-[var(--color-earth-500)]">
        L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec
        modération. Vente interdite aux mineurs.
      </p>
    </section>
  );
}
