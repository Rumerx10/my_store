import { API_ORIGIN, absoluteUrl } from '@/lib/api/client';

// Hosts next.config.ts lets next/image optimise; other links are shown as they are.
const OPTIMISED_HOSTS = new Set([
  'en.goodwe.com',
  'en.pvbm.com',
  'images.unsplash.com',
  new URL(API_ORIGIN).host,
]);

// next/image props for an image the seller centre set: uploads and known hosts are optimised,
// any other https link is passed through untouched.
export const homeImage = (url: string) => {
  const src = absoluteUrl(url);
  let optimised = false;
  try {
    optimised = OPTIMISED_HOSTS.has(new URL(src).host);
  } catch {
    // Not a full URL; leave it to the browser.
  }
  return { src, unoptimized: !optimised };
};

// A link the seller centre set: shop pages are stored without the shop's prefix
// ("/products?category=x"), anything else is an https link.
export const shopHref = (href: string) =>
  href.startsWith('/') ? `/next-power${href === '/' ? '' : href}` : href;

export const isExternal = (href: string) => !href.startsWith('/');
