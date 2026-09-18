"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms/Icon";

export interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increment = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border border-iron-700",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center text-iron-400 transition-colors hover:text-bone disabled:cursor-not-allowed disabled:text-iron-700"
      >
        <Icon name="minus" size={16} />
      </button>
      <span className="flex h-11 w-12 items-center justify-center border-x border-iron-700 text-sm font-semibold tabular-nums text-bone">
        {quantity}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center text-iron-400 transition-colors hover:text-bone disabled:cursor-not-allowed disabled:text-iron-700"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export { QuantitySelector };
