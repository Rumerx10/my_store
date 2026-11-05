import { useMemo } from 'react';
import JsBarcode from 'jsbarcode';

// Code 128 bars for `value`, as ones and zeros, one per module.
const encode = (value: string) => {
  const target: { encodings?: { data: string }[] } = {};
  JsBarcode(target, value, { format: 'CODE128' });
  return target.encodings?.map((encoding) => encoding.data).join('') ?? '';
};

// Ten modules of white on each side, so a scanner can find where the bars start.
const QUIET = 10;

// A Code 128 barcode as SVG. Each module is `moduleMm` wide on paper (0.33 mm reads well
// from laser and inkjet prints); bars are drawn as one path with crisp edges.
const Barcode = ({
  value,
  height = '13mm',
  moduleMm = 0.33,
  className,
}: {
  value: string;
  height?: string;
  moduleMm?: number;
  className?: string;
}) => {
  const { modules, path } = useMemo(() => {
    const bits = encode(value);
    let d = '';
    for (let i = 0; i < bits.length; ) {
      if (bits[i] !== '1') {
        i += 1;
        continue;
      }
      let run = 1;
      while (bits[i + run] === '1') run += 1;
      d += `M${i + QUIET} 0h${run}v1h-${run}z`;
      i += run;
    }
    return { modules: bits.length + QUIET * 2, path: d };
  }, [value]);

  return (
    <svg
      viewBox={`0 0 ${modules} 1`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      style={{ width: `${modules * moduleMm}mm`, height }}
      className={className}
      role="img"
      aria-label={`Barcode ${value}`}
    >
      <rect width={modules} height={1} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
};

export default Barcode;
