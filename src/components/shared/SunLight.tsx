// A sun in the top-right corner whose light falls across the site.
// Back layer: the sun disc and its rays, seen softly through the frosted glass panels.
// Front layer: a faint glare and light beams over the content (under the header), so the
// light also crosses solid areas like the hero photo. Both ignore pointer events.
const BEAMS = [
  { angle: 148, width: 9, delay: 0 },
  { angle: 158, width: 5, delay: 2.5 },
  { angle: 167, width: 12, delay: 5 },
  { angle: 178, width: 4, delay: 1.2 },
  { angle: 190, width: 7, delay: 3.8 },
];

const SunLight = () => (
  <>
    <div aria-hidden="true" className="sun-back">
      <div className="sun-rays" />
      <div className="sun-disc" />
    </div>
    <div aria-hidden="true" className="sun-front">
      <div className="sun-glare" />
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

export default SunLight;
