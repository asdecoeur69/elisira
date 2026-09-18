export type {
  Connection,
  ShopifyMoneyV2,
  ShopifyImage,
  SEO,
  ShopifyProductVariant,
  ShopifyProduct,
  ShopifyCollection,
  CartLine,
  ShopifyCart,
  ShopifyPage,
} from '@/lib/catalog/types';

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type Testimonial = {
  id: string;
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
};

export type SocialLink = {
  platform: string;
  url: string;
  label: string;
};

export type BannerSlide = {
  id: string;
  heading: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  image: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
};
