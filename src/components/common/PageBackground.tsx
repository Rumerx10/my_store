// A store's page background, behind the frosted panels. globals.css body::before reads these
// variables and keeps the site default for anything left out. `image` takes any CSS image: a
// gradient, or a photo as url('/backgrounds/solar.jpg') (it covers the window); `color` shows
// under it (and while a photo loads). The dark ones are the same for dark mode.
export interface PageBackgroundProps {
  color?: string;
  image?: string;
  darkColor?: string;
  darkImage?: string;
}

const PageBackground = ({ color, image, darkColor, darkImage }: PageBackgroundProps) => {
  const vars = [
    ['--page-bg-color', color],
    ['--page-bg-image', image],
    ['--page-bg-dark-color', darkColor],
    ['--page-bg-dark-image', darkImage],
  ]
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ');
  // Rendered on the server with the page, so the background is there from the first paint.
  return vars ? <style>{`:root { ${vars} }`}</style> : null;
};

export default PageBackground;
