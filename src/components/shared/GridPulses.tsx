// Glowing pulses that run along the background grid lines, like trains on a track.
// Each pulse sits exactly on a grid line (lines are 56px apart, see `.grid-pulses` in globals.css).

type Pulse = {
  axis: 'x' | 'y';
  line: number;
  delay: number;
  duration: number;
  reverse?: boolean;
  sun?: boolean;
};

const PAGE_PULSES: Pulse[] = [
  { axis: 'x', line: 2, delay: 0, duration: 9 },
  { axis: 'x', line: 6, delay: 3.2, duration: 11, reverse: true, sun: true },
  { axis: 'x', line: 10, delay: 6.5, duration: 10 },
  { axis: 'x', line: 14, delay: 1.8, duration: 12, reverse: true },
  { axis: 'y', line: 3, delay: 1.2, duration: 10 },
  { axis: 'y', line: 8, delay: 4.6, duration: 9, reverse: true },
  { axis: 'y', line: 14, delay: 7.4, duration: 11, sun: true },
  { axis: 'y', line: 20, delay: 2.6, duration: 10, reverse: true },
  { axis: 'y', line: 26, delay: 5.8, duration: 9 },
];

const HERO_PULSES: Pulse[] = [
  { axis: 'x', line: 3, delay: 0.4, duration: 7 },
  { axis: 'x', line: 7, delay: 3, duration: 8, reverse: true, sun: true },
  { axis: 'x', line: 10, delay: 5.2, duration: 7.5 },
  { axis: 'y', line: 6, delay: 1.5, duration: 6.5 },
  { axis: 'y', line: 13, delay: 4.2, duration: 7, reverse: true, sun: true },
  { axis: 'y', line: 19, delay: 0.9, duration: 6 },
  { axis: 'y', line: 25, delay: 3.6, duration: 7.5, reverse: true },
];

const GridPulses = ({ variant = 'page' }: { variant?: 'page' | 'hero' }) => {
  const pulses = variant === 'hero' ? HERO_PULSES : PAGE_PULSES;
  return (
    <div
      aria-hidden="true"
      className={variant === 'hero' ? 'grid-pulses grid-pulses-hero' : 'grid-pulses'}
    >
      {pulses.map((pulse, index) => (
        <span
          key={index}
          className={[
            pulse.axis === 'x' ? 'pulse-x' : 'pulse-y',
            pulse.reverse ? 'pulse-reverse' : '',
            pulse.sun ? 'pulse-sun' : '',
          ].join(' ')}
          style={
            {
              '--line': pulse.line,
              '--delay': `${pulse.delay}s`,
              '--duration': `${pulse.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default GridPulses;
