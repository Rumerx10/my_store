import { IOrderItem } from '@/types/api_types';

const initialState = {
  id: '',
  items:
    IOrderItem[
      {
        productId: 5,
        title: 'Red Nail Polish',
        price: 8.99,
        quantity: 1,
        image: 'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp',
      }
    ],
  totalAmount: 0,
  status: 'pending',
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
