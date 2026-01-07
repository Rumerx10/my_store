import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ICartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface ICart {
  items: ICartItem[];
}

const initialState: ICart = {
  items: [],
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
    removeFromCart(state, action: PayloadAction<string>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    reduceQuantityFromCart(state, action: PayloadAction<string>) {
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

export const { addToCart, removeFromCart, reduceQuantityFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
