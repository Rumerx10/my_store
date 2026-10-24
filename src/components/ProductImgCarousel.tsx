'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Thumbs } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// `activeImage` jumps the gallery to that image, e.g. when a colour is chosen.
const ProductImgCarousel = ({
  images = [],
  title,
  activeImage,
}: {
  images?: string[];
  title: string;
  activeImage?: string;
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = images.length > 0 ? images : ['/placeholder.svg'];
  const hasMany = slides.length > 1;

  useEffect(() => {
    if (!activeImage || !mainSwiper || mainSwiper.destroyed) return;
    const index = slides.indexOf(activeImage);
    if (index >= 0 && index !== mainSwiper.activeIndex) mainSwiper.slideTo(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImage, mainSwiper]);

  return (
    <div className="w-full min-w-0">
      <div className="relative overflow-hidden rounded-2xl glass-card">
        <Swiper
          spaceBetween={0}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Thumbs]}
          onSwiper={setMainSwiper}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {slides.map((src, index) => (
            <SwiperSlide key={src}>
              <div className="relative aspect-square">
                <Image
                  fill
                  src={src}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-contain p-6 md:p-10"
                  alt={`${title}, image ${index + 1} of ${slides.length}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => mainSwiper?.slidePrev()}
              disabled={activeIndex === 0}
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-slate-300 shadow-card transition-opacity hover:bg-white dark:hover:bg-slate-900 disabled:opacity-0"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => mainSwiper?.slideNext()}
              disabled={activeIndex === slides.length - 1}
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-slate-300 shadow-card transition-opacity hover:bg-white dark:hover:bg-slate-900 disabled:opacity-0"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {hasMany && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={5}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          className="mt-3"
        >
          {slides.map((src, index) => (
            <SwiperSlide key={src}>
              <button
                type="button"
                onClick={() => mainSwiper?.slideTo(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={activeIndex === index}
                className={cn(
                  'relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-gray-50 dark:bg-white/5 transition-colors',
                  activeIndex === index
                    ? 'border-brand'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-white/15',
                )}
              >
                <Image fill src={src} sizes="96px" className="object-contain p-1.5" alt="" />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProductImgCarousel;
