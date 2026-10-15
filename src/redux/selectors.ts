import { createSelector } from '@reduxjs/toolkit';
import { isDraft } from '@/lib/products';
import type { RootState } from './store';

// Products customers can see: everything except drafts. Memoised so lists don't re-render needlessly.
export const selectStoreProducts = createSelector(
  [(state: RootState) => state.products],
  (products) => products.filter((product) => !isDraft(product)),
);
