"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { useLocalCart } from "@/lib/cart/LocalCartProvider";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Typography";
import { fadeInUp } from "@/lib/animations";
import type { ShopifyProduct } from "@/lib/catalog/types";

export interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
  className?: string;
  index?: number;
}

function ProductCard({ product, priority = false, className, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { linesAdd } = useLocalCart();
  
  const router = useRouter();

  // If only one variant and no options to choose → add directly; otherwise go to PDP
  const variants = product.variants.edges.map((e) => e.node);
  const hasOnlyDefaultVariant =
    variants.length === 1 &&
    variants[0].selectedOptions.length === 1 &&
    variants[0].selectedOptions[0].name === "Title";

  const handleQuickAdd = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (hasOnlyDefaultVariant && variants[0].id) {
        linesAdd([{ merchandiseId: variants[0].id, quantity: 1 }]);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      } else {
        router.push(`/products/${product.handle}`);
      }
    },
    [hasOnlyDefaultVariant, variants, linesAdd, router, product.handle]
  );

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = parseFloat(
    product.compareAtPriceRange.minVariantPrice.amount
  );
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;
  const hasDiscount = compareAtPrice > 0 && compareAtPrice > price;
  const isNew = product.tags.includes("new");
  const isSoldOut = !product.availableForSale;

  const featuredImage = product.featuredImage;

  return (
    <m.div
      variants={fadeInUp}
      whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/products/${product.handle}`}
        className="block"
        aria-label={product.title}
      >
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden rounded-sm bg-iron-900">
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.altText ?? product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-iron-800">
              <Text color="muted" size="sm">
                No image
              </Text>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isSoldOut && (
              <Badge variant="default" size="sm">
                Sold Out
              </Badge>
            )}
            {isNew && !isSoldOut && (
              <Badge variant="accent" size="sm">
                New
              </Badge>
            )}
            {hasDiscount && !isSoldOut && (
              <Badge variant="success" size="sm">
                Sale
              </Badge>
            )}
          </div>

          {/* Quick Add overlay */}
          <AnimatePresence>
            {isHovered && !isSoldOut && (
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 bottom-0 p-3"
              >
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={handleQuickAdd}
                >
                  {added
                    ? "✓ Ajouté"
                    : hasOnlyDefaultVariant
                    ? "Ajouter"
                    : "Choisir options"}
                </Button>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1">
          <Text
            as="span"
            size="xs"
            color="muted"
            className="uppercase tracking-wider"
          >
            {product.productType}
          </Text>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-bone">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-bold",
                isSoldOut ? "text-iron-500" : "text-bone"
              )}
            >
              {formatPrice(price, currencyCode)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-iron-500 line-through">
                {formatPrice(compareAtPrice, currencyCode)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </m.div>
  );
}

export { ProductCard };
