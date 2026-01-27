import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IOrderItem {
  productId: string; // Changed from number to string based on your usage
  title: string;
  price: number;
  quantity: number;
  image: string; // Fixed: was 'img' in interface but 'image' in usage
}

interface IOrder {
  id: string;
  items: IOrderItem[]; // Fixed: should be array, not single object
  totalAmount: number; // Fixed: should be number, not string
  status: string;
}

interface OrderState {
  orders: IOrder[]; // Added state structure
}

const initialState: OrderState = {
  orders: [] // Empty array initially
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<IOrder>) => {
      state.orders.push(action.payload);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;