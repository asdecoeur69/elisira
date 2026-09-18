"use client";

import { useState } from "react";
import { useLocalCart } from "@/lib/cart/LocalCartProvider";

type Props = {
  merchandiseId: string;
  quantity?: number;
  label?: string;
  className?: string;
};

/**
 * Ajout au panier. Retour visuel bref après le clic : sans lui,
 * le visiteur ne sait pas si son geste a été pris en compte.
 */
export function AddToCartButton({
  merchandiseId,
  quantity = 1,
  label = "Ajouter au panier",
  className = "",
}: Props) {
  const { linesAdd } = useLocalCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    linesAdd([{ merchandiseId, quantity }]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-[var(--radius-sm)] bg-[var(--color-terracotta)] px-9 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)] ${className}`}
    >
      {added ? "Ajouté ✓" : label}
    </button>
  );
}
