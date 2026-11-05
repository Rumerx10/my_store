// Product Review Interface
interface IProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

// Product Dimensions Interface
interface IProductDimensions {
  width: number;
  height: number;
  depth: number;
}

// Product Meta Information Interface
interface IProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}
export interface IProduct {
  // UUID from the API.
  id: string;
  slug?: string;
  ratingCount?: number;
  popular: boolean;
  trending: boolean;
  latest: boolean;
  title: string;
  description: string;
  // Category slug, and its name as the store calls it.
  category: string;
  categoryName?: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: IProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: IProductMeta;
  images: string[];
  thumbnail: string;
  createdAt?: string;
  // Short selling points and model-specific specs, shown on the product page.
  highlights?: string[];
  specs?: [string, string][];
  // What one unit costs the store; only shown in the admin (profit and margin).
  costPerItem?: number;
  // Drafts are hidden from the storefront. Missing means active.
  status?: ProductStatus;
  // Shopify-style options, e.g. Capacity or Color, each value adding to the price.
  options?: IProductOption[];
}

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface IProductOptionValue {
  label: string;
  // Added to the product price when this value is chosen.
  priceDelta: number;
  // Colour options only: swatch colour and the product image to show when chosen.
  swatch?: string;
  image?: string;
}

export interface IProductOption {
  name: string;
  values: IProductOptionValue[];
}

export interface ICartItem {
  // The cart line id from the API.
  id: string;
  productId?: string;
  // Why the line can't be bought as it is (from the API), e.g. not_enough_stock.
  problem?: string | null;
  stock?: number;
  // Chosen options, e.g. "Capacity: 9.6 kWh / Color: Black".
  variant?: string;
  title: string;
  price: number;
  rating: number;
  sold: number;
  quantity: number;
  image: string;
}

// A saved product, as the wishlist API lists it.
export interface IWishlistItem {
  id: string;
  title: string;
  price: number;
  rating: number;
  sold: number;
  stock: number;
  image: string;
}
