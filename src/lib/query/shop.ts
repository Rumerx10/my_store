import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { absoluteUrl, api } from '@/lib/api/client';
import type {
  ApiCategory,
  ApiHomePage,
  ApiPublicCoupon,
  ApiShippingRate,
  ApiStore,
  Page,
} from '@/lib/api/types';
import { qk } from './keys';

const FIVE_MINUTES = 5 * 60_000;

// The store's name, contact details, VAT and installation fee.
export const useStore = () =>
  useQuery({
    queryKey: qk.store,
    queryFn: () => api<ApiStore>('/store'),
    staleTime: FIVE_MINUTES,
  });

const activeRates = (rates: ApiShippingRate[]) => rates.filter((rate) => rate.isActive);

// Delivery options shoppers can pick (staff are sent inactive ones too; they're left out).
export const useShippingRates = () =>
  useQuery({
    queryKey: qk.shippingRates,
    queryFn: () => api<ApiShippingRate[]>('/shipping-rates'),
    select: activeRates,
    staleTime: FIVE_MINUTES,
  });

// Staff also get hidden categories. Uploaded images come back as API paths; made absolute here.
export const useCategories = () =>
  useQuery({
    queryKey: qk.categories,
    queryFn: async () =>
      (await api<Page<ApiCategory>>('/categories?limit=100')).data.map((category) => ({
        ...category,
        imageUrl: category.imageUrl && absoluteUrl(category.imageUrl),
      })),
    staleTime: FIVE_MINUTES,
  });

const fallbackLabel = (slug: string) =>
  slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

// The store's name for a category slug, e.g. "commercial" -> "Business".
export const useCategoryLabel = () => {
  const { data } = useCategories();
  return useCallback(
    (slug: string) => data?.find((c) => c.slug === slug)?.name ?? fallbackLabel(slug),
    [data],
  );
};

// The home page: the hero and its sections (lib/api/types.ts). Staff also get the hidden
// sections, so the shop filters on `visible` itself. `initialData` comes from the server render.
export const useHomePage = (initialData?: ApiHomePage) =>
  useQuery({
    queryKey: qk.homePage,
    queryFn: () => api<ApiHomePage>('/store/home'),
    staleTime: FIVE_MINUTES,
    initialData,
  });

// Promo codes the store lists publicly (the coupons page and the hero).
export const usePublicCoupons = () =>
  useQuery({
    queryKey: qk.publicCoupons,
    queryFn: () => api<ApiPublicCoupon[]>('/coupons/public'),
    staleTime: FIVE_MINUTES,
  });

// "10% off" or "৳500 off", for a coupon's headline.
export const couponHeadline = (
  coupon: Pick<ApiPublicCoupon, 'discountType' | 'discountValue'>,
  formatPrice: (value: number) => string,
) =>
  coupon.discountType === 'PERCENTAGE'
    ? `${Number(coupon.discountValue)}% off`
    : `${formatPrice(Number(coupon.discountValue))} off`;
