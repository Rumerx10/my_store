import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { toCustomerOrder, toCustomerOrderSummary } from '@/lib/api/mappers';
import type { ApiCheckout, ApiOrder, ApiOrderSummary, CursorPage } from '@/lib/api/types';
import { qk } from './keys';
import { useSession } from './session';

// The signed-in customer's orders, newest first, 50 at a time.
export const useMyOrders = () => {
  const { user } = useSession();
  const query = useInfiniteQuery({
    queryKey: qk.myOrders,
    queryFn: ({ pageParam }) =>
      api<CursorPage<ApiOrderSummary>>(
        `/orders?limit=50${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: Boolean(user),
  });
  const orders = query.data?.pages.flatMap((page) => page.data.map(toCustomerOrderSummary));
  return { ...query, orders: orders ?? [] };
};

export const useMyOrder = (id: string) =>
  useQuery({
    queryKey: qk.myOrder(id),
    queryFn: async () => toCustomerOrder(await api<ApiOrder>(`/orders/${id}`)),
  });

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api<ApiOrder>(`/orders/${id}/cancel`, { method: 'POST', body: { reason } }),
    onSuccess: (order) => {
      queryClient.setQueryData(qk.myOrder(order.id), toCustomerOrder(order));
      queryClient.invalidateQueries({ queryKey: qk.myOrders, exact: true });
      // Cancelling puts the stock back.
      queryClient.invalidateQueries({ queryKey: qk.catalog });
    },
  });
};

export interface CheckoutInput {
  idempotencyKey: string;
  shippingRateId: string;
  paymentMethod: 'COD';
  couponCode?: string;
  installation?: boolean;
  note?: string;
  addressId?: string;
  address?: {
    name: string;
    phone: string;
    district: string;
    thana: string;
    villageOrWard: string;
    addressLine?: string;
    postCode?: string;
  };
  saveAddress?: boolean;
  // Guests only: the account the order creates.
  name?: string;
  phone?: string;
  password?: string;
  email?: string;
}

// Places the order from the cart. The same idempotencyKey on a retry returns the same order.
// The page shows the error itself, with the cart lines that can't be bought.
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { toast: false },
    mutationFn: ({ idempotencyKey, ...body }: CheckoutInput) =>
      api<ApiCheckout>('/checkout', {
        method: 'POST',
        body,
        headers: { 'Idempotency-Key': idempotencyKey },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.myOrders, exact: true });
      queryClient.invalidateQueries({ queryKey: qk.catalog });
      queryClient.invalidateQueries({ queryKey: qk.toReview });
    },
  });
};
