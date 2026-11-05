// Store-wide copy for the header, footer and info pages. The contact details here are only
// the fallback: pages show the ones set in the seller centre (lib/query/storeInfo.ts).
export const SITE = {
  name: 'NextPower',
  tagline: 'Solar power for homes and businesses across Bangladesh',
  description:
    'GoodWe solar panels, inverters, batteries and EV chargers, delivered and installed across Bangladesh. Pay with cash on delivery.',
  email: 'support@nextpower.com.bd',
  phone: '+880 9612-345678',
  phoneHref: '+8809612345678',
  address: 'House 42, Road 11, Banani, Dhaka 1213',
  hours: 'Saturday to Thursday, 9:00 to 21:00',
};

export const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', href: '/next-power/products' },
      { label: 'Categories', href: '/next-power/categories' },
      { label: 'Deals', href: '/next-power/deals' },
      { label: 'Wishlist', href: '/next-power/wish-list' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact us', href: '/next-power/contact' },
      { label: 'Shipping', href: '/next-power/shipping' },
      { label: 'Returns', href: '/next-power/returns' },
      { label: 'FAQ', href: '/next-power/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About NextPower', href: '/next-power/about' },
      { label: 'Privacy policy', href: '/next-power/privacy' },
      { label: 'Terms of service', href: '/next-power/terms' },
      { label: 'Cookie policy', href: '/next-power/cookies' },
    ],
  },
];
