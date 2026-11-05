import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Choices made in the cart and carried to checkout. The cart itself lives on the server
// (lib/query/cart.ts); this is only what the shopper picked on the way.
export interface CheckoutState {
  shippingId: string;
  couponCode: string | null;
  // What the API says the coupon takes off the current subtotal.
  couponDiscount: number;
  installation: boolean;
}

export const initialCheckout: CheckoutState = {
  shippingId: '',
  couponCode: null,
  couponDiscount: 0,
  installation: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: initialCheckout,
  reducers: {
    // Restores the choices saved in this tab before a reload.
    restored: (_state, action: PayloadAction<CheckoutState>) => action.payload,
    setShipping(state, action: PayloadAction<string>) {
      state.shippingId = action.payload;
    },
    couponApplied(state, action: PayloadAction<{ code: string; discount: number }>) {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon(state) {
      state.couponCode = null;
      state.couponDiscount = 0;
    },
    setInstallation(state, action: PayloadAction<boolean>) {
      state.installation = action.payload;
    },
    // After an order the coupon and installation don't carry over to the next one.
    checkoutDone(state) {
      state.couponCode = null;
      state.couponDiscount = 0;
      state.installation = false;
    },
  },
});

export const { restored, setShipping, couponApplied, removeCoupon, setInstallation, checkoutDone } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
