'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import { A11y, Autoplay, Keyboard, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { ApiHomeSection } from '@/lib/api/types';
import { homeImage, isExternal, shopHref } from './media';

type Banners = Extract<ApiHomeSection, { type: 'banners' }>;
type Slide = Banners['slides'][number];

// One banner: the phone crop when there is one, the wide image from tablet up.
const BannerArt = ({ slide, priority }: { slide: Slide; priority: boolean }) => (
  <>
    {slide.mobileImage && (
      <div className="relative aspect-[24/25] md:hidden">
        <Image
          {...homeImage(slide.mobileImage)}
          alt={slide.alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </div>
    )}
    <div
      className={
        slide.mobileImage ? 'relative hidden aspect-[2/1] md:block' : 'relative aspect-[2/1]'
      }
    >
      <Image
        {...homeImage(slide.image)}
        alt={slide.alt}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="object-cover"
      />
    </div>
  </>
);

const Banner = ({ slide, priority = false }: { slide: Slide; priority?: boolean }) =>
  slide.href ? (
    <Link
      href={shopHref(slide.href)}
      target={isExternal(slide.href) ? '_blank' : undefined}
      className="block"
    >
      <BannerArt slide={slide} priority={priority} />
    </Link>
  ) : (
    <BannerArt slide={slide} priority={priority} />
  );

const arrowClass =
  'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-900 shadow-card backdrop-blur-md transition-colors hover:bg-white md:size-11 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900';

// Ads and offers set in the seller centre: one banner as it is, several in a Swiper carousel
// that moves on by itself (with a pause button), and by swiping, dragging, the arrows, the
// dots or the keyboard's arrow keys.
const FeaturedBanners = ({ section }: { section: Banners }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [paused, setPaused] = useState(false);
  const several = section.slides.length > 1;
  const autoplay = several && section.autoplaySeconds > 0;

  const togglePause = () => {
    if (!swiper?.autoplay) return;
    if (paused) swiper.autoplay.start();
    else swiper.autoplay.stop();
    setPaused(!paused);
  };

  // Only while a section is still being set up in the seller centre.
  if (section.slides.length === 0 || section.slides.some((slide) => !slide.image)) return null;

  return (
    <section
      aria-label={section.title || 'Offers'}
      aria-roledescription={several ? 'carousel' : undefined}
      className="container mt-8 md:mt-12"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/70 shadow-lift dark:border-white/10">
        {several ? (
          <Swiper
            modules={[A11y, Autoplay, Keyboard, Pagination]}
            onSwiper={setSwiper}
            loop
            grabCursor
            speed={650}
            keyboard={{ enabled: true, onlyInViewport: true }}
            pagination={{ clickable: true }}
            autoplay={
              autoplay
                ? {
                    delay: section.autoplaySeconds * 1000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            className="home-banners"
          >
            {section.slides.map((slide, index) => (
              <SwiperSlide key={`${index}-${slide.image}`}>
                <Banner slide={slide} priority={index === 0} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Banner slide={section.slides[0]} />
        )}
        {several && (
          <>
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous banner"
              className={`${arrowClass} left-3 md:left-4`}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label="Next banner"
              className={`${arrowClass} right-3 md:right-4`}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
        {autoplay && (
          <button
            type="button"
            onClick={togglePause}
            aria-label={paused ? 'Play the banners' : 'Pause the banners'}
            className="absolute bottom-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-slate-950/55 text-white backdrop-blur-md transition-colors hover:bg-slate-950/75"
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
        )}
      </div>
    </section>
  );
};

export default FeaturedBanners;
