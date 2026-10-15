import { ICartItem, IProduct, IProductOption } from '@/types/api_types';
import { IWishlistItem } from '@/redux/features/wishlist/wishlistSlice';

// Chosen value label per option name, e.g. { Capacity: '9.6 kWh', Color: 'Black' }.
export type OptionSelection = Record<string, string>;

// An option named Color or Colour shows swatches and can switch the product image.
export const isColorOption = (option: Pick<IProductOption, 'name'>) =>
  /^colou?rs?$/i.test(option.name.trim());

export const defaultSelection = (product: Pick<IProduct, 'options'>): OptionSelection =>
  Object.fromEntries(
    (product.options ?? [])
      .filter((option) => option.values.length > 0)
      .map((option) => [option.name, option.values[0].label]),
  );

const chosenValues = (product: Pick<IProduct, 'options'>, selection: OptionSelection) =>
  (product.options ?? []).flatMap((option) => {
    const value = option.values.find((v) => v.label === selection[option.name]);
    return value ? [{ option, value }] : [];
  });

// Product price plus the additional price of every chosen option value.
export const variantPrice = (
  product: Pick<IProduct, 'price' | 'options'>,
  selection: OptionSelection,
) =>
  product.price + chosenValues(product, selection).reduce((sum, c) => sum + c.value.priceDelta, 0);

export const variantLabel = (product: Pick<IProduct, 'options'>, selection: OptionSelection) =>
  chosenValues(product, selection)
    .map(({ option, value }) => `${option.name}: ${value.label}`)
    .join(' / ');

// The image linked to the chosen colour, if any.
export const variantImage = (product: Pick<IProduct, 'options'>, selection: OptionSelection) =>
  chosenValues(product, selection).find((c) => isColorOption(c.option) && c.value.image)?.value
    .image;

// Lowest and highest price across every option combination.
export const priceRange = (product: Pick<IProduct, 'price' | 'options'>) => {
  const options = (product.options ?? []).filter((option) => option.values.length > 0);
  const deltas = options.map((option) => option.values.map((value) => value.priceDelta));
  return {
    min: product.price + deltas.reduce((sum, d) => sum + Math.min(...d), 0),
    max: product.price + deltas.reduce((sum, d) => sum + Math.max(...d), 0),
  };
};

export const hasOptions = (product: Pick<IProduct, 'options'>) =>
  (product.options ?? []).some((option) => option.values.length > 0);

// The catalog has no sales counts, so `sold` stays 0 rather than showing invented numbers.
export const toCartItem = (
  product: IProduct,
  quantity = 1,
  selection: OptionSelection = defaultSelection(product),
): ICartItem => {
  const variant = hasOptions(product) ? variantLabel(product, selection) : '';
  return {
    id: variant ? `${product.id}:${variant}` : product.id,
    productId: product.id,
    variant: variant || undefined,
    title: product.title,
    price: variantPrice(product, selection),
    rating: product.rating,
    sold: 0,
    quantity,
    image:
      variantImage(product, selection) ||
      product.thumbnail ||
      product.images[0] ||
      '/placeholder.svg',
  };
};

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

export const isDraft = (product: Pick<IProduct, 'status'>) => product.status === 'draft';
