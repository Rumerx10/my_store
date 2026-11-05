import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ApiAddress } from '@/lib/api/types';
import { qk } from './keys';
import { useSession } from './session';

export interface AddressInput {
  label?: string;
  name: string;
  phone: string;
  district: string;
  thana: string;
  villageOrWard: string;
  addressLine?: string;
  postCode?: string;
  isDefault?: boolean;
}

// The signed-in customer's address book, the default first.
export const useAddresses = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: qk.addresses,
    queryFn: () => api<ApiAddress[]>('/addresses'),
    enabled: Boolean(user),
  });
};

export const useAddressActions = () => {
  const queryClient = useQueryClient();
  // Saving one address can change which one is the default, so the list is fetched again.
  const refresh = () => queryClient.invalidateQueries({ queryKey: qk.addresses });

  const save = useMutation({
    mutationFn: ({ id, ...input }: AddressInput & { id?: string }) =>
      id
        ? api<ApiAddress>(`/addresses/${id}`, { method: 'PATCH', body: input })
        : api<ApiAddress>('/addresses', { method: 'POST', body: input }),
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/addresses/${id}`, { method: 'DELETE' }),
    onSuccess: refresh,
  });

  const makeDefault = useMutation({
    mutationFn: (id: string) =>
      api<ApiAddress>(`/addresses/${id}`, { method: 'PATCH', body: { isDefault: true } }),
    onSuccess: refresh,
  });

  return { save, remove, makeDefault };
};
