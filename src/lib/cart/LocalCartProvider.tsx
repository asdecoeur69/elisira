"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LOCAL_PRODUCTS } from "@/lib/catalog/local";
import { QUANTITE_MAX } from "@/lib/commerce/tarifs";
import type { ShopifyProduct, ShopifyProductVariant } from "@/lib/catalog/types";

/**
 * Panier local — fonctionne sans Shopify.
 *
 * Tant que la boutique n'est pas branchée, le panier vit dans le
 * navigateur du visiteur : on peut ajouter, modifier les quantités et
 * retirer des articles, et tout le parcours est vérifiable.
 *
 * Le jour où Shopify est connecté, c'est `linesAdd` de Hydrogen qui
 * reprend la main (voir useCartBridge) et le checkout part chez eux.
 * L'interface publique de ce provider est volontairement proche de
 * celle de Hydrogen pour que la bascule soit indolore.
 *
 * Le stockage peut échouer (navigation privée, cookies bloqués) : chaque
 * accès est enveloppé, et en cas d'échec le panier reste simplement en
 * mémoire pour la session.
 */

const STORAGE_KEY = "elisira-cart";

export type LocalCartLine = {
  /** id de la variante — même identifiant que côté Shopify */
  merchandiseId: string;
  quantity: number;
};

export type ResolvedLine = LocalCartLine & {
  product: ShopifyProduct;
  variant: ShopifyProductVariant;
  lineTotal: number;
};

type CartContextValue = {
  lines: LocalCartLine[];
  resolved: ResolvedLine[];
  totalQuantity: number;
  subtotal: number;
  currency: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  linesAdd: (lines: LocalCartLine[]) => void;
  setQuantity: (merchandiseId: string, quantity: number) => void;
  removeLine: (merchandiseId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Retrouve produit + variante à partir d'un id de variante. */
function resolveVariant(merchandiseId: string) {
  for (const product of LOCAL_PRODUCTS) {
    const variant = product.variants.edges.find(
      (e) => e.node.id === merchandiseId
    )?.node;
    if (variant) return { product, variant };
  }
  return null;
}

export function LocalCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<LocalCartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Relecture du panier au montage (jamais pendant le rendu serveur).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(
            parsed
              .filter(
                (l): l is LocalCartLine =>
                  typeof l === "object" &&
                  l !== null &&
                  typeof (l as LocalCartLine).merchandiseId === "string" &&
                  typeof (l as LocalCartLine).quantity === "number"
              )
              /* Un panier vieilli ou bricolé à la main peut dépasser la
                 borne du serveur : on le ramène dans les clous ici, sinon
                 le refus n'arriverait qu'au moment de payer. */
              .map((l) => ({
                ...l,
                quantity: Math.min(Math.max(Math.trunc(l.quantity), 1), QUANTITE_MAX),
              }))
          );
        }
      }
    } catch {
      /* stockage indisponible : panier en mémoire seulement */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* idem */
    }
  }, [lines, hydrated]);

  // Tiroir ouvert : on bloque le défilement de la page derrière.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const linesAdd = useCallback((incoming: LocalCartLine[]) => {
    setLines((prev) => {
      const next = [...prev];
      for (const line of incoming) {
        if (line.quantity <= 0) continue;
        const i = next.findIndex((l) => l.merchandiseId === line.merchandiseId);
        /* Plafonné à la borne du serveur : sans cela, le client peut
           dépasser et n'apprendre le refus qu'au moment de payer. */
        if (i >= 0) {
          next[i] = {
            ...next[i],
            quantity: Math.min(next[i].quantity + line.quantity, QUANTITE_MAX),
          };
        } else {
          next.push({
            ...line,
            quantity: Math.min(line.quantity, QUANTITE_MAX),
          });
        }
      }
      return next;
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((merchandiseId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.merchandiseId !== merchandiseId)
        : prev.map((l) =>
            l.merchandiseId === merchandiseId
              ? { ...l, quantity: Math.min(quantity, QUANTITE_MAX) }
              : l
          )
    );
  }, []);

  const removeLine = useCallback((merchandiseId: string) => {
    setLines((prev) => prev.filter((l) => l.merchandiseId !== merchandiseId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const resolved = useMemo<ResolvedLine[]>(() => {
    return lines.flatMap((line) => {
      const found = resolveVariant(line.merchandiseId);
      if (!found) return [];
      const unit = parseFloat(found.variant.price.amount);
      return [
        {
          ...line,
          product: found.product,
          variant: found.variant,
          lineTotal: unit * line.quantity,
        },
      ];
    });
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      resolved,
      totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: resolved.reduce((sum, l) => sum + l.lineTotal, 0),
      currency: resolved[0]?.variant.price.currencyCode ?? "CHF",
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      linesAdd,
      setQuantity,
      removeLine,
      clear,
    }),
    [lines, resolved, isOpen, linesAdd, setQuantity, removeLine, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useLocalCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useLocalCart doit être utilisé dans <LocalCartProvider>");
  }
  return ctx;
}

/** Formatage monétaire suisse : CHF 30.— */
/**
 * Prix au format suisse : `CHF 30.—` pour un montant rond, `CHF 67,50`
 * sinon. Une seule convention sur tout le site — un point décimal au
 * milieu de montants en `.—` accroche l'œil pour rien.
 */
export function formatPrice(amount: number, currency = "CHF") {
  const rounded = Math.round(amount * 100) / 100;
  const isWhole = Number.isInteger(rounded);
  return `${currency} ${
    isWhole ? `${rounded}.—` : rounded.toFixed(2).replace(".", ",")
  }`;
}
