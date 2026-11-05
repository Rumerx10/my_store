import type { PageBackgroundProps } from '@/components/common/PageBackground';

// NextPower's page background, for its shop (app/next-power/layout.tsx) and its seller centre
// (/admin/next-power, app/admin/[store]/layout.tsx). Change it here; other stores keep the site
// default (globals.css body::before), and so does any value left out.
//   color, image          light mode
//   darkColor, darkImage  dark mode
//   image: any CSS image, a gradient like these or a photo: "url('/backgrounds/solar.jpg')"
export const NEXT_POWER_BACKGROUND: PageBackgroundProps = {
  // Golden hour shade: the sun's amber in the top-right corner, through white, to warm taupe.
  color: '#fff7e6',
  image:
    'radial-gradient(140% 120% at 100% 0%, #f59e0b 0%, #fcd34d 12%, #fff7e6 28%, #ffffff 42%, #e8e3da 72%, #b8ad9c 100%)',
  // At night: the same corner glow fading into a warm dark.
  darkColor: '#090806',
  darkImage:
    'radial-gradient(140% 120% at 100% 0%, rgb(245 158 11 / 0.5) 0%, rgb(245 158 11 / 0.175) 18%, #15120c 46%, #090806 100%)',
};
