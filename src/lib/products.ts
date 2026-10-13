import { ICartItem, IProduct } from '@/types/api_types';
import { IWishlistItem } from '@/redux/features/wishlist/wishlistSlice';

// The catalog has no sales counts, so `sold` stays 0 rather than showing invented numbers.
export const toCartItem = (product: IProduct, quantity = 1): ICartItem => ({
  id: product.id,
  title: product.title,
  price: product.price,
  rating: product.rating,
  sold: 0,
  quantity,
  image: product.thumbnail || product.images[0] || '/placeholder.svg',
});

export const toWishlistItem = (product: IProduct): IWishlistItem => ({
  id: product.id,
  title: product.title,
  price: product.price,
  rating: product.rating,
  sold: 0,
  stock: product.stock,
  image: product.thumbnail || product.images[0] || '/placeholder.svg',
});

// Price before discount, for the struck-through "was" price.
export const originalPrice = (product: Pick<IProduct, 'price' | 'discountPercentage'>) =>
  product.price / (1 - product.discountPercentage / 100);

// Only call out discounts that are worth showing.
export const hasNotableDiscount = (product: Pick<IProduct, 'discountPercentage'>) =>
  product.discountPercentage >= 5;
