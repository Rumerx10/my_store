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
      id: 16,
      title: 'GoodWe ESA All-in-One Home Energy Storage 10kW',
      price: 720000,
      rating: 4.9,
      sold: 0,
      stock: 6,
      image:
        'https://en.goodwe.com/Public/Uploads/uploadfile/images/20251014/ESA3-10KAll-in-oneSystem-1.png',
    },
  ],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
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
