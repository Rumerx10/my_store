import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, apiFile, saveFile, uploadImage } from '@/lib/api/client';
import { toInvoiceBatch, toStoreOrder, toStoreOrderRow } from '@/lib/api/mappers';
import type {
  ApiAnalytics,
  ApiCategory,
  ApiChatMessage,
  ApiChatThread,
  ApiConversationList,
  ApiCoupon,
  ApiDiscountType,
  ApiDomain,
  ApiHomePage,
  ApiHomePageContent,
  ApiInvoiceBatch,
  ApiMessageList,
  ApiOrder,
  ApiOrderStatus,
  ApiOrderSummary,
  ApiOrdersSummary,
  ApiPaymentStatus,
  ApiReportRange,
  ApiSalesPeriod,
  ApiReview,
  ApiShippingRate,
  ApiStoreSettings,
  ApiUser,
  CursorPage,
} from '@/lib/api/types';
import { qk } from './keys';
import { useSession } from './session';

// Every admin query waits for a staff sign-in; the pages also guard themselves.
const useStaff = () => useSession().isStaff;

const params = (values: Record<string, string | number | boolean | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  return search.toString();
};

// ---- Orders and payments --------------------------------------------------------------

export interface StoreOrderFilter {
  status?: ApiOrderStatus;
  paymentStatus?: ApiPaymentStatus;
  search?: string;
}

// The store's orders, newest first, 50 at a time; filters run on the server.
export const useStoreOrders = (filter: StoreOrderFilter = {}) => {
  const staff = useStaff();
  const query = useInfiniteQuery({
    queryKey: [...qk.admin.orders, 'list', filter],
    queryFn: ({ pageParam }) =>
      api<CursorPage<ApiOrderSummary>>(
        `/admin/orders?${params({ limit: 50, cursor: pageParam, ...filter })}`,
      ),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: staff,
  });
  const rows = query.data?.pages.flatMap((page) => page.data.map(toStoreOrderRow));
  return { ...query, rows: rows ?? [] };
};

// Counts by status and money by payment status, over all orders.
export const useStoreOrdersSummary = () =>
  useQuery({
    queryKey: [...qk.admin.orders, 'summary'],
    queryFn: () => api<ApiOrdersSummary>('/admin/orders/summary'),
    enabled: useStaff(),
  });

export const useStoreOrder = (id: string) =>
  useQuery({
    queryKey: qk.admin.order(id),
    queryFn: async () => toStoreOrder(await api<ApiOrder>(`/admin/orders/${id}`)),
    enabled: useStaff(),
  });

export const useOrderActions = () => {
  const queryClient = useQueryClient();
  const saved = (order: ApiOrder) => {
    queryClient.setQueryData(qk.admin.order(order.id), toStoreOrder(order));
    queryClient.invalidateQueries({
      queryKey: qk.admin.orders,
      predicate: (query) => query.queryKey[2] !== order.id,
    });
    queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
  };

  // PROCESSING, SHIPPED, DELIVERED, CANCELLED or RETURNED; the API checks the move.
  const changeStatus = useMutation({
    mutationFn: ({
      id,
      status,
      note,
      restock,
    }: {
      id: string;
      status: ApiOrderStatus;
      note?: string;
      restock?: boolean;
    }) =>
      api<ApiOrder>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: { status, note: note || undefined, restock },
      }),
    onSuccess: (order) => {
      saved(order);
      // Cancelled and returned orders put stock back.
      queryClient.invalidateQueries({ queryKey: qk.catalog });
    },
  });

  // Cash received (or a bank transfer), or money given back.
  const setPayment = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PAID' | 'REFUNDED' }) =>
      api<ApiOrder>(`/admin/orders/${id}/payment`, { method: 'PATCH', body: { status } }),
    onSuccess: saved,
  });

  return { changeStatus, setPayment };
};

// ---- Dashboard ------------------------------------------------------------------------

export const useAnalytics = (range: ApiReportRange) =>
  useQuery({
    queryKey: qk.admin.analytics(range),
    queryFn: () => api<ApiAnalytics>(`/admin/analytics?range=${range}`),
    enabled: useStaff(),
    placeholderData: (previous) => previous,
    refetchInterval: 5 * 60_000,
  });

// Invoices to print: chosen orders (comma-separated ids) or every order in a status.
export interface InvoiceSelection {
  ids?: string;
  status?: ApiOrderStatus;
}

export const useInvoices = (selection: InvoiceSelection) =>
  useQuery({
    queryKey: qk.admin.invoices(params({ ...selection })),
    queryFn: async () =>
      toInvoiceBatch(
        await api<ApiInvoiceBatch>(`/admin/orders/invoices?${params({ ...selection })}`),
      ),
    enabled: useStaff() && Boolean(selection.ids || selection.status),
  });

// The sales report as a PDF, for the owner (the API turns managers away).
export const useDownloadSalesReport = () =>
  useMutation({
    mutationFn: async ({ period, date }: { period: ApiSalesPeriod; date?: string }) => {
      const { blob, filename } = await apiFile(
        `/admin/reports/sales/pdf?${params({ period, date })}`,
      );
      saveFile(blob, filename ?? `sales-report-${date ?? period}.pdf`);
    },
  });

// ---- Store settings and domains -------------------------------------------------------

export const useStoreSettings = () =>
  useQuery({
    queryKey: qk.admin.settings,
    queryFn: () => api<ApiStoreSettings>('/store/settings'),
    enabled: useStaff(),
  });

export interface StoreSettingsInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string | null;
  supportHours?: string | null;
  logoUrl?: string | null;
  brandColor?: string | null;
  taxId?: string | null;
  invoiceNote?: string | null;
  taxRate?: number;
  installationFee?: number | null;
  lowStockThreshold?: number;
  notifyNewOrder?: boolean;
  notifyLowStock?: boolean;
  notifyWeeklySummary?: boolean;
}

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: StoreSettingsInput) =>
      api<ApiStoreSettings>('/store/settings', {
        method: 'PATCH',
        body: input.logoUrl ? { ...input, logoUrl: await uploadImage(input.logoUrl) } : input,
      }),
    onSuccess: (settings) => {
      queryClient.setQueryData(qk.admin.settings, settings);
      // The storefront shows the name, contact details, VAT and installation fee.
      queryClient.invalidateQueries({ queryKey: qk.store });
    },
  });
};

export const useDomains = () =>
  useQuery({
    queryKey: qk.admin.domains,
    queryFn: () => api<ApiDomain[]>('/store/domains'),
    enabled: useStaff(),
  });

export const useDomainActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: qk.admin.domains });
    queryClient.invalidateQueries({ queryKey: qk.admin.settings });
  };
  return {
    add: useMutation({
      mutationFn: (hostname: string) =>
        api<ApiDomain>('/store/domains', { method: 'POST', body: { hostname } }),
      onSuccess: refresh,
    }),
    verify: useMutation({
      mutationFn: (id: string) => api<ApiDomain>(`/store/domains/${id}/verify`, { method: 'POST' }),
      onSuccess: refresh,
    }),
    makePrimary: useMutation({
      mutationFn: (id: string) =>
        api<ApiDomain>(`/store/domains/${id}/primary`, { method: 'POST' }),
      onSuccess: refresh,
    }),
    remove: useMutation({
      mutationFn: (id: string) => api(`/store/domains/${id}`, { method: 'DELETE' }),
      onSuccess: refresh,
    }),
  };
};

// ---- Delivery options -----------------------------------------------------------------

// Staff get every rate, inactive ones too.
export const useAdminShippingRates = () =>
  useQuery({
    queryKey: qk.admin.shippingRates,
    queryFn: () => api<ApiShippingRate[]>('/shipping-rates'),
    enabled: useStaff(),
  });

export interface ShippingRateInput {
  name: string;
  description?: string;
  price: number;
  estimate?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const useShippingRateActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: qk.admin.shippingRates });
    queryClient.invalidateQueries({ queryKey: qk.shippingRates });
  };
  return {
    save: useMutation({
      mutationFn: ({ id, ...input }: Partial<ShippingRateInput> & { id?: string }) =>
        id
          ? api<ApiShippingRate>(`/shipping-rates/${id}`, { method: 'PATCH', body: input })
          : api<ApiShippingRate>('/shipping-rates', { method: 'POST', body: input }),
      onSuccess: refresh,
    }),
    remove: useMutation({
      mutationFn: (id: string) => api(`/shipping-rates/${id}`, { method: 'DELETE' }),
      onSuccess: refresh,
    }),
  };
};

// ---- Coupons --------------------------------------------------------------------------

export const useCoupons = () =>
  useQuery({
    queryKey: qk.admin.coupons,
    queryFn: () => api<ApiCoupon[]>('/coupons'),
    enabled: useStaff(),
  });

export interface CouponInput {
  code: string;
  description?: string;
  discountType: ApiDiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
  isPublic?: boolean;
}

export const useCouponActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: qk.admin.coupons });
    queryClient.invalidateQueries({ queryKey: qk.publicCoupons });
  };
  return {
    save: useMutation({
      mutationFn: ({ id, ...input }: Partial<CouponInput> & { id?: string }) =>
        id
          ? api<ApiCoupon>(`/coupons/${id}`, { method: 'PATCH', body: input })
          : api<ApiCoupon>('/coupons', { method: 'POST', body: input }),
      onSuccess: refresh,
    }),
    remove: useMutation({
      mutationFn: (id: string) => api(`/coupons/${id}`, { method: 'DELETE' }),
      onSuccess: refresh,
    }),
  };
};

// ---- Categories -----------------------------------------------------------------------

// The list is useCategories() (lib/query/shop.ts), which gives staff hidden categories too.
export interface CategoryInput {
  name: string;
  // Made from the name when left out.
  slug?: string;
  description?: string | null;
  // A picked image (data URL) is uploaded first; null removes the image.
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export const useCategoryActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: qk.categories });
    // Products carry their category's slug.
    queryClient.invalidateQueries({ queryKey: qk.catalog });
  };
  return {
    save: useMutation({
      mutationFn: async ({ id, ...input }: Partial<CategoryInput> & { id?: string }) => {
        const body = input.imageUrl
          ? { ...input, imageUrl: await uploadImage(input.imageUrl) }
          : input;
        return id
          ? api<ApiCategory>(`/categories/${id}`, { method: 'PATCH', body })
          : api<ApiCategory>('/categories', { method: 'POST', body });
      },
      onSuccess: (saved) => {
        // Add a new one to the list at once, so a form can select it before the refetch lands.
        queryClient.setQueryData<ApiCategory[]>(qk.categories, (list) =>
          list && !list.some((c) => c.id === saved.id) ? [...list, saved] : list,
        );
        refresh();
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => api(`/categories/${id}`, { method: 'DELETE' }),
      onSuccess: refresh,
    }),
  };
};

// ---- Home page ------------------------------------------------------------------------

// Every image a page holds, picked ones (data URLs) included, uploaded before the save.
const uploadPageImages = async (page: ApiHomePageContent): Promise<ApiHomePageContent> => {
  const upload = async (url: string) => (url ? uploadImage(url) : url);
  const image = async <T extends { url: string } | null | undefined>(value: T) =>
    value ? { ...value, url: await upload(value.url) } : value;

  const hero = { ...page.hero, image: await image(page.hero.image) };
  const sections = await Promise.all(
    page.sections.map(async (section) => {
      switch (section.type) {
        case 'promoCards':
          return {
            ...section,
            cards: await Promise.all(
              section.cards.map(async (card) => ({ ...card, image: (await image(card.image))! })),
            ),
          };
        case 'banners':
          return {
            ...section,
            slides: await Promise.all(
              section.slides.map(async (slide) => ({
                ...slide,
                image: await upload(slide.image),
                mobileImage: slide.mobileImage ? await upload(slide.mobileImage) : null,
              })),
            ),
          };
        case 'billboard':
          return { ...section, image: (await image(section.image))! };
        case 'combo':
          return { ...section, image: await image(section.image) };
        case 'videos':
          return {
            ...section,
            image: await image(section.image),
            videos: await Promise.all(
              section.videos.map(async (video) => ({
                ...video,
                poster: await upload(video.poster),
              })),
            ),
          };
        default:
          return section;
      }
    }),
  );
  return { hero, sections };
};

// The list itself is useHomePage() (lib/query/shop.ts); staff get the hidden sections too.
export const useHomePageActions = () => {
  const queryClient = useQueryClient();
  const keep = (page: ApiHomePage) => queryClient.setQueryData(qk.homePage, page);
  return {
    save: useMutation({
      mutationFn: async (page: ApiHomePageContent) =>
        api<ApiHomePage>('/store/home', { method: 'PUT', body: await uploadPageImages(page) }),
      onSuccess: keep,
    }),
    reset: useMutation({
      mutationFn: () => api('/store/home', { method: 'DELETE' }),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.homePage }),
    }),
  };
};

// ---- Reviews --------------------------------------------------------------------------

export type ReviewFilter = 'all' | 'published' | 'hidden';

export const useStoreReviews = (filter: ReviewFilter) => {
  const staff = useStaff();
  const query = useInfiniteQuery({
    queryKey: qk.admin.reviews(filter),
    queryFn: ({ pageParam }) =>
      api<CursorPage<ApiReview>>(
        `/admin/reviews?${params({
          limit: 30,
          cursor: pageParam,
          isPublished: filter === 'all' ? undefined : filter === 'published',
        })}`,
      ),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: staff,
  });
  return { ...query, reviews: query.data?.pages.flatMap((page) => page.data) ?? [] };
};

export const useReviewModeration = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
    queryClient.invalidateQueries({ queryKey: qk.catalog });
  };
  return {
    setPublished: useMutation({
      mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
        api<ApiReview>(`/admin/reviews/${id}`, { method: 'PATCH', body: { isPublished } }),
      onSuccess: refresh,
    }),
    remove: useMutation({
      mutationFn: (id: string) => api(`/reviews/${id}`, { method: 'DELETE' }),
      onSuccess: refresh,
    }),
    hideComment: useMutation({
      mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) =>
        api(`/admin/comments/${id}`, { method: 'PATCH', body: { isHidden } }),
      onSuccess: refresh,
    }),
  };
};

// ---- Customers and staff --------------------------------------------------------------

export interface UserFilter {
  role?: 'OWNER' | 'MANAGER' | 'CUSTOMER';
  search?: string;
}

export const useStoreUsers = (filter: UserFilter) => {
  const staff = useStaff();
  const query = useInfiniteQuery({
    queryKey: qk.admin.users(JSON.stringify(filter)),
    queryFn: ({ pageParam }) =>
      api<CursorPage<ApiUser>>(`/users?${params({ limit: 50, cursor: pageParam, ...filter })}`),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: staff,
  });
  return { ...query, users: query.data?.pages.flatMap((page) => page.data) ?? [] };
};

export const useUserActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
  return {
    update: useMutation({
      mutationFn: ({
        id,
        ...input
      }: {
        id: string;
        role?: 'MANAGER' | 'CUSTOMER';
        isActive?: boolean;
      }) => api<ApiUser>(`/users/${id}`, { method: 'PATCH', body: input }),
      onSuccess: refresh,
    }),
    addManager: useMutation({
      mutationFn: (input: { name: string; phone: string; password: string; email?: string }) =>
        api<ApiUser>('/users/managers', { method: 'POST', body: input }),
      onSuccess: refresh,
    }),
  };
};

// ---- Messages and chat ----------------------------------------------------------------

export type MessageFilter = 'all' | 'unread' | 'CONTACT' | 'FEEDBACK';

export const useStoreMessages = (filter: MessageFilter) => {
  const staff = useStaff();
  const query = useInfiniteQuery({
    queryKey: ['admin', 'messages', filter],
    queryFn: ({ pageParam }) =>
      api<ApiMessageList>(
        `/admin/messages?${params({
          limit: 30,
          cursor: pageParam,
          kind: filter === 'CONTACT' || filter === 'FEEDBACK' ? filter : undefined,
          isRead: filter === 'unread' ? false : undefined,
        })}`,
      ),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: staff,
    refetchInterval: 60_000,
  });
  return {
    ...query,
    messages: query.data?.pages.flatMap((page) => page.data) ?? [],
    unread: query.data?.pages[0]?.unread ?? 0,
  };
};

export const useMessageActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
  return {
    markRead: useMutation({
      mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
        api(`/admin/messages/${id}`, { method: 'PATCH', body: { isRead } }),
      onSuccess: refresh,
    }),
    remove: useMutation({
      mutationFn: (id: string) => api(`/admin/messages/${id}`, { method: 'DELETE' }),
      onSuccess: refresh,
    }),
  };
};

// Customer conversations, checked for new messages every 15 seconds on the chats page (and
// once a minute for the header's badge).
export const useChats = ({ interval = 15_000 }: { interval?: number } = {}) =>
  useQuery({
    queryKey: ['admin', 'chats'],
    queryFn: () => api<ApiConversationList>('/admin/chats?limit=100'),
    enabled: useStaff(),
    refetchInterval: interval,
    refetchOnWindowFocus: true,
  });

export const useChatThread = (id: string | null) =>
  useQuery({
    queryKey: ['admin', 'chats', id],
    queryFn: () => api<ApiChatThread>(`/admin/chats/${id}`),
    enabled: useStaff() && Boolean(id),
    refetchInterval: 5_000,
    refetchOnWindowFocus: true,
  });

export const useStoreChatActions = () => {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'chats'] });
  return {
    reply: useMutation({
      mutationFn: ({ id, body }: { id: string; body: string }) =>
        api<ApiChatMessage>(`/admin/chats/${id}/messages`, { method: 'POST', body: { body } }),
      onSuccess: refresh,
    }),
    read: useMutation({
      meta: { toast: false },
      mutationFn: (id: string) => api(`/admin/chats/${id}/read`, { method: 'POST' }),
      onSuccess: refresh,
    }),
  };
};
