import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { toWishlistItems } from '@/lib/api/mappers';
import type { ApiWishlist } from '@/lib/api/types';
import type { IWishlistItem } from '@/types/api_types';
import { qk } from './keys';

const fetchWishlist = async () => toWishlistItems(await api<ApiWishlist>('/wishlist'));

// Saved products, kept on the server for guests (guest token) and signed-in users alike.
export const useWishlist = () => useQuery({ queryKey: qk.wishlist, queryFn: fetchWishlist });

export const useIsWishlisted = (productId: string) =>
  useQuery({
    queryKey: qk.wishlist,
    queryFn: fetchWishlist,
    select: (items) => items.some((item) => item.id === productId),
  }).data ?? false;

const remove = (productId: string) =>
  api<ApiWishlist>(`/wishlist/items/${productId}`, { method: 'DELETE' });

export const useWishlistActions = () => {
  const queryClient = useQueryClient();
  const scope = { id: 'wishlist' };

  // The heart button: saves the product, or removes it when it's saved. Shows at once.
  const toggle = useMutation({
    scope,
    mutationFn: ({ item, saved }: { item: IWishlistItem; saved: boolean }) =>
      saved
        ? remove(item.id)
        : api<ApiWishlist>('/wishlist/items', { method: 'POST', body: { productId: item.id } }),
    onMutate: async ({ item, saved }) => {
      await queryClient.cancelQueries({ queryKey: qk.wishlist });
      const previous = queryClient.getQueryData<IWishlistItem[]>(qk.wishlist);
      queryClient.setQueryData<IWishlistItem[]>(qk.wishlist, (items = []) =>
        saved ? items.filter((i) => i.id !== item.id) : [item, ...items],
      );
      return { previous };
    },
    onError: (_error, _vars, context) => queryClient.setQueryData(qk.wishlist, context?.previous),
    onSuccess: (wishlist) => queryClient.setQueryData(qk.wishlist, toWishlistItems(wishlist)),
  });

  const clear = useMutation({
    scope,
    mutationFn: async (ids: string[]) => {
      let last: ApiWishlist | undefined;
      for (const id of ids) last = await remove(id);
      return last;
    },
    onSuccess: (wishlist) =>
      queryClient.setQueryData(qk.wishlist, wishlist ? toWishlistItems(wishlist) : []),
  });

  return {
    toggle: (item: IWishlistItem) => {
      const saved =
        queryClient.getQueryData<IWishlistItem[]>(qk.wishlist)?.some((i) => i.id === item.id) ??
        false;
      toggle.mutate({ item, saved });
    },
    clear: (ids: string[]) => clear.mutateAsync(ids),
  };
};
