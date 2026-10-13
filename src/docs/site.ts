// Store-wide details used in the header, footer, and info pages.
// Contact details are placeholders until the real ones are available.
export const SITE = {
  name: 'NextMart',
  tagline: 'Everyday essentials, delivered across Bangladesh',
  description:
    'Shop beauty, fragrances, furniture and groceries from trusted brands, with cash on delivery and bKash, Nagad or Rocket payments.',
  email: 'support@nextmart.com.bd',
  phone: '+880 9612-345678',
  phoneHref: '+8809612345678',
  address: 'House 42, Road 11, Banani, Dhaka 1213',
  hours: 'Saturday to Thursday, 9:00 to 21:00',
};

export const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', href: '/products' },
      { label: 'Categories', href: '/categories' },
      { label: 'Deals', href: '/deals' },
      { label: 'Wishlist', href: '/wish-list' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact us', href: '/contact' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About NextMart', href: '/about' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Cookie policy', href: '/cookies' },
    ],
  },
];
