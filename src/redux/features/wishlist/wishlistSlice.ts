import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IWishlistItem {
  id: string | number;
  title: string;
  price: number;
  rating: number;
  sold: number;
  stock: number;
  image: string;
}

interface IWishlist {
  items: IWishlistItem[];
}

const initialState: IWishlist = {
  items: [
    {
      id: 5,
      title: 'Red Nail Polish',
      price: 8.99,
      rating: 4.32,
      sold: 21,
      stock: 10,
      image: 'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp',
    },
  ],
};

const wishlistSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<IWishlistItem>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        state.items.push({ ...action.payload });
      }
    },
    removeFromWishlist(state, action: PayloadAction<string | number>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
