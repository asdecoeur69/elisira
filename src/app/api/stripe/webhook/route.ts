import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/commerce/stripe";
import type Stripe from "stripe";

/**
 * Webhook Stripe.
 *
 * Trois règles, et elles comptent plus que le reste du fichier :
 *
 * 1. On vérifie la signature. Sans elle, n'importe qui peut appeler cette
 *    URL et déclarer une commande payée.
 * 2. On lit le corps brut. Le moindre reformatage invalide la signature.
 * 3. On traite l'événement une seule fois. Stripe réémet en cas de doute,
 *    et une commande en double coûte cher à démêler.
 *
 * Stripe considère toute réponse non-2xx comme un échec et réessaie : on
 * ne renvoie donc une erreur que si un nouvel essai a des chances d'aboutir.
 */

/* Mémoire des événements déjà vus. Suffisant tant qu'il n'y a qu'une
   instance ; à déplacer en base le jour où le site est répliqué. */
const dejaTraites = new Set<string>();

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET absente");
    return NextResponse.json({ error: "Non configuré." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente." }, { status: 400 });
  }

  /* Corps brut, impérativement : pas de request.json() ici. */
  const brut = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(brut, signature, secret);
  } catch (e) {
    /* Signature invalide : réessayer n'y changera rien → 400. */
    console.error("[webhook] signature refusée", e);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (dejaTraites.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  dejaTraites.add(event.id);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      /* `completed` ne veut pas dire encaissé : un paiement différé peut
         encore échouer. On ne traite que ce qui est réellement payé. */
      if (session.payment_status === "paid") {
        await enregistrerCommande(session);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    /* Échec de notre côté : on laisse Stripe réessayer, donc 500.
       L'événement est retiré du cache pour que le réessai passe. */
    dejaTraites.delete(event.id);
    console.error("[webhook] traitement échoué", event.id, e);
    return NextResponse.json({ error: "Traitement échoué." }, { status: 500 });
  }
}

/**
 * Journalise la commande payée.
 *
 * Volontairement minimal : le tableau de bord Stripe fait office de
 * back-office au démarrage. C'est ici que viendra l'envoi du courriel de
 * confirmation, puis l'enregistrement en base le jour venu.
 */
async function enregistrerCommande(session: Stripe.Checkout.Session) {
  const client = session.customer_details;

  console.log("[commande] payée", {
    id: session.id,
    montant: session.amount_total,
    devise: session.currency,
    client: client?.email,
    nom: client?.name,
    code: session.metadata?.code || null,
  });
}
