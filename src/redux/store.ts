import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/redux/features/cart/cartSlice';
import wishlistReducer from '@/redux/features/wishlist/wishlistSlice';
import productReducer from '@/redux/features/product/productSlice';
import orderReducer from '@/redux/features/order/orderSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    orderlist: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
