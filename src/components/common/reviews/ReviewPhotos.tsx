'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { absoluteUrl } from '@/lib/api/client';

// A review's photos as thumbnails; one opens full size, with arrows to the others.
const ReviewPhotos = ({ images }: { images: string[] }) => {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
      if (event.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (event.key === 'ArrowLeft')
        setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <ul className="mt-3 flex flex-wrap gap-2">
        {images.map((src, index) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="relative block size-20 overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5"
              aria-label={`Open photo ${index + 1} of ${images.length}`}
            >
              <Image
                src={absoluteUrl(src)}
                alt=""
                fill
                sizes="80px"
                unoptimized
                className="object-cover transition-transform hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${open + 1} of ${images.length}`}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open - 1 + images.length) % images.length);
                }}
                className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open + 1) % images.length);
                }}
                className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            </>
          )}
          <div className="relative h-[80dvh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={absoluteUrl(images[open])}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewPhotos;
