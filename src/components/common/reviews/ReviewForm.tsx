'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { absoluteUrl, errorMessage } from '@/lib/api/client';
import { readImageFile } from '@/lib/imageFile';
import { MAX_REVIEW_IMAGES, type ReviewInput } from '@/lib/query/reviews';
import { cn } from '@/lib/utils';

const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Stars, a title, the review and up to four photos. Used to write a review and to edit one.
const ReviewForm = ({
  initial,
  submitLabel = 'Post review',
  onSubmit,
  onCancel,
}: {
  initial?: Partial<ReviewInput>;
  submitLabel?: string;
  onSubmit: (input: ReviewInput) => Promise<unknown>;
  onCancel?: () => void;
}) => {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [comment, setComment] = useState(initial?.comment ?? '');
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = MAX_REVIEW_IMAGES - images.length;
    if (files.length > room) toast.error(`A review can have up to ${MAX_REVIEW_IMAGES} photos.`);
    try {
      const picked = await Promise.all(
        Array.from(files)
          .slice(0, room)
          .map((file) => readImageFile(file, 1600)),
      );
      setImages((list) => [...list, ...picked].slice(0, MAX_REVIEW_IMAGES));
    } catch (reason) {
      toast.error(errorMessage(reason));
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) return setError('Choose a star rating.');
    if (comment.trim().length < 3) return setError('Write a few words about the product.');
    setError('');
    setBusy(true);
    try {
      await onSubmit({ rating, title, comment, images });
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
          {[1, 2, 3, 4, 5].map((stars) => (
            <button
              key={stars}
              type="button"
              role="radio"
              aria-checked={rating === stars}
              aria-label={`${stars} ${stars === 1 ? 'star' : 'stars'}, ${RATING_WORDS[stars]}`}
              onClick={() => setRating(stars)}
              className="rounded p-0.5 transition-transform active:scale-90"
            >
              <Star
                className={cn(
                  'size-7',
                  stars <= rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300 dark:text-white/20',
                )}
                aria-hidden="true"
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-slate-300">
              {RATING_WORDS[rating]}
            </span>
          )}
        </div>
      </div>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        maxLength={100}
        aria-label="Review title"
      />
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you like, and what could be better?"
        rows={4}
        maxLength={2000}
        aria-label="Your review"
      />
      <div>
        <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">
          Photos ({images.length}/{MAX_REVIEW_IMAGES})
        </p>
        <div className="flex flex-wrap gap-2">
          {images.map((src, index) => (
            <div
              key={`${index}-${src.slice(-24)}`}
              className="relative size-16 overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5"
            >
              <Image
                src={src.startsWith('data:') ? src : absoluteUrl(src)}
                alt=""
                fill
                sizes="64px"
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => setImages((list) => list.filter((_, i) => i !== index))}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </div>
          ))}
          {images.length < MAX_REVIEW_IMAGES && (
            <label className="flex size-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-gray-300 text-[11px] text-gray-500 transition-colors hover:border-brand hover:text-brand focus-within:border-brand dark:border-white/20 dark:text-slate-400">
              <ImagePlus className="size-5" aria-hidden="true" />
              Add
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
