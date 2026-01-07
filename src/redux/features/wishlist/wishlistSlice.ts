import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IWishlistItem {
  id: string;
  title: string;
  price: number;
  rating: number;
  sold: number;
  image: string;
}

interface IWishlist {
  items: IWishlistItem[];
}

const initialState: IWishlist = {
  items: [],
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
    removeFromWishlist(state, action: PayloadAction<string>) {
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
