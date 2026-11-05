import { useMemo } from 'react';
import { create } from 'qrcode';

// The standard four modules of white around the code.
const QUIET = 4;

// A QR code as SVG, black on white, with dark modules in each row merged into runs.
// Error correction M survives a scuffed parcel label without making the code too dense.
const QrCode = ({
  value,
  size = '22mm',
  className,
}: {
  value: string;
  size?: string;
  className?: string;
}) => {
  const { count, path } = useMemo(() => {
    const { modules } = create(value, { errorCorrectionLevel: 'M' });
    let d = '';
    for (let row = 0; row < modules.size; row += 1) {
      for (let col = 0; col < modules.size; ) {
        if (!modules.get(row, col)) {
          col += 1;
          continue;
        }
        let run = 1;
        while (col + run < modules.size && modules.get(row, col + run)) run += 1;
        d += `M${col + QUIET} ${row + QUIET}h${run}v1h-${run}z`;
        col += run;
      }
    }
    return { count: modules.size + QUIET * 2, path: d };
  }, [value]);

  return (
    <svg
      viewBox={`0 0 ${count} ${count}`}
      shapeRendering="crispEdges"
      style={{ width: size, height: size }}
      className={className}
      role="img"
      aria-label="QR code"
    >
      <rect width={count} height={count} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
};

export default QrCode;
