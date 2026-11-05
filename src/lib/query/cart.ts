import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api/client';
import { toCartItems } from '@/lib/api/mappers';
import type { ApiCart } from '@/lib/api/types';
import type { ICartItem } from '@/types/api_types';
import { qk } from './keys';

// Matches the "Max 10 per order" limit shown on product pages.
export const MAX_QUANTITY_PER_ITEM = 10;

export interface CartData {
  items: ICartItem[];
  subtotal: number;
  itemCount: number;
}

const toCart = (cart: ApiCart): CartData => ({
  items: toCartItems(cart),
  subtotal: Number(cart.subtotal),
  itemCount: cart.itemCount,
});

export const EMPTY_CART: CartData = { items: [], subtotal: 0, itemCount: 0 };

// The cart lives on the server, for guests too (their guest token finds it), so it survives
// reloads and devices. Every change answers with the whole cart, priced again.
export const useCart = () =>
  useQuery({
    queryKey: qk.cart,
    queryFn: async () => toCart(await api<ApiCart>('/cart')),
    staleTime: 30_000,
  });

const withQuantity = (cart: CartData, lineId: string, quantity: number): CartData => {
  const items =
    quantity > 0
      ? cart.items.map((item) => (item.id === lineId ? { ...item, quantity } : item))
      : cart.items.filter((item) => item.id !== lineId);
  return {
    items,
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

// Cart changes run one at a time (scope), so answers can't arrive out of order. Quantity
// changes and removals show at once and are undone if the server refuses them.
export const useCartActions = () => {
  const queryClient = useQueryClient();
  const save = (cart: ApiCart) => queryClient.setQueryData(qk.cart, toCart(cart));
  const scope = { id: 'cart' };

  const add = useMutation({
    scope,
    mutationFn: (item: ICartItem) =>
      api<ApiCart>('/cart/items', {
        method: 'POST',
        body: {
          productId: item.productId ?? item.id,
          variant: item.variant,
          quantity: item.quantity || 1,
        },
      }),
    onSuccess: save,
  });

  const setQuantity = useMutation({
    scope,
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
      quantity > 0
        ? api<ApiCart>(`/cart/items/${lineId}`, { method: 'PATCH', body: { quantity } })
        : api<ApiCart>(`/cart/items/${lineId}`, { method: 'DELETE' }),
    onMutate: async ({ lineId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: qk.cart });
      const previous = queryClient.getQueryData<CartData>(qk.cart);
      if (previous) queryClient.setQueryData(qk.cart, withQuantity(previous, lineId, quantity));
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(qk.cart, context.previous);
    },
    onSuccess: save,
  });

  const clear = useMutation({
    scope,
    mutationFn: () => api<ApiCart>('/cart', { method: 'DELETE' }),
    onSuccess: save,
  });

  return {
    // Adds the line and says so (`message: false` for no toast). Failures show their reason.
    addToCart: (item: ICartItem, message?: string | false) =>
      add.mutateAsync(item).then(
        () => {
          if (message !== false) toast.success(message ?? `Added to cart: ${item.title}`);
        },
        () => undefined,
      ),
    setQuantity: (lineId: string, quantity: number) =>
      setQuantity.mutate({
        lineId,
        quantity: Math.min(Math.max(quantity, 0), MAX_QUANTITY_PER_ITEM),
      }),
    remove: (lineId: string) => setQuantity.mutate({ lineId, quantity: 0 }),
    clear: () => clear.mutateAsync(),
    // After checkout the server has already emptied the cart.
    emptied: () => queryClient.setQueryData(qk.cart, EMPTY_CART),
    adding: add.isPending,
  };
};
