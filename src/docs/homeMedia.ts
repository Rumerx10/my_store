// Photos and videos used on the home page.
// GoodWe banners and animations come from en.goodwe.com; installation photos from Unsplash.
const GW = 'https://en.goodwe.com/Public/Uploads/uploadfile/';
const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`;

export const HERO_IMAGE = {
  src: unsplash('1508514177221-188b1cf16e9d', 2000),
  alt: 'Rows of solar panels under a bright blue sky',
};

export const SOLUTIONS = [
  {
    key: 'home',
    title: 'Solar for your home',
    text: 'Cut your electricity bill and keep the lights on during load shedding with panels, a hybrid inverter and battery backup.',
    points: [
      'Sized to your monthly bill',
      'Backup during power cuts',
      'Track every unit in the app',
    ],
    href: '/products?searchTerm=home',
    cta: 'Shop home solar',
    image: {
      src: unsplash('1624397640148-949b1732bb0a'),
      alt: 'Installer fitting a solar panel on a house roof',
    },
  },
  {
    key: 'business',
    title: 'Solar for your business',
    text: 'Lower daytime power costs for shops, offices and factories with commercial inverters and storage that trims peak demand.',
    points: [
      'Inverters from 30 to 125 kW',
      'Storage up to 261 kWh per cabinet',
      'Peak shaving cuts demand charges',
    ],
    href: '/products?searchTerm=business',
    cta: 'Shop business solar',
    image: {
      src: unsplash('1613665813446-82a78c468a1d'),
      alt: 'Solar panels covering a factory roof at sunset',
    },
  },
];

// GoodWe's own product banners, linked to the matching product page.
export const FEATURED_BANNERS = [
  {
    href: '/products/16',
    label: 'GoodWe ESA All-in-One home energy storage',
    desktop: `${GW}images/20260312/banner4_2560-1266Web.jpg`,
    mobile: `${GW}images/20260312/Banner4_768x800_Web.jpg`,
  },
  {
    href: '/products/21',
    label: 'GoodWe ESA commercial energy storage, 125 kW / 261 kWh',
    desktop: `${GW}images/20260120/Banner3_1920x950_Web_1.jpg`,
    mobile: `${GW}images/20260120/Banner3_768x800_Web_1.jpg`,
  },
];

// Short silent animations from GoodWe showing how each system connects.
export const SYSTEM_VIDEOS = [
  {
    title: 'Home energy storage',
    text: 'Panels charge the battery by day, the hybrid inverter powers the house at night and during outages.',
    video: `${GW}files/20250226/home01_x2641.mp4`,
    poster: `${GW}images/20220217/home01.jpg`,
  },
  {
    title: 'Commercial and industrial',
    text: 'Rooftop arrays and storage cabinets work together to cover daytime load and shave expensive peaks.',
    video: `${GW}files/20250226/home02_x264.mp4`,
    poster: `${GW}images/20220217/home02.jpg`,
  },
];

export const INSTALL_IMAGE = {
  src: unsplash('1611365892117-00ac5ef43c90', 1200),
  alt: 'Two installers connecting the wiring under a solar panel',
};
