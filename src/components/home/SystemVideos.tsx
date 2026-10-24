'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShieldCheck, Smartphone, Wrench } from 'lucide-react';
import { INSTALL_IMAGE, SYSTEM_VIDEOS } from '@/docs/homeMedia';

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
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="aspect-[2060/1600] w-full rounded-2xl bg-white object-cover dark:brightness-[0.85]"
    />
  );
};

const PROMISES = [
  {
    icon: Wrench,
    title: 'Certified installers',
    text: 'Site survey, wiring and handover by our own team.',
  },
  {
    icon: Smartphone,
    title: 'Live monitoring',
    text: 'See generation and battery level in the GoodWe app.',
  },
  {
    icon: ShieldCheck,
    title: 'Warranty handled',
    text: 'We register every product with GoodWe for you.',
  },
];

const SystemVideos = () => {
  return (
    <section aria-labelledby="how-systems-work" className="container mt-8 md:mt-12">
      <div className="rounded-3xl glass p-4 md:p-8">
        <h2
          id="how-systems-work"
          className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl"
        >
          How a solar system works
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-slate-400 md:text-base">
          Everything in a GoodWe system talks to everything else, from the panels to the battery to
          the app on your phone.
        </p>

        <ul className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
          {SYSTEM_VIDEOS.map((item) => (
            <li key={item.title} className="rounded-2xl glass-card p-3 md:p-4">
              <LoopVideo src={item.video} poster={item.poster} label={`Animation: ${item.title}`} />
              <h3 className="mt-4 px-1 text-lg font-semibold text-gray-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-1 px-1 pb-1 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                {item.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid items-center gap-6 rounded-2xl glass-card p-3 md:grid-cols-[0.9fr_1.1fr] md:p-4">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
            <Image
              src={INSTALL_IMAGE.src}
              alt={INSTALL_IMAGE.alt}
              fill
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover"
            />
          </div>
          <ul className="grid gap-4 px-1 pb-2 md:pb-0">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">{title}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SystemVideos;
