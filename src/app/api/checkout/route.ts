import { NextRequest, NextResponse } from "next/server";
import { getStripe, paiementConfigure } from "@/lib/commerce/stripe";
import { calculerPanier, DEVISE } from "@/lib/commerce/tarifs";

/**
 * Création d'une session de paiement Stripe.
 *
 * Le navigateur envoie uniquement les lignes du panier et, le cas échéant,
 * un code promo. Les prix, la remise et les frais de port sont recalculés
 * ici à partir du catalogue : un panier trafiqué ne change pas le montant.
 */
export async function POST(request: NextRequest) {
  if (!paiementConfigure()) {
    return NextResponse.json(
      { error: "Le paiement n'est pas encore activé." },
      { status: 503 }
    );
  }

  let corps: { lignes?: unknown; code?: unknown; majeur?: unknown };
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  /* Vente d'alcool : la confirmation d'âge est une condition de vente. */
  if (corps.majeur !== true) {
    return NextResponse.json(
      { error: "La confirmation d'âge est obligatoire." },
      { status: 400 }
    );
  }

  let panier;
  try {
    panier = calculerPanier(corps.lignes, corps.code);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Panier invalide." },
      { status: 400 }
    );
  }

  const origine = request.nextUrl.origin;
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",

      /* TWINT est incontournable en Suisse ; il doit être activé dans le
         dashboard Stripe, faute de quoi Stripe refuse la session. On le
         demande explicitement plutôt que de laisser la détection
         automatique, qui ne le propose pas toujours. */
      payment_method_types: ["card", "twint"],

      line_items: panier.lignes.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: DEVISE,
          unit_amount: l.prixUnitaire,
          product_data: {
            name: l.titre,
            ...(l.image ? { images: [new URL(l.image, origine).toString()] } : {}),
          },
        },
      })),

      /* La remise passe par un coupon : Stripe l'affiche explicitement
         au client, plutôt que de la noyer dans les prix unitaires. */
      ...(panier.remise > 0
        ? {
            discounts: [
              {
                coupon: (
                  await stripe.coupons.create({
                    amount_off: panier.remise,
                    currency: DEVISE,
                    name: panier.code?.libelle ?? "Remise",
                    duration: "once",
                  })
                ).id,
              },
            ],
          }
        : {}),

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name:
              panier.livraison === 0
                ? "Livraison offerte"
                : "Livraison en Suisse",
            fixed_amount: { amount: panier.livraison, currency: DEVISE },
          },
        },
      ],

      /* Suisse uniquement, conformément à la page Livraison. Ouvrir le
         Liechtenstein ici sans le dire ailleurs créerait un doute au
         moment de payer. */
      shipping_address_collection: { allowed_countries: ["CH"] },
      phone_number_collection: { enabled: true },

      success_url: `${origine}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origine}/commande`,

      metadata: {
        code: panier.code?.libelle ?? "",
        majeur: "oui",
      },
    });

    if (!session.url) {
      throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] échec de création de session", e);
    return NextResponse.json(
      { error: "Le paiement est momentanément indisponible." },
      { status: 502 }
    );
  }
}
