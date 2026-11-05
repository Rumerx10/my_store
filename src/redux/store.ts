import { configureStore } from '@reduxjs/toolkit';
import checkoutReducer from '@/redux/features/checkout/checkoutSlice';

// Client-side state only. Everything that comes from the API (catalogue, cart, wishlist,
// orders, account, dashboards) is cached by React Query in lib/query/.
export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
