import { ICartItem } from '@/types/api_types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ICart {
  items: ICartItem[];
}

const initialState: ICart = {
  items: [
    {
      id: 5,
      title: 'Red Nail Polish',
      price: 8.99,
      quantity: 1,
      image: 'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp',
      rating: 4.32,
      sold: 21,
    },
  ],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload });
      }
    },
    removeFromCart(state, action: PayloadAction<string | number>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantityInCart(state, action: PayloadAction<string | number>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return;
      item.quantity += 1;
    },
    reduceQuantityFromCart(state, action: PayloadAction<string | number>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity === 0) {
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantityInCart,
  reduceQuantityFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
