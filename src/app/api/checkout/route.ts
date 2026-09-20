import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, paiementConfigure } from "@/lib/commerce/stripe";
import { calculerPanier, DEVISE } from "@/lib/commerce/tarifs";
import { baseConfiguree, lireStock } from "@/lib/admin/db";
import { verifierLimite, adresseAppelant } from "@/lib/commerce/limite";

/**
 * Coupon Stripe réutilisable, un par code promo.
 *
 * Auparavant chaque commande remisée appelait `coupons.create()` : une
 * requête = un coupon permanent de plus dans le compte. Sans limite, on
 * pouvait en générer des milliers en boucle. Ici l'id est déterministe
 * (`promo_ELISIRA26`) : on tente de le lire, on ne le crée qu'à sa
 * première utilisation, et toutes les commandes suivantes le réemploient.
 *
 * `percent_off` reproduit exactement la remise fractionnaire calculée
 * côté serveur (0.1 → 10 %), sans dépendre du montant, ce qui est
 * justement ce qui permet de partager un coupon unique.
 */
async function couponReutilisable(
  stripe: Stripe,
  clef: string,
  libelle: string,
  fraction: number
): Promise<string> {
  const id = `promo_${clef}`;
  try {
    await stripe.coupons.retrieve(id);
    return id;
  } catch {
    /* Absent : on le crée avec cet id précis. Si deux requêtes le créent
       en même temps, la seconde échoue (id déjà pris) — on retombe alors
       sur le coupon existant. */
    try {
      await stripe.coupons.create({
        id,
        percent_off: Math.round(fraction * 10000) / 100,
        name: libelle,
        duration: "once",
      });
    } catch {
      /* Course perdue ou déjà créé entre-temps : l'id existe désormais. */
    }
    return id;
  }
}

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

  /* Limitation de débit avant tout appel Stripe : une rafale ne doit ni
     saturer le quota d'API, ni créer des sessions et coupons à la chaîne. */
  const limite = verifierLimite(adresseAppelant(request.headers));
  if (!limite.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limite.reessayerDans) } }
    );
  }

  let corps: {
    lignes?: unknown;
    code?: unknown;
    majeur?: unknown;
    mode?: unknown;
  };
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
    panier = calculerPanier(corps.lignes, corps.code, corps.mode);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Panier invalide." },
      { status: 400 }
    );
  }

  /* Stock : dernier rempart avant le paiement.
     Le panier du visiteur peut dater d'hier, et deux personnes peuvent
     viser la dernière bouteille en même temps. On refuse ici plutôt que
     d'encaisser puis de rembourser. Un stock non saisi vaut illimité, et
     une base injoignable ne bloque pas la vente : mieux vaut vendre une
     bouteille de trop que fermer la boutique sur une panne. */
  if (baseConfiguree()) {
    try {
      const stock = await lireStock();
      const manquants = panier.lignes.filter((l) => {
        const dispo = stock[l.merchandiseId];
        return typeof dispo === "number" && dispo < l.quantity;
      });
      if (manquants.length > 0) {
        const noms = manquants.map((l) => l.titre).join(", ");
        return NextResponse.json(
          {
            error:
              manquants.length === 1
                ? `${noms} n'est plus disponible en quantité suffisante.`
                : `Ces produits ne sont plus disponibles en quantité suffisante : ${noms}.`,
          },
          { status: 409 }
        );
      }
    } catch (e) {
      console.error("[checkout] stock illisible, vente autorisée", e);
    }
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
         au client, plutôt que de la noyer dans les prix unitaires. Le
         coupon est réutilisé d'une commande à l'autre (voir
         `couponReutilisable`) au lieu d'être recréé à chaque fois. */
      ...(panier.remise > 0 && panier.code
        ? {
            discounts: [
              {
                coupon: await couponReutilisable(
                  stripe,
                  panier.code.clef,
                  panier.code.libelle,
                  panier.code.remise
                ),
              },
            ],
          }
        : {}),

      /* Une seule option, celle retenue sur le site. Stripe n'a plus de
         choix à présenter : le client l'a déjà fait, en voyant le total
         se mettre a jour. */
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name:
              panier.mode === "retrait"
                ? "Retrait à Collex-Bossy — sur rendez-vous"
                : panier.livraison === 0
                  ? "Livraison offerte"
                  : "Livraison en Suisse",
            fixed_amount: { amount: panier.livraison, currency: DEVISE },
            delivery_estimate:
              panier.mode === "retrait"
                ? {
                    minimum: { unit: "business_day", value: 1 },
                    maximum: { unit: "business_day", value: 7 },
                  }
                : {
                    minimum: { unit: "business_day", value: 2 },
                    maximum: { unit: "business_day", value: 4 },
                  },
          },
        },
      ],

      /* Suisse uniquement, conformément à la page Livraison. Ouvrir le
         Liechtenstein ici sans le dire ailleurs créerait un doute au
         moment de payer. */
      /* Demander une adresse de livraison à qui vient chercher sa
         bouteille est un obstacle inutile : Stripe recueille de toute
         façon le nom et le téléphone. */
      ...(panier.mode === "retrait"
        ? {}
        : { shipping_address_collection: { allowed_countries: ["CH"] as const } }),
      phone_number_collection: { enabled: true },

      success_url: `${origine}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origine}/commande`,

      metadata: {
        code: panier.code?.libelle ?? "",
        mode: panier.mode,
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
