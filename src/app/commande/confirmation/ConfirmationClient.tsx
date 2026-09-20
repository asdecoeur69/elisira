"use client";

import { useEffect, useRef } from "react";
import { useLocalCart } from "@/lib/cart/LocalCartProvider";

/**
 * Vide le panier après une commande payée.
 *
 * Le récapitulatif affiché vient désormais de Stripe (voir page.tsx) :
 * ce composant n'a plus rien à afficher, il ne fait que nettoyer le
 * panier local une fois le paiement confirmé.
 */
export function ViderPanier() {
  const { resolved, removeLine } = useLocalCart();
  const fait = useRef(false);

  useEffect(() => {
    if (fait.current) return;
    if (resolved.length === 0) return; // pas encore hydraté, ou déjà vide
    fait.current = true;
    resolved.forEach((l) => removeLine(l.merchandiseId));
  }, [resolved, removeLine]);

  return null;
}
