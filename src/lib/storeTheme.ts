// A store's colour scheme from its one brand colour. The seller centre uses it for buttons,
// active navigation, focus rings, soft highlights and charts, in light and dark mode.
//
// Colours are worked out in OKLCH, so lighter and darker steps keep the same hue, and every
// step is checked against the WCAG contrast it needs: filled buttons carry white text (4.5:1),
// and in dark mode brand-coloured text sits on the dark card colour. A colour that is too light
// for white text is darkened just enough, so any colour a store picks stays readable.

export const DEFAULT_BRAND_COLOR = '#1d4ed8';

interface Lch {
  l: number;
  c: number;
  h: number;
}

const WHITE = '#ffffff';
const DARK_CARD = '#0f172a';

const hexToRgb = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((v) => v / 255);
};

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

const toLch = (hex: string): Lch => {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
};

// Linear sRGB for an OKLCH colour; values outside 0..1 are out of gamut.
const toLinearRgb = ({ l, c, h }: Lch) => {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
    -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
    -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
  ];
};

const inGamut = (rgb: number[]) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

// The colour as hex, with chroma reduced until it fits in sRGB (same lightness and hue).
const toHex = (color: Lch) => {
  const l = Math.min(1, Math.max(0, color.l));
  let low = 0;
  let high = color.c;
  let rgb = toLinearRgb({ ...color, l });
  if (!inGamut(rgb)) {
    for (let i = 0; i < 24; i += 1) {
      const mid = (low + high) / 2;
      if (inGamut(toLinearRgb({ ...color, l, c: mid }))) low = mid;
      else high = mid;
    }
    rgb = toLinearRgb({ ...color, l, c: low });
  }
  return `#${rgb
    .map((v) => Math.round(fromLinear(Math.min(1, Math.max(0, v))) * 255))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
};

const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Steps lightness (darker or lighter) until the colour reaches `ratio` against `against`.
const reach = (color: Lch, against: string, ratio: number, step: number): Lch => {
  let next = color;
  for (let i = 0; i < 100 && contrast(toHex(next), against) < ratio; i += 1) {
    next = { ...next, l: Math.min(1, Math.max(0, next.l + step)) };
  }
  return next;
};

const isHex = (value: string | null | undefined): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

const rgbList = (hex: string) =>
  hexToRgb(hex)
    .map((v) => Math.round(v * 255))
    .join(' ');

// Seven steps from a faint tint to a strong shade, for the busiest-times heatmap.
const ramp = (base: Lch, from: number, to: number) =>
  Array.from({ length: 7 }, (_, i) => {
    const t = i / 6;
    return toHex({ l: from + (to - from) * t, c: base.c * (0.12 + 0.88 * t), h: base.h });
  });

export interface BrandPalette {
  // What filled buttons use: the store's colour, darkened if white text needs it.
  button: string;
  // Whether the store's own colour had to be darkened for that.
  adjusted: boolean;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export const brandPalette = (color: string | null | undefined): BrandPalette => {
  const hex = isHex(color) ? color.toLowerCase() : DEFAULT_BRAND_COLOR;
  const base = toLch(hex);
  const brand = reach(base, WHITE, 4.5, -0.01);
  const button = toHex(brand);
  const hover = toHex(reach({ ...brand, l: brand.l - 0.07 }, WHITE, 4.5, -0.01));
  // The gradient on filled surfaces turns towards a neighbouring hue, as NextPower's blue
  // turns to teal; every stop keeps white text readable. Dark yellows read as mud, so a turn
  // that would land there goes the other way (greens turn to teal, not olive).
  const back = (brand.h + 320) % 360;
  const turnHue = back >= 75 && back <= 125 ? (brand.h + 40) % 360 : back;
  const turn = toHex(reach({ ...brand, h: turnHue }, WHITE, 4.5, -0.01));
  const darkText = reach(
    { ...base, l: Math.max(base.l, 0.72), c: base.c * 0.9 },
    DARK_CARD,
    6,
    0.01,
  );
  const darkFill = reach({ ...brand, l: Math.max(brand.l, 0.56) }, WHITE, 4.5, -0.01);

  return {
    button,
    adjusted: button !== hex,
    light: {
      '--color-brand': button,
      '--color-brand-hover': hover,
      '--color-brand-soft': toHex({ l: 0.955, c: Math.min(brand.c * 0.3, 0.045), h: brand.h }),
      '--color-brand-ink': toHex(reach({ ...brand, l: Math.min(brand.l, 0.4) }, WHITE, 9, -0.01)),
      '--primary': button,
      '--ring': button,
      '--gradient-brand': `linear-gradient(135deg, ${hover} 0%, ${button} 45%, ${turn} 100%)`,
      '--brand-shadow': `rgb(${rgbList(button)} / 0.6)`,
      '--chart-current': button,
      ...Object.fromEntries(
        ramp(brand, 0.97, brand.l).map((value, i) => [`--chart-heat-${i}`, value]),
      ),
    },
    dark: {
      '--color-brand': toHex(darkText),
      '--color-brand-hover': toHex({ ...darkText, l: darkText.l + 0.08 }),
      '--color-brand-soft': toHex({ l: 0.29, c: Math.min(brand.c * 0.45, 0.09), h: brand.h }),
      '--color-brand-ink': toHex({ l: 0.89, c: Math.min(brand.c * 0.35, 0.07), h: brand.h }),
      '--primary': toHex(darkFill),
      '--ring': toHex({ ...darkText, l: Math.min(darkText.l, 0.66) }),
      '--chart-current': toHex({ ...darkText, l: Math.min(darkText.l, 0.66) }),
      ...Object.fromEntries(
        ramp(darkText, 0.22, darkText.l).map((value, i) => [`--chart-heat-${i}`, value]),
      ),
    },
  };
};

const block = (selector: string, tokens: Record<string, string>) =>
  `${selector}{${Object.entries(tokens)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')}}`;

// The palette as CSS: it overrides the site's brand tokens while the page that renders it is
// mounted. `:root.dark` outranks the site's own `.dark` rules.
export const brandThemeCss = (color: string | null | undefined) => {
  const palette = brandPalette(color);
  return `${block(':root', palette.light)}${block(':root.dark', palette.dark)}`;
};

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A browser-tab icon for a store without a logo: its first letter on its own colour.
export const storeIconUrl = (name: string, color: string | null | undefined) => {
  const letter = escapeXml(name.trim().charAt(0).toUpperCase() || '?');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="14" fill="${brandPalette(color).button}"/>` +
    `<text x="32" y="44" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" ` +
    `font-size="36" font-weight="700" fill="#fff">${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// The seller centre's own tab icon, before a store is known: a plain shopfront.
export const SELLER_CENTRE_ICON_URL = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="24" height="24" rx="5" fill="#334155" stroke="none"/><path d="M5 10v8h14v-8M4 6h16l-1 4H5zM10 18v-4h4v4"/></svg>',
)}`;
