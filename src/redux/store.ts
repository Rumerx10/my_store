import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '@/redux/features/search/searchSlice';
import cartReducer from '@/redux/features/cart/cartSlice';
import wishlistReducer from '@/redux/features/wishlist/wishlistSlice';
import productReducer from '@/redux/features/product/productSlice';
import orderReducer from '@/redux/features/order/orderSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    orderlist: orderReducer,
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
