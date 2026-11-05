import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError, uploadImage } from '@/lib/api/client';
import { toProduct } from '@/lib/api/mappers';
import type { ApiCategory, ApiProduct, Page } from '@/lib/api/types';
import type { IProduct } from '@/types/api_types';
import { qk } from './keys';
import { useCategories } from './shop';

// The whole catalogue, a page of 100 at a time: a store has up to about a thousand products,
// and the storefront filters and sorts them in the browser. Staff also get drafts and
// archived products (the API decides by the signed-in role).
const fetchCatalog = async () => {
  const all: IProduct[] = [];
  for (let page = 1; ; page++) {
    const result = await api<Page<ApiProduct>>(`/products?limit=100&page=${page}`);
    all.push(...result.data.map(toProduct));
    if (page >= result.meta.totalPages) break;
  }
  return all;
};

export const useCatalog = () => useQuery({ queryKey: qk.catalog, queryFn: fetchCatalog });

const isActive = (product: IProduct) => (product.status ?? 'active') === 'active';
const onlyActive = (products: IProduct[]) => products.filter(isActive);

// What shoppers can buy: active products only, even when staff are browsing the store.
export const useStoreProducts = () =>
  useQuery({ queryKey: qk.catalog, queryFn: fetchCatalog, select: onlyActive });

// One product with its description and specs, which lists leave out. Shows the list's copy
// while the full product loads.
export const useProduct = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: qk.product(id ?? ''),
    queryFn: async () => toProduct(await api<ApiProduct>(`/products/${id}`)),
    enabled: Boolean(id),
    placeholderData: () =>
      queryClient.getQueryData<IProduct[]>(qk.catalog)?.find((product) => product.id === id),
  });
};

export const isNotFound = (error: unknown) => error instanceof ApiError && error.status === 404;

// The admin form's product as the API's create/update body. Picked images are uploaded
// first; the category is sent by id.
const toProductInput = async (product: IProduct, categories: ApiCategory[]) => {
  const category = categories.find((c) => c.slug === product.category);
  if (!category) throw new Error('Choose a category that exists in the store');
  const images = await Promise.all(product.images.map(uploadImage));
  return {
    title: product.title,
    sku: product.sku,
    categoryId: category.id,
    price: product.price,
    discountPercent: product.discountPercentage,
    costPrice: product.costPerItem ?? null,
    stock: product.stock,
    status: (product.status ?? 'active').toUpperCase(),
    description: product.description,
    brand: product.brand ?? '',
    barcode: product.meta?.barcode ?? '',
    weight: product.weight || null,
    warrantyInfo: product.warrantyInformation || undefined,
    tags: product.tags,
    highlights: product.highlights ?? [],
    specs: product.specs ?? [],
    popular: product.popular,
    trending: product.trending,
    latest: product.latest,
    images: images.map((url) => ({ url })),
    options: await Promise.all(
      (product.options ?? []).map(async (option) => ({
        name: option.name,
        values: await Promise.all(
          option.values.map(async (value) => ({
            label: value.label,
            priceDelta: value.priceDelta,
            ...(value.swatch ? { swatch: value.swatch } : {}),
            ...(value.image ? { imageUrl: await uploadImage(value.image) } : {}),
          })),
        ),
      })),
    ),
  };
};

// Creates the product when it has no id from the API yet, else saves the changes.
export const useSaveProduct = () => {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();
  return useMutation({
    mutationFn: async ({ product, isNew }: { product: IProduct; isNew: boolean }) => {
      const body = await toProductInput(product, categories);
      const saved = await api<ApiProduct>(isNew ? '/products' : `/products/${product.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        body,
      });
      return toProduct(saved);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(qk.product(saved.id), saved);
      queryClient.invalidateQueries({ queryKey: qk.catalog });
    },
  });
};

// Deleted, or archived when orders used it: the API decides and the list shows the result.
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.catalog }),
  });
};

export interface BulkProductChange {
  id: string;
  price?: number;
  discountPercent?: number;
  costPrice?: number | null;
  stock?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

export interface ProductFieldsChange extends BulkProductChange {
  title?: string;
  sku?: string;
  categoryId?: string;
  brand?: string;
  tags?: string[];
}

// The bulk editor's save. Price, discount, cost, stock and status changes go together in one
// all-or-nothing request; rows whose title, SKU, category, vendor or tags changed are then
// saved one by one. Resolves with how many products were saved.
export const useSaveProductChanges = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bulk,
      single,
    }: {
      bulk: BulkProductChange[];
      single: ProductFieldsChange[];
    }) => {
      if (bulk.length > 0) await api('/products/bulk', { method: 'PATCH', body: { items: bulk } });
      for (const { id, ...fields } of single) {
        await api(`/products/${id}`, { method: 'PATCH', body: fields });
      }
      return bulk.length + single.length;
    },
    // Some rows may have saved before one failed: show what the server has either way.
    onSettled: () => queryClient.invalidateQueries({ queryKey: qk.catalog }),
  });
};
