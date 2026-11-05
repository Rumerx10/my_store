'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// A home page section that rises and fades in the first time it scrolls into view (only a
// fade when the visitor prefers less motion; globals.css .reveal-*). Sections already on screen
// when the page loads are left as they are, so nothing flickers and nothing waits for scripts.
const Reveal = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle');

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setState('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState('shown');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(state === 'hidden' && 'reveal-hidden', state === 'shown' && 'reveal-shown')}
    >
      {children}
    </div>
  );
};

export default Reveal;
