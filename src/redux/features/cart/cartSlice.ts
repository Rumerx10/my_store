import { ICartItem } from '@/types/api_types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ICart {
  items: ICartItem[];
  // Checkout choices made in the cart, carried through to the order summary.
  shippingId: string;
  couponCode: string | null;
  installation: boolean;
}

// Matches the "Max 10 per order" limit shown on product pages.
export const MAX_QUANTITY_PER_ITEM = 10;

const initialState: ICart = {
  items: [
    {
      id: 5,
      title: 'GoodWe DNS G4 Single-phase Inverter 5kW',
      price: 105000,
      quantity: 1,
      image: 'https://en.goodwe.com/Public/Uploads/uploadfile/images/20250523/DNSG4-1.png',
      rating: 4.8,
      sold: 0,
    },
  ],
  shippingId: 'standard',
  couponCode: null,
  installation: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      const quantity = Math.max(1, action.payload.quantity || 1);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY_PER_ITEM);
      } else {
        state.items.push({
          ...action.payload,
          quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM),
        });
      }
    },
    removeFromCart(state, action: PayloadAction<string | number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantityInCart(state, action: PayloadAction<string | number>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return;
      item.quantity = Math.min(item.quantity + 1, MAX_QUANTITY_PER_ITEM);
    },
    reduceQuantityFromCart(state, action: PayloadAction<string | number>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity === 0) {
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
    setShipping(state, action: PayloadAction<string>) {
      state.shippingId = action.payload;
    },
    applyCoupon(state, action: PayloadAction<string>) {
      state.couponCode = action.payload;
    },
    removeCoupon(state) {
      state.couponCode = null;
    },
    setInstallation(state, action: PayloadAction<boolean>) {
      state.installation = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
      state.installation = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantityInCart,
  reduceQuantityFromCart,
  setShipping,
  applyCoupon,
  removeCoupon,
  setInstallation,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
