'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// A sun in the top-right corner whose light falls across the site.
// Back layer: the rays, seen softly through the frosted glass panels.
// Top layer: the sun disc itself, over the panels so their blur doesn't smear it. On the home
// page it waits until the hero (which has a sun of its own) has left the top of the window.
// Front layer: light beams over the content (under the header), so the light also crosses
// solid areas like the hero photo. All of them ignore pointer events.
const BEAMS = [
  { angle: 148, width: 9, delay: 0 },
  { angle: 158, width: 5, delay: 2.5 },
  { angle: 167, width: 12, delay: 5 },
  { angle: 178, width: 4, delay: 1.2 },
  { angle: 190, width: 7, delay: 3.8 },
];

const HOME = '/next-power';

const SunLight = () => {
  const pathname = usePathname();
  const [heroInView, setHeroInView] = useState(pathname === HOME);

  useEffect(() => {
    setHeroInView(pathname === HOME);
    let observer: IntersectionObserver | undefined;
    // The new page is on screen by the next frame; then watch its hero, if it has one.
    const frame = requestAnimationFrame(() => {
      const hero = document.querySelector('section[aria-labelledby="hero-title"]');
      if (!hero) {
        setHeroInView(false);
        return;
      }
      // Only the top of the window counts: that is where the sun sits.
      observer = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting), {
        rootMargin: '0px 0px -85% 0px',
      });
      observer.observe(hero);
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <div aria-hidden="true" className="sun-back">
        <div className="sun-rays" />
      </div>
      <div aria-hidden="true" className="sun-top" data-hidden={heroInView}>
        <div className="sun-disc" />
      </div>
      <div aria-hidden="true" className="sun-front">
        {BEAMS.map((beam) => (
          <span
            key={beam.angle}
            className="sun-beam"
            style={
              {
                '--angle': `${beam.angle}deg`,
                '--beam-width': `${beam.width}rem`,
                '--delay': `${beam.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
};

export default SunLight;
