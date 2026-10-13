import { Products } from './api_products';

// Derived from the catalog so filters always match the products that exist.
export const CATEGORIES = Array.from(new Set(Products.map((p) => p.category)));
export const BRANDS = Array.from(
  new Set(Products.map((p) => p.brand).filter((brand): brand is string => Boolean(brand))),
).sort();

// Round the most expensive product up so the price filter never hides items.
export const PRICE_CEILING = Math.ceil(Math.max(...Products.map((p) => p.price)) / 100) * 100;
