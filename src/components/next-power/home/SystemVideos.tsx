'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { HomeIcon } from '@/components/common/homeIcons';
import type { ApiHomeSection } from '@/lib/api/types';
import { homeImage } from './media';

type Videos = Extract<ApiHomeSection, { type: 'videos' }>;

// Silent looping animation; it stays on its poster frame when the visitor prefers less motion.
const LoopVideo = ({ src, poster, label }: { src: string; poster: string; label: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.play().catch(() => {
      // Autoplay can be blocked (for example in data-saver mode); the poster stays visible.
    });
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={homeImage(poster).src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="aspect-[2060/1600] w-full rounded-2xl bg-white object-cover dark:brightness-[0.85]"
    />
  );
};

// Short videos of how things work, then a photo with a few promises beside it.
const SystemVideos = ({ section }: { section: Videos }) => {
  const headingId = `${section.id}-title`;
  return (
    <section aria-labelledby={headingId} className="container mt-8 md:mt-12">
      <div className="rounded-3xl glass p-4 md:p-8">
        <h2 id={headingId} className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-slate-400 md:text-base">
            {section.subtitle}
          </p>
        )}

        {section.videos.length > 0 && (
          <ul className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
            {section.videos.map((item, index) => (
              <li key={`${index}-${item.title}`} className="rounded-2xl glass-card p-3 md:p-4">
                <LoopVideo
                  src={item.videoUrl}
                  poster={item.poster}
                  label={`Animation: ${item.title}`}
                />
                <h3 className="mt-4 px-1 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {item.title}
                </h3>
                {item.text && (
                  <p className="mt-1 px-1 pb-1 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                    {item.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {(section.image || section.points.length > 0) && (
          <div className="mt-6 grid items-center gap-6 rounded-2xl glass-card p-3 md:grid-cols-[0.9fr_1.1fr] md:p-4">
            {section.image && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                <Image
                  {...homeImage(section.image.url)}
                  alt={section.image.alt}
                  fill
                  sizes="(min-width: 768px) 520px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <ul className="grid gap-4 px-1 pb-2 md:pb-0">
              {section.points.map((point, index) => (
                <li key={`${index}-${point.title}`} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                    <HomeIcon name={point.icon} className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{point.title}</p>
                    {point.text && (
                      <p className="text-sm text-gray-600 dark:text-slate-400">{point.text}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default SystemVideos;
