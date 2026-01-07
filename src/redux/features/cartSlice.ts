import { createSlice } from '@reduxjs/toolkit';

interface ICartItem {
  id: string;
  name: string;
  img: string;
  color: string;
  quantity: number;
}
interface ICartState {
  items: ICartItem[];
}

const initialState: ICartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {},
    removeFromCart: (state, action) => {},
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
