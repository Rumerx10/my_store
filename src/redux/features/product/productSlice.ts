import { products } from '@/docs/api_products';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface IProductDimensions {
  width: number;
  height: number;
  depth: number;
}

interface IProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

interface IProduct {
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
  brand: string;
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
}

const initialState = products;

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // setProducts(state, action: PayloadAction<Product[]>) {
    //   state.products = action.payload;
    // },
    // setPopularProducts(state, action: PayloadAction<Product[]>) {
    //   state.popular = action.payload;
    // },
    // setTrendingProducts(state, action: PayloadAction<Product[]>) {
    //   state.trending = action.payload;
    // },
    // setLatestProducts(state, action: PayloadAction<Product[]>) {
    //   state.latest = action.payload;
    // },
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
