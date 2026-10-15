import { IProduct } from '@/types/api_types';

// Product catalog: GoodWe solar panels, inverters, batteries, storage systems, EV chargers and
// accessories. Names, model numbers (used as SKU), specs and photos come from GoodWe's public
// sites (en.goodwe.com, en.pvbm.com). GoodWe publishes no prices, so prices, discounts, stock
// and ratings are placeholder figures for this demo store.

const GW = 'https://en.goodwe.com/Public/Uploads/uploadfile/images/';
const PV = 'https://en.pvbm.com/Public/Uploads/uploadfile/images/';

type Seed = Pick<
  IProduct,
  'id' | 'title' | 'category' | 'price' | 'stock' | 'sku' | 'description' | 'images'
> &
  Partial<
    Pick<IProduct, 'discountPercentage' | 'rating' | 'weight' | 'warrantyInformation' | 'options'>
  > & {
    segment: ('home' | 'business')[];
    highlights: string[];
    specs: [string, string][];
    flags?: ('popular' | 'trending' | 'latest')[];
  };

const availability = (stock: number) =>
  stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';

const product = ({ segment, flags = [], ...seed }: Seed): IProduct => ({
  discountPercentage: 0,
  rating: 4.6,
  weight: 0,
  warrantyInformation: 'GoodWe manufacturer warranty, registered for you at installation',
  ...seed,
  brand: 'GoodWe',
  thumbnail: seed.images[0],
  tags: segment,
  popular: flags.includes('popular'),
  trending: flags.includes('trending'),
  latest: flags.includes('latest'),
  dimensions: { width: 0, height: 0, depth: 0 },
  shippingInformation: 'Delivered and installed by our certified team across Bangladesh',
  availabilityStatus: availability(seed.stock),
  reviews: [],
  returnPolicy: '7-day return if unused and in the original packaging',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-14T00:00:00.000Z',
    barcode: '',
    qrCode: '',
  },
});

export const Products: IProduct[] = [
  // Solar panels
  product({
    id: 1,
    title: 'GoodWe Galaxy 570W Ultra-lightweight Solar Panel',
    category: 'solar-panels',
    price: 19500,
    discountPercentage: 8,
    rating: 4.7,
    stock: 240,
    sku: 'GALAXY-570',
    segment: ['home', 'business'],
    flags: ['popular', 'trending'],
    images: [`${PV}20260327/Galaxy570FrontBack.png`, `${PV}20260128/CIgalaxybannerpc.jpg`],
    description:
      'A frameless, ultra-lightweight solar panel for roofs that cannot carry heavy modules, such as metal factory roofs, sheds, pergolas and flat roofs. It installs quickly with clamps and resists strong wind and hail.',
    highlights: [
      'Ultra-lightweight, reduces load on the roof',
      'Bezel-free surface sheds dust and rain',
      'Strong wind and hail resistance',
      'IP67 ingress protection',
    ],
    specs: [
      ['Rated power', '570 W'],
      ['Design', 'Frameless, ultra-lightweight'],
      ['Ingress protection', 'IP67'],
      ['Mounting', 'Clamp rail or railless clamps'],
    ],
  }),
  product({
    id: 2,
    title: 'GoodWe Polaris Waterproof Bifacial Solar Module',
    category: 'solar-panels',
    price: 24000,
    rating: 4.6,
    stock: 120,
    sku: 'POLARIS',
    segment: ['home', 'business'],
    flags: ['latest'],
    images: [`${PV}20250923/9.22polaris.jpg`, `${PV}20250711/jiejuefangan11-916.jpg`],
    description:
      'A structural, waterproof solar module that doubles as a roof for carports, sun sheds and flat-to-pitched roof conversions. Bifacial TOPCon cells collect light from both sides.',
    highlights: [
      'Structurally waterproof, works as the roof itself',
      'High-efficiency bifacial TOPCon cells',
      '2 + 2 mm laminated safety glass',
      'Modular design, easy to replace',
    ],
    specs: [
      ['Cell type', 'TOPCon, bifacial'],
      ['Glass', '2 + 2 mm laminated safety glass (VSG)'],
      ['Applications', 'Carport, sun shed, flat-to-pitched roof'],
    ],
  }),
  product({
    id: 3,
    title: 'GoodWe Suncake Balcony Solar Kit',
    category: 'solar-panels',
    price: 75000,
    discountPercentage: 10,
    rating: 4.5,
    stock: 18,
    sku: 'SUNCAKE',
    segment: ['home'],
    flags: ['trending'],
    images: [
      `${PV}20250430/suncake.jpg`,
      `${PV}20250430/Balcony.jpg`,
      `${PV}20250923/9.22suncake-447.jpg`,
    ],
    description:
      'A portable plug-and-play solar kit for balconies, terraces and courtyards. Lightweight panels and a 2-in-1 microinverter attach to a railing and plug into a socket, so you can start generating power in minutes.',
    highlights: [
      'DIY setup in about five minutes',
      'Lightweight panels with a 2-in-1 microinverter',
      'Wi-Fi Mesh monitoring',
      'Rapid shutdown for safety',
    ],
    specs: [
      ['Type', 'Balcony plug-and-play kit'],
      ['Microinverter', 'GoodWe 2-in-1, dual MPPT'],
      ['Installation', 'Railing mount, no electrician needed'],
    ],
  }),

  // Grid-tied inverters
  product({
    id: 4,
    title: 'GoodWe XS G3 Single-phase Inverter 3.3kW',
    category: 'inverters',
    price: 58000,
    rating: 4.6,
    stock: 64,
    sku: 'GW3300-XS-30',
    segment: ['home'],
    flags: ['popular'],
    images: [
      `${GW}20240201/XS-G3-1.png`,
      `${GW}20240201/XS-G3-2.png`,
      `${GW}20240201/XS-G3-31.png`,
      `${GW}20240201/XS-G3-32.png`,
    ],
    description:
      'A light, compact and silent inverter for small home systems from 0.7 to 3.3 kW. It has no fan, supports up to 200% DC oversizing and reaches 97.6% peak efficiency.',
    highlights: [
      '200% DC input oversizing',
      'Fanless design for quiet operation',
      '24/7 load consumption monitoring',
      'Optional Type II SPD on DC and AC sides',
    ],
    specs: [
      ['Power range', '0.7 – 3.3 kW'],
      ['Phase', 'Single phase'],
      ['MPPTs', '1'],
      ['Max. efficiency', '97.6%'],
    ],
  }),
  product({
    id: 5,
    title: 'GoodWe DNS G4 Single-phase Inverter 5kW',
    category: 'inverters',
    price: 105000,
    discountPercentage: 6,
    rating: 4.8,
    stock: 42,
    sku: 'GW5K-DNS-G40',
    weight: 9.2,
    segment: ['home'],
    flags: ['popular', 'latest'],
    images: [
      `${GW}20250523/DNSG4-1.png`,
      `${GW}20250609/DNSG4-2.png`,
      `${GW}20250523/DNSG4-31.png`,
      `${GW}20250523/DNSG4-32.png`,
    ],
    description:
      'The fourth generation of GoodWe’s dual-MPPT home inverter, rated 3 to 6 kW. It is 31% lighter than before, accepts 20 A per string and has AI-driven arc fault protection.',
    highlights: [
      '20 A per string and 200% PV oversizing',
      'AI-driven AFCI 3.0 for safety',
      '31% lighter, easier installation',
      'Parallel with MS G4 via EzLink3000',
    ],
    specs: [
      ['Power range', '3 – 6 kW'],
      ['Phase', 'Single phase'],
      ['MPPTs / strings per MPPT', '2 / 1'],
      ['Max. input voltage', '600 V'],
      ['Max. input current per MPPT', '20 A'],
      ['Nominal output voltage', '220 / 230 / 240 V'],
    ],
  }),
  product({
    id: 6,
    title: 'GoodWe MS G4 Single-phase Inverter 10kW',
    category: 'inverters',
    price: 165000,
    rating: 4.7,
    stock: 26,
    sku: 'GW10K-MS-G40',
    weight: 16,
    segment: ['home', 'business'],
    images: [
      `${GW}20250523/MSG4-1.png`,
      `${GW}20250523/MSG4-2.png`,
      `${GW}20250523/MSG4-31.png`,
      `${GW}20250523/MSG4-32.png`,
    ],
    description:
      'A single-phase inverter for larger homes and small shops, rated 7.5 to 10 kW with up to 3 MPPTs. It runs below 30 dB, so it can be installed near living spaces.',
    highlights: [
      '20 A per string and 200% PV oversizing',
      'AI-driven AFCI 3.0 for safety',
      'Quiet operation below 30 dB',
      'Parallel with DNS G4 via EzLink3000',
    ],
    specs: [
      ['Power range', '7.5 – 10 kW'],
      ['Phase', 'Single phase'],
      ['MPPTs', '2 / 3'],
      ['Max. input voltage', '600 V'],
      ['Max. input current per MPPT', '20 A'],
    ],
  }),
  product({
    id: 7,
    title: 'GoodWe SDT G3 Three-phase Inverter 15kW',
    category: 'inverters',
    price: 210000,
    rating: 4.7,
    stock: 19,
    sku: 'GW15K-SDT-30',
    segment: ['home', 'business'],
    images: [
      `${GW}20240422/(Venus)SDTG38-15kW-1.png`,
      `${GW}20240422/(Venus)SDTG38-15kW-2.png`,
      `${GW}20240422/(Venus)SDTG38-15kW-31.png`,
      `${GW}20240422/(Venus)SDTG38-15kW-32.png`,
    ],
    description:
      'A compact three-phase inverter for bigger homes and small installations from 4 to 30 kW, with 22 A per string and round-the-clock load monitoring.',
    highlights: [
      'Max. 22 A DC input current per string',
      '24/7 load consumption monitoring',
      'Light and compact design',
      'Optional Type II SPD on AC and DC sides',
    ],
    specs: [
      ['Power range', '4 – 30 kW'],
      ['Phase', 'Three phase'],
      ['MPPTs', '2'],
      ['Max. input voltage', '1100 V'],
      ['Max. input current per MPPT', '22 A'],
    ],
  }),
  product({
    id: 8,
    title: 'GoodWe MIS G2 Microinverter 2.5kW (4-in-1)',
    category: 'inverters',
    price: 68000,
    discountPercentage: 5,
    rating: 4.5,
    stock: 4,
    sku: 'GW2.5K-MIS-G20',
    segment: ['home'],
    flags: ['latest'],
    warrantyInformation: '15-year GoodWe manufacturer warranty',
    images: [
      `${GW}20260716/MISG2-1.png`,
      `${GW}20260716/MISG2-2.png`,
      `${GW}20260716/MISG2-31.png`,
      `${GW}20260716/MISG2-32.png`,
    ],
    description:
      'A 4-in-1 microinverter for homes and small businesses, rated 1600 to 2500 W. Each panel works on its own, so shade on one panel does not drag down the rest.',
    highlights: [
      '12 V ultra-low startup voltage',
      'Full power output up to 50 °C',
      'Wi-Fi Mesh connects up to 25 units',
      'Wireless zero export without a gateway',
    ],
    specs: [
      ['Power range', '1600 – 2500 W'],
      ['Phase', 'Single phase'],
      ['MPPTs', '4'],
      ['Noise', 'Below 20 dB'],
    ],
  }),

  // Hybrid inverters (solar + battery)
  product({
    id: 9,
    title: 'GoodWe ES G2 Hybrid Inverter 5kW',
    category: 'hybrid-inverters',
    price: 185000,
    rating: 4.7,
    stock: 22,
    sku: 'GW5000M-ES-20',
    segment: ['home'],
    flags: ['popular'],
    images: [
      `${GW}20220830/%E4%BA%A7%E5%93%81%E5%90%8D-1.png`,
      `${GW}20220728/%E4%BA%A7%E5%93%81%E5%90%8D-2.png`,
      `${GW}20220728/%E4%BA%A7%E5%93%81%E5%90%8D-31.png`,
    ],
    description:
      'A single-phase hybrid inverter for low-voltage batteries, rated 3 to 6 kW. It stores daytime solar for the evening, so you use more of your own power and buy less from the grid.',
    highlights: [
      'Plug and play with low-voltage batteries',
      'Smart load control with dry contacts',
      'Smart home integration',
      'Optional DC arc fault protection',
    ],
    specs: [
      ['Power range', '3 – 6 kW'],
      ['Phase', 'Single phase'],
      ['MPPTs', '2'],
      ['Battery type', 'Low voltage'],
    ],
  }),
  product({
    id: 10,
    title: 'GoodWe EH Plus+ Hybrid Inverter 6kW',
    category: 'hybrid-inverters',
    price: 210000,
    discountPercentage: 7,
    rating: 4.6,
    stock: 15,
    sku: 'GW6000N-EH',
    segment: ['home'],
    images: [
      `${GW}20230831/EH-1.png`,
      `${GW}20230831/EH-2.png`,
      `${GW}20230831/EH-31.png`,
      `${GW}20230831/EH-32.png`,
    ],
    description:
      'A battery-ready single-phase inverter for high-voltage batteries from 85 to 460 V. Start with solar only and add a battery later with an activation code. Switches to backup in under 10 ms.',
    highlights: [
      'Battery ready, add storage later',
      'UPS-level switching under 10 ms',
      '150% DC oversizing',
      'IP65, built-in Type II DC SPD',
    ],
    specs: [
      ['Power range', '3.6 – 6 kW'],
      ['Phase', 'Single phase'],
      ['MPPTs', '2'],
      ['Battery voltage', '85 – 460 V (high voltage)'],
      ['Backup switching', 'Under 10 ms'],
    ],
  }),
  product({
    id: 11,
    title: 'GoodWe ET G2 Three-phase Hybrid Inverter 10kW',
    category: 'hybrid-inverters',
    price: 295000,
    rating: 4.8,
    stock: 11,
    sku: 'GW10K-ET-20',
    segment: ['home', 'business'],
    flags: ['trending'],
    images: [`${GW}20250529/ETG2-1.png`],
    description:
      'A three-phase hybrid inverter rated 6 to 15 kW for high-voltage batteries. Up to four units can run in parallel, and it responds fast to sudden loads.',
    highlights: [
      'Up to 160% PV input oversizing',
      'AI-driven AFCI 3.0',
      'Integrated dry contact for external loads',
      'Up to 4 units in parallel',
    ],
    specs: [
      ['Power range', '6 – 15 kW'],
      ['Phase', 'Three phase'],
      ['MPPTs', '2 / 3'],
      ['Battery type', 'High voltage'],
    ],
  }),

  // Batteries and home storage
  product({
    id: 12,
    title: 'GoodWe Lynx U G3 Battery 5kWh',
    category: 'batteries',
    price: 145000,
    discountPercentage: 5,
    rating: 4.6,
    stock: 30,
    sku: 'LXU 5.0-30',
    segment: ['home'],
    flags: ['popular'],
    images: [`${GW}20241213/20241213-111922.png`],
    description:
      'A modular 5 kWh low-voltage LFP battery. Stack modules as your needs grow; up to 30 can run in parallel. A heating film keeps it working in the cold.',
    highlights: [
      'LFP chemistry',
      'Max. 90 A charging, 100 A discharging',
      'Up to 30 units in parallel',
      'Modular, simple installation',
    ],
    specs: [
      ['Capacity', '5 kWh per module'],
      ['Voltage class', 'Low voltage'],
      ['Chemistry', 'LFP'],
      ['Parallel', 'Up to 30 units'],
    ],
  }),
  product({
    id: 13,
    title: 'GoodWe Lynx A G4 Battery 16kWh',
    category: 'batteries',
    price: 420000,
    rating: 4.8,
    stock: 9,
    sku: 'GW16.1-BAT-LV-G10',
    segment: ['home', 'business'],
    flags: ['latest', 'trending'],
    images: [`${GW}20260416/20260416-141311.png`],
    description:
      'A 16 kWh low-voltage battery built on 314 Ah cells rated for up to 10,000 cycles. IP65 and C5M protection let it live outdoors.',
    highlights: [
      '314 Ah cells, up to 10,000 cycles',
      'Cell-level heat isolation',
      'Daisy-chain wiring, no busbar needed',
      'IP65 and C5M protection',
    ],
    specs: [
      ['Capacity', '16 kWh'],
      ['Voltage class', 'Low voltage'],
      ['Cycle life', 'Up to 10,000 cycles'],
      ['Protection', 'IP65, C5M'],
    ],
  }),
  product({
    id: 14,
    title: 'GoodWe Lynx D High-voltage Battery 5kWh',
    category: 'batteries',
    price: 175000,
    rating: 4.6,
    stock: 3,
    sku: 'LX D5.0-10',
    segment: ['home'],
    images: [
      `${GW}20241119/Lynx-D-1.png`,
      `${GW}20241119/Lynx-D-2.png`,
      `${GW}20241119/Lynx-D-31.png`,
      `${GW}20241119/Lynx-D-32.png`,
    ],
    description:
      'A 5 kWh high-voltage LFP battery for home self-consumption and backup, with 100% usable depth of discharge and IP66 protection for outdoor installation.',
    highlights: [
      '100% depth of discharge',
      'IP66 for outdoor installation',
      'Remote diagnosis and updates',
      'Auto reboot after undervoltage',
    ],
    specs: [
      ['Capacity', '5 kWh'],
      ['Voltage class', 'High voltage'],
      ['Chemistry', 'LFP'],
      ['Protection', 'IP66'],
    ],
  }),
  product({
    id: 15,
    title: 'GoodWe Lynx F G2 Battery Tower',
    category: 'batteries',
    // Price of the 6.4 kWh tower; larger towers add the price of the extra modules.
    price: 215000,
    discountPercentage: 6,
    rating: 4.7,
    stock: 12,
    sku: 'LX F6.4-H-20',
    segment: ['home', 'business'],
    images: [`${GW}20231030/Lynx-F-G2.png`],
    options: [
      {
        name: 'Capacity',
        values: [
          { label: '6.4 kWh', priceDelta: 0 },
          { label: '9.6 kWh', priceDelta: 95000 },
          { label: '12.8 kWh', priceDelta: 190000 },
          { label: '16 kWh', priceDelta: 285000 },
          { label: '19.2 kWh', priceDelta: 380000 },
        ],
      },
    ],
    description:
      'A stackable high-voltage battery tower from 6.4 to 28.8 kWh. Add modules to grow capacity; up to 8 towers can run in parallel for 230 kWh.',
    highlights: [
      'Stackable modules, 6.4 – 28.8 kWh',
      'Up to 8 towers in parallel (230 kWh)',
      'Plug and play installation',
      'IP55 protection',
    ],
    specs: [
      ['Capacity', '6.4 – 28.8 kWh per tower'],
      ['Voltage class', 'High voltage'],
      ['Chemistry', 'LFP'],
      ['Protection', 'IP55'],
    ],
  }),
  product({
    id: 16,
    title: 'GoodWe ESA All-in-One Home Energy Storage 10kW',
    category: 'batteries',
    price: 720000,
    discountPercentage: 9,
    rating: 4.9,
    stock: 6,
    sku: 'GW10K-EHA-G20',
    segment: ['home'],
    flags: ['popular', 'latest'],
    images: [
      `${GW}20251014/ESA3-10KAll-in-oneSystem-1.png`,
      `${GW}20251014/ESA3-10KAll-in-oneSystem-2.png`,
      `${GW}20251014/ESA3-10KAll-in-oneSystem-31.png`,
      `${GW}20251014/ESA3-10KAll-in-oneSystem-32.png`,
    ],
    description:
      'Inverter and battery in one quiet cabinet for homes, rated 3 to 10 kW with 5 to 108 kWh of storage. Fanless, IP66, and able to run off-grid.',
    highlights: [
      '1C charge and discharge',
      'Fanless design for quiet operation',
      'Dual output ports, off-grid capable',
      'Heating mode down to −20 °C',
    ],
    specs: [
      ['Power range', '3 – 10 kW'],
      ['Capacity', '5 – 108 kWh'],
      ['Phase', 'Single phase'],
      ['Protection', 'IP66'],
    ],
  }),

  // Commercial and industrial
  product({
    id: 17,
    title: 'GoodWe SDT G3 Commercial Inverter 50kW',
    category: 'commercial',
    price: 420000,
    rating: 4.7,
    stock: 8,
    sku: 'GW50K-SDT-C30',
    segment: ['business'],
    images: [
      `${GW}20250630/SDTG350kW-1.png`,
      `${GW}20250630/SDTG350kW-2.png`,
      `${GW}20250630/SDTG350kW-31.png`,
      `${GW}20250630/SDTG350kW-32.png`,
    ],
    description:
      'A three-phase inverter for shops, offices and small factories, rated 30 to 50 kW with up to 4 MPPTs. Runs below 50 dB with IP66 protection.',
    highlights: [
      'Max. 21 A per string, 180% PV oversizing',
      'AI-driven AFCI 3.0',
      'Quiet operation under 50 dB',
      'IP66, compact design',
    ],
    specs: [
      ['Power range', '30 – 50 kW'],
      ['Phase', 'Three phase'],
      ['MPPTs', '2 – 4'],
      ['Protection', 'IP66'],
    ],
  }),
  product({
    id: 18,
    title: 'GoodWe SMT G2 Commercial Inverter 60kW',
    category: 'commercial',
    price: 520000,
    discountPercentage: 5,
    rating: 4.8,
    stock: 7,
    sku: 'GW60K-SMT-L-G20',
    weight: 42,
    segment: ['business'],
    flags: ['trending'],
    images: [
      `${GW}20251103/SMTG260kW-1.png`,
      `${GW}20251103/SMTG260kW-2.png`,
      `${GW}20251103/SMTG260kW-31.png`,
    ],
    description:
      'A three-phase commercial rooftop inverter rated 35 to 80 kW with up to 6 MPPTs and 98.4% peak efficiency, light enough at 42 kg for a two-person install.',
    highlights: [
      'Up to 200% DC input oversizing',
      'Up to 6 MPPTs',
      'Lightweight 42 kg design',
      'IP66 and remote data monitoring',
    ],
    specs: [
      ['Power range', '35 – 80 kW'],
      ['Phase', 'Three phase'],
      ['MPPTs', '4 / 6'],
      ['Max. input voltage', '900 V'],
      ['Max. efficiency', '98.4%'],
    ],
  }),
  product({
    id: 19,
    title: 'GoodWe GT Commercial Inverter 125kW',
    category: 'commercial',
    price: 980000,
    rating: 4.8,
    stock: 4,
    sku: 'GW125K-GT-L-G10',
    segment: ['business'],
    images: [
      `${GW}20251021/GT150kW-1.png`,
      `${GW}20251021/GT150kW-2.png`,
      `${GW}20251021/GT150kW-31.png`,
      `${GW}20251021/GT150kW-32.png`,
    ],
    description:
      'A high-power three-phase inverter for factories and large rooftops, rated 100 to 125 kW with up to 10 MPPTs and 98.8% peak efficiency.',
    highlights: [
      '21 A DC input per string',
      'Smart string-level disconnection',
      'Supports aluminium cables up to 400 mm²',
      'Self-cleaning smart fans',
    ],
    specs: [
      ['Power range', '100 – 125 kW'],
      ['Phase', 'Three phase'],
      ['MPPTs / strings per MPPT', '10 / 2'],
      ['Max. input voltage', '900 V'],
      ['Max. efficiency', '98.8%'],
    ],
  }),
  product({
    id: 20,
    title: 'GoodWe ET Commercial Hybrid Inverter 50kW',
    category: 'commercial',
    price: 850000,
    rating: 4.7,
    stock: 5,
    sku: 'GW50K-ET-10',
    segment: ['business'],
    images: [
      `${GW}20240823/ET-50kW-1.png`,
      `${GW}20240823/ET-50kW-2.png`,
      `${GW}20240823/ET-50kW-31.png`,
      `${GW}20240823/ET-50kW-32.png`,
    ],
    description:
      'A three-phase high-voltage hybrid inverter for businesses, rated 25 to 50 kW. Peak shaving trims demand charges, and units run in parallel both on and off grid.',
    highlights: [
      'Peak shaving to cut demand charges',
      'Parallel on-grid and off-grid',
      '110% unbalanced output',
      'IP66 for outdoor installation',
    ],
    specs: [
      ['Power range', '25 – 50 kW'],
      ['Phase', 'Three phase'],
      ['MPPTs', '3 / 4'],
      ['Battery type', 'High voltage'],
    ],
  }),
  product({
    id: 21,
    title: 'GoodWe ESA C&I Energy Storage System 125kW / 261kWh',
    category: 'commercial',
    price: 9800000,
    rating: 4.9,
    stock: 2,
    sku: 'GW125/261-ESA-LCN-G11',
    segment: ['business'],
    flags: ['latest'],
    images: [`${GW}20250623/20250623-154051.png`],
    description:
      'An all-in-one outdoor storage cabinet for factories and commercial sites. Up to 20 units run in parallel for 2.5 MW / 5.22 MWh, with GoodWe’s own PCS, BMS and EMS.',
    highlights: [
      'Up to 20 units in parallel (2.5 MW / 5.22 MWh)',
      'Own PCS, BMS and EMS working together',
      'AI-driven battery health prediction',
      'Works with solar PV, IP54',
    ],
    specs: [
      ['Power', '125 kW'],
      ['Capacity', '261 kWh'],
      ['Phase', 'Three phase'],
      ['Protection', 'IP54'],
    ],
  }),
  product({
    id: 22,
    title: 'GoodWe BAT-C Commercial Battery System 261kWh',
    category: 'commercial',
    price: 6900000,
    rating: 4.8,
    stock: 0,
    sku: 'GW261.2-BAT-LCD-G10',
    segment: ['business'],
    images: [
      `${GW}20260622/BAT-C261-1.png`,
      `${GW}20260622/BAT-C261-2.png`,
      `${GW}20260622/BAT-C261-31.png`,
      `${GW}20260622/BAT-C261-32.png`,
    ],
    description:
      'A liquid-cooled commercial battery system from 208 to 261 kWh with 314 Ah cells rated for up to 10,000 cycles and three-hour fire resistance.',
    highlights: [
      'Three-hour fire resistance',
      'Liquid cooling for all climates',
      'Flexible, scalable expansion',
      'Long lifespan, high IP protection',
    ],
    specs: [
      ['Capacity', '208 – 261 kWh'],
      ['Cells', '314 Ah'],
      ['Cycle life', 'Up to 10,000 cycles'],
      ['Cooling', 'Liquid'],
    ],
  }),

  // EV charging
  product({
    id: 23,
    title: 'GoodWe HCA G2 Smart EV Charger 7kW',
    category: 'ev-chargers',
    price: 85000,
    discountPercentage: 10,
    rating: 4.6,
    stock: 14,
    sku: 'GW7K-HCA-20',
    segment: ['home', 'business'],
    flags: ['trending'],
    images: [`${GW}20241206/20241206-151632.png`],
    description:
      'An AC charger that can run your electric car on surplus solar power. Single-phase 7 kW, with three-phase 11 and 22 kW versions for businesses.',
    highlights: [
      'Charges any EV brand',
      'Dynamic load control',
      'Remote control and monitoring',
      'External emergency shutdown switch',
    ],
    specs: [
      ['Output', '7 kW single phase (11 / 22 kW three phase)'],
      ['Type', 'AC charger'],
      ['Compatibility', 'All EV brands'],
    ],
  }),

  // Accessories
  product({
    id: 24,
    title: 'GoodWe GMK330 Smart Energy Meter',
    category: 'accessories',
    price: 9500,
    rating: 4.5,
    stock: 85,
    sku: 'GMK330',
    segment: ['home'],
    images: [
      `${GW}20240425/GMK330-1(2).png`,
      `${GW}20240424/GMK330-31.png`,
      `${GW}20240424/GMK330-32.png`,
      `${GW}20240424/GMK330-33.png`,
    ],
    description:
      'A compact single-phase meter that tracks your home’s consumption in real time and lets the inverter limit how much power goes back to the grid.',
    highlights: [
      'Accuracy class 0.5',
      'Export limit and load monitoring',
      '120 A CTs included',
      'Wide input voltage range',
    ],
    specs: [
      ['Phase', 'Single phase'],
      ['Accuracy', 'Class 0.5'],
      ['CTs', '120 A, included'],
    ],
  }),
  product({
    id: 25,
    title: 'GoodWe SEC1000 Smart Energy Controller',
    category: 'accessories',
    price: 38000,
    rating: 4.6,
    stock: 20,
    sku: 'SEC1000',
    segment: ['business'],
    images: [
      `${GW}20230629/SEC-1000-1.png`,
      `${GW}20230629/SEC-1000-31.png`,
      `${GW}20230629/SEC-1000-32.png`,
      `${GW}20230629/SEC-1000-33.png`,
    ],
    description:
      'A plant controller that collects real-time data from GoodWe inverters and manages export power and reactive power. The SEC1000S version works with storage systems.',
    highlights: [
      'Real-time monitoring',
      'Export power control',
      'Reactive power compensation',
      'For on-grid and storage systems',
    ],
    specs: [
      ['Models', 'SEC1000 (on-grid), SEC1000S (storage)'],
      ['Functions', 'Export control, reactive power compensation'],
    ],
  }),
  product({
    id: 26,
    title: 'GoodWe EzLink3000 Smart Dongle',
    category: 'accessories',
    price: 6500,
    rating: 4.5,
    stock: 120,
    sku: 'Ezlink 3000',
    segment: ['home', 'business'],
    images: [
      `${GW}20240410/Ezlink3000-1.png`,
      `${GW}20240410/Ezlink3000-2.png`,
      `${GW}20240410/Ezlink3000-31.png`,
      `${GW}20240410/Ezlink3000-32.png`,
    ],
    description:
      'A small, low-power communication dongle that connects your inverter to the monitoring app and lets several inverters work together in parallel.',
    highlights: [
      'Compact, low power consumption',
      'Easy installation',
      'Enables inverter paralleling',
      'Remote monitoring in the app',
    ],
    specs: [
      ['Type', 'Communication dongle'],
      ['Use', 'Monitoring and inverter paralleling'],
    ],
  }),
  product({
    id: 27,
    title: 'GoodWe Wi-Fi Kit-20',
    category: 'accessories',
    price: 4500,
    rating: 4.4,
    stock: 150,
    sku: 'WiFi Kit-20',
    segment: ['home'],
    images: [`${GW}20211227/64f17b603937f.png`],
    description:
      'A plug-and-play Wi-Fi module that sends encrypted inverter data to the monitoring platform and supports remote firmware updates.',
    highlights: [
      'Encrypted data link',
      'Resends data after a dropout',
      'Remote firmware upgrade',
      'Plug and play',
    ],
    specs: [
      ['Type', 'Wi-Fi communication module'],
      ['Updates', 'Remote upgrade supported'],
    ],
  }),
];

// Derived from the catalog so filters always match the products that exist.
export const CATEGORIES = Array.from(new Set(Products.map((p) => p.category)));
export const BRANDS = Array.from(
  new Set(Products.map((p) => p.brand).filter((brand): brand is string => Boolean(brand))),
).sort();

// Round the most expensive product up so the price filter never hides items.
export const PRICE_CEILING = Math.ceil(Math.max(...Products.map((p) => p.price)) / 100000) * 100000;
