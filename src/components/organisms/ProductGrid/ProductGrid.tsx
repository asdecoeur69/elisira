"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/animations";
import { ProductCard } from "@/components/molecules/ProductCard";
import type { ShopifyProduct } from "@/lib/catalog/types";

export interface ProductGridProps {
  products: ShopifyProduct[];
  columns?: 3 | 4;
  className?: string;
}

function ProductGrid({ products, columns = 4, className }: ProductGridProps) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2",
        columns === 4 && "lg:grid-cols-3 xl:grid-cols-4",
        columns === 3 && "lg:grid-cols-3",
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          priority={index < 4}
        />
      ))}
    </m.div>
  );
}

export { ProductGrid };
