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
}

export interface ICartItem {
  id: string | number;
  title: string;
  price: number;
  rating: number;
  sold: number;
  quantity: number;
  image: string;
}

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  img: string;
}
