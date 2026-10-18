import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MockOrders } from '@/docs/Orders';
import type { Order } from '@/types/order';

// Orders as the seller sees them. Seeded from the mock data; changes last until the page reloads.
const adminOrderSlice = createSlice({
  name: 'adminOrders',
  initialState: MockOrders,
  reducers: {
    // e.g. cash on delivery: the courier hands over the cash, so the order is marked paid.
    setPaymentStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order['paymentStatus'] }>,
    ) => {
      const order = state.find((o) => o.id === action.payload.id);
      if (!order) return;
      order.paymentStatus = action.payload.status;
      order.paidAt = action.payload.status === 'paid' ? new Date().toISOString() : undefined;
    },
  },
});

export const { setPaymentStatus } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
