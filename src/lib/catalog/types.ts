export type Connection<T> = {
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
};

export type ShopifyMoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SEO = {
  title: string | null;
  description: string | null;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  image: ShopifyImage | null;
  sku: string | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  productType: string;
  vendor: string;
  tags: string[];
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
  variants: Connection<ShopifyProductVariant>;
  images: Connection<ShopifyImage>;
  featuredImage: ShopifyImage | null;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: ShopifyImage | null;
  seo: SEO;
  products: Connection<ShopifyProduct>;
  updatedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
      vendor: string;
    };
    price: ShopifyMoneyV2;
    compareAtPrice: ShopifyMoneyV2 | null;
    image: ShopifyImage | null;
  };
  cost: {
    totalAmount: ShopifyMoneyV2;
    amountPerQuantity: ShopifyMoneyV2;
    compareAtAmountPerQuantity: ShopifyMoneyV2 | null;
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoneyV2;
    totalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2 | null;
  };
  lines: Connection<CartLine>;
  discountCodes: Array<{
    code: string;
    applicable: boolean;
  }>;
  buyerIdentity: {
    email: string | null;
    phone: string | null;
    countryCode: string | null;
  };
};

export type ShopifyPage = {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
};
