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
  id: number;
  popular: boolean;
  trending: boolean;
  latest: boolean;
  title: string;
  description: string;
  category: string;
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

export type ProductStatus = 'active' | 'draft';

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
  // Product id, or `${productId}:${variant}` when the product has options.
  id: string | number;
  productId?: number;
  // Chosen options, e.g. "Capacity: 9.6 kWh / Color: Black".
  variant?: string;
  title: string;
  price: number;
  rating: number;
  sold: number;
  quantity: number;
  image: string;
}
