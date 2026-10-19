'use client';
import { useEffect, useRef, useState } from 'react';

// Sparks of light that strike along the background grid lines at random.
// Each spark sits exactly on a grid line (lines are 56px apart, see `.grid-pulses` in
// globals.css); when it finishes its run it picks a new line, direction and speed.

const CELL = 56;

type Spark = {
  key: number;
  axis: 'x' | 'y';
  line: number;
  reverse: boolean;
  sun: boolean;
  duration: number;
  delay: number;
  length: number;
};

const SETTINGS = {
  page: { count: 7, speed: [3.2, 6.5], gap: [0.5, 5], length: [140, 260] },
  hero: { count: 8, speed: [2, 4.2], gap: [0.2, 3], length: [120, 240] },
} as const;

const between = (min: number, max: number) => min + Math.random() * (max - min);

let nextKey = 0;

const makeSpark = (
  variant: keyof typeof SETTINGS,
  size: { width: number; height: number },
  first = false,
): Spark => {
  const settings = SETTINGS[variant];
  // Horizontal lines are fewer on wide screens, so weight the axis by how many lines there are.
  const rows = Math.max(1, Math.floor(size.height / CELL) - 1);
  const cols = Math.max(1, Math.floor(size.width / CELL) - 1);
  const axis = Math.random() < rows / (rows + cols) + 0.15 ? 'x' : 'y';
  return {
    key: nextKey++,
    axis,
    line: 1 + Math.floor(Math.random() * (axis === 'x' ? rows : cols)),
    reverse: Math.random() < 0.5,
    sun: Math.random() < 0.3,
    duration: between(settings.speed[0], settings.speed[1]),
    // The first wave is spread out so the sparks don't all start together.
    delay: first ? between(0, settings.gap[1] * 1.5) : between(settings.gap[0], settings.gap[1]),
    length: between(settings.length[0], settings.length[1]),
  };
};

const GridPulses = ({ variant = 'page' }: { variant?: 'page' | 'hero' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useRef({ width: 0, height: 0 });
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Sparks are random, so they are only created in the browser (no hydration mismatch).
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      size.current = { width: rect.width, height: rect.height };
      el.style.setProperty('--travel-x', `${rect.width + 20}px`);
      el.style.setProperty('--travel-y', `${rect.height + 20}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    setSparks(
      Array.from({ length: SETTINGS[variant].count }, () => makeSpark(variant, size.current, true)),
    );
    return () => observer.disconnect();
  }, [variant]);

  const reroll = (key: number) =>
    setSparks((current) =>
      current.map((spark) => (spark.key === key ? makeSpark(variant, size.current) : spark)),
    );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={variant === 'hero' ? 'grid-pulses grid-pulses-hero' : 'grid-pulses'}
    >
      {sparks.map((spark) => (
        <span
          key={spark.key}
          className={[
            spark.axis === 'x' ? 'pulse-x' : 'pulse-y',
            spark.reverse ? 'pulse-reverse' : '',
            spark.sun ? 'pulse-sun' : '',
          ].join(' ')}
          style={
            {
              '--line': spark.line,
              '--delay': `${spark.delay.toFixed(2)}s`,
              '--duration': `${spark.duration.toFixed(2)}s`,
              '--len': `${Math.round(spark.length)}px`,
            } as React.CSSProperties
          }
          // Two animations run per spark; re-roll once the movement finishes.
          onAnimationEnd={(event) => {
            if (event.animationName.startsWith('pulse-move')) reroll(spark.key);
          }}
        />
      ))}
    </div>
  );
};

export default GridPulses;
