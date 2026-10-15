import { Products } from '@/docs/products';
import { IProduct } from '@/types/api_types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IProduct[] = Products;

// The catalog is static mock data; these reducers let the admin pages change it for the session.
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<IProduct>) {
      state.unshift(action.payload);
    },
    updateProduct(state, action: PayloadAction<IProduct>) {
      const index = state.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    removeProduct(state, action: PayloadAction<number>) {
      return state.filter((product) => product.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer;
