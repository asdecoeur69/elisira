import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/commerce/stripe";
import { envoyerConfirmation, numeroLisible } from "@/lib/commerce/courriel";
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
 * Journalise la commande payée et envoie la confirmation au client.
 *
 * Le tableau de bord Stripe fait office de back-office au démarrage :
 * l'enregistrement en base viendra le jour venu. Le courriel, lui, est
 * promis par les CGV et par la page de confirmation — il part d'ici.
 *
 * Un échec d'envoi ne fait pas échouer le webhook : la commande est
 * payée, et redemander l'événement à Stripe risquerait d'envoyer le
 * courriel deux fois. On journalise pour pouvoir rattraper à la main.
 */
async function enregistrerCommande(session: Stripe.Checkout.Session) {
  const client = session.customer_details;
  const numero = numeroLisible(session.id, session.created);

  console.log("[commande] payée", {
    numero,
    id: session.id,
    montant: session.amount_total,
    devise: session.currency,
    client: client?.email,
    nom: client?.name,
    code: session.metadata?.code || null,
  });

  /* Ni les lignes ni le mode de livraison choisi ne sont développés dans
     l'événement : on redemande la session complète. Sans ce rappel, le
     client ne saurait pas, à la lecture du courriel, s'il est livré ou
     s'il doit venir chercher sa commande. */
  let lignes: Array<{ titre: string; quantite: number; montant: number }> = [];
  let modeLivraison: string | null = null;
  let complete = session;

  try {
    const stripe = getStripe();
    const [items, detaillee] = await Promise.all([
      stripe.checkout.sessions.listLineItems(session.id, { limit: 50 }),
      stripe.checkout.sessions.retrieve(session.id, {
        expand: ["shipping_cost.shipping_rate"],
      }),
    ]);

    lignes = items.data.map((l) => ({
      titre: l.description ?? "Article",
      quantite: l.quantity ?? 1,
      montant: l.amount_total ?? 0,
    }));

    complete = detaillee;
    const tarif = detaillee.shipping_cost?.shipping_rate;
    if (tarif && typeof tarif !== "string") {
      modeLivraison = tarif.display_name ?? null;
    }
  } catch (e) {
    /* Sans le détail, on envoie quand même : le total suffit à rassurer. */
    console.error("[commande] détail illisible", numero, e);
  }

  const envoye = await envoyerConfirmation(complete, lignes, numero, modeLivraison);
  if (!envoye) {
    console.error(
      "[commande] confirmation NON envoyée — à reprendre à la main",
      numero,
      client?.email
    );
  }
}
