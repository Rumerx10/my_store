import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, uploadImage } from '@/lib/api/client';
import type {
  ApiComment,
  ApiProductReviews,
  ApiReview,
  ApiToReviewItem,
  CursorPage,
} from '@/lib/api/types';
import { qk } from './keys';
import { useSession } from './session';

// Matches MAX_REVIEW_IMAGES on the server.
export const MAX_REVIEW_IMAGES = 4;

const cursor = (pageParam: string) => (pageParam ? `&cursor=${pageParam}` : '');

// A product's published reviews, 10 at a time, with the star summary.
export const useProductReviews = (productId: string) =>
  useInfiniteQuery({
    queryKey: qk.productReviews(productId),
    queryFn: ({ pageParam }) =>
      api<ApiProductReviews>(`/products/${productId}/reviews?limit=10${cursor(pageParam)}`),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });

// The signed-in customer's own reviews.
export const useMyReviews = () => {
  const { user } = useSession();
  return useInfiniteQuery({
    queryKey: qk.myReviews,
    queryFn: ({ pageParam }) =>
      api<CursorPage<ApiReview>>(`/reviews/mine?limit=20${cursor(pageParam)}`),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: Boolean(user),
  });
};

// Delivered products the customer hasn't reviewed yet.
export const useToReview = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: qk.toReview,
    queryFn: () => api<ApiToReviewItem[]>('/reviews/to-review'),
    enabled: Boolean(user),
  });
};

export interface ReviewInput {
  rating: number;
  title?: string;
  comment: string;
  // Data URLs of photos picked now, or URLs of photos already saved.
  images: string[];
}

const toBody = async (input: ReviewInput) => ({
  rating: input.rating,
  title: input.title?.trim() || undefined,
  comment: input.comment.trim(),
  images: await Promise.all(input.images.map(uploadImage)),
});

export const useReviewActions = () => {
  const queryClient = useQueryClient();
  // A review changes the product's rating, its review list and the customer's lists.
  const refresh = (productId?: string) => {
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
    queryClient.invalidateQueries({ queryKey: qk.catalog });
    if (productId) queryClient.invalidateQueries({ queryKey: qk.product(productId) });
  };

  // The review form shows its own errors.
  const create = useMutation({
    meta: { toast: false },
    mutationFn: async ({ productId, ...input }: ReviewInput & { productId: string }) =>
      api<ApiReview>(`/products/${productId}/reviews`, {
        method: 'POST',
        body: await toBody(input),
      }),
    onSuccess: (review) => refresh(review.productId),
  });

  const update = useMutation({
    meta: { toast: false },
    mutationFn: async ({ id, ...input }: ReviewInput & { id: string }) =>
      api<ApiReview>(`/reviews/${id}`, { method: 'PATCH', body: await toBody(input) }),
    onSuccess: (review) => refresh(review.productId),
  });

  const remove = useMutation({
    mutationFn: ({ id }: { id: string; productId: string }) =>
      api(`/reviews/${id}`, { method: 'DELETE' }),
    onSuccess: (_result, { productId }) => refresh(productId),
  });

  return { create, update, remove };
};

// Comments under a review, oldest first, each with its first few replies.
export const useComments = (reviewId: string, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: qk.comments(reviewId),
    queryFn: ({ pageParam }) =>
      api<CursorPage<ApiComment>>(`/reviews/${reviewId}/comments?limit=20${cursor(pageParam)}`),
    initialPageParam: '',
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled,
  });

// Every reply to a comment, fetched when someone asks to see more.
export const useReplies = (commentId: string, enabled: boolean) =>
  useQuery({
    queryKey: qk.replies(commentId),
    queryFn: async () =>
      (await api<CursorPage<ApiComment>>(`/comments/${commentId}/replies?limit=100`)).data,
    enabled,
  });

export const useCommentActions = (reviewId: string) => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: qk.comments(reviewId) });
    queryClient.invalidateQueries({ queryKey: ['reviews', 'replies'] });
    queryClient.invalidateQueries({ queryKey: ['reviews', 'product'] });
  };

  const comment = useMutation({
    mutationFn: (body: string) =>
      api<ApiComment>(`/reviews/${reviewId}/comments`, { method: 'POST', body: { body } }),
    onSuccess: refresh,
  });

  // Replying to a reply joins the same thread (the API attaches it to the top comment).
  const reply = useMutation({
    mutationFn: ({ commentId, body }: { commentId: string; body: string }) =>
      api<ApiComment>(`/comments/${commentId}/replies`, { method: 'POST', body: { body } }),
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: (commentId: string) => api(`/comments/${commentId}`, { method: 'DELETE' }),
    onSuccess: refresh,
  });

  return { comment, reply, remove };
};
