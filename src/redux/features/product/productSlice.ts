import { Products } from '@/docs/api_products';
import { createSlice } from '@reduxjs/toolkit';

const initialState = Products;

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
