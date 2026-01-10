import {
  MdOutlineLocalGroceryStore,
  MdOutlineShoppingBag,
  MdOutlineHome,
  MdOutlineFace,
} from 'react-icons/md';

export const CATEGORIES = [
  {
    name: 'beauty',
    icon: MdOutlineFace,
    types: [
      {
        type: 'Mascara & Eye Makeup',
        brands: ['Essence', 'Glamour Beauty', 'Maybelline', "L'Oréal", 'MAC', 'Urban Decay'],
      },
      {
        type: 'Face Powder & Foundation',
        brands: ['Velvet Touch', 'Maybelline', 'Revlon', 'Covergirl', 'Estée Lauder', 'NARS'],
      },
      {
        type: 'Lip Products',
        brands: ['Chic Cosmetics', 'MAC', 'Maybelline', 'NYX', 'Fenty Beauty', 'Charlotte Tilbury'],
      },
      {
        type: 'Nail Care',
        brands: ['Nail Couture', 'OPI', 'Sally Hansen', 'Essie', 'CND', 'Butter London'],
      },
      {
        type: 'Skincare',
        brands: ['Neutrogena', 'Cetaphil', 'CeraVe', 'The Ordinary', 'La Roche-Posay', "Kiehl's"],
      },
    ],
  },
  {
    name: 'fragrances',
    icon: MdOutlineShoppingBag,
    types: [
      {
        type: 'Luxury Perfumes',
        brands: ['Chanel', 'Dior', 'Gucci', 'Tom Ford', 'Yves Saint Laurent', 'Versace'],
      },
      {
        type: 'Designer Colognes',
        brands: ['Calvin Klein', 'Dolce & Gabbana', 'Armani', 'Hugo Boss', 'Prada', 'Burberry'],
      },
      {
        type: 'Unisex Fragrances',
        brands: ['Jo Malone', 'Le Labo', 'Byredo', 'Diptyque', 'Creed', 'Maison Margiela'],
      },
      {
        type: 'Affordable Scents',
        brands: ['Zara', 'Bath & Body Works', 'The Body Shop', "Victoria's Secret", 'H&M', 'Muji'],
      },
    ],
  },
  {
    name: 'furniture',
    icon: MdOutlineHome,
    types: [
      {
        type: 'Beds & Bedroom',
        brands: ['Annibale Colombo', 'IKEA', 'Ashley', 'Wayfair', 'West Elm', 'Pottery Barn'],
      },
      {
        type: 'Sofas & Living Room',
        brands: ['Annibale Colombo', 'IKEA', 'Ashley', 'La-Z-Boy', 'Ethan Allen', 'Rooms To Go'],
      },
      {
        type: 'Bedside & Accent Tables',
        brands: ['Furniture Co.', 'IKEA', 'Wayfair', 'Target', 'HomeGoods', 'CB2'],
      },
      {
        type: 'Office Furniture',
        brands: ['Knoll', 'Herman Miller', 'Steelcase', 'IKEA', 'Staples', 'Office Depot'],
      },
      {
        type: 'Bathroom Furniture',
        brands: ['Bath Trends', 'Kohler', 'American Standard', 'IKEA', 'Home Depot', 'Wayfair'],
      },
      {
        type: 'Outdoor Furniture',
        brands: ['Home Depot', "Lowe's", 'Wayfair', 'Patio Living', 'Trex', 'Polywood'],
      },
    ],
  },
  {
    name: 'groceries',
    icon: MdOutlineLocalGroceryStore,
    types: [
      {
        type: 'Fresh Fruits',
        brands: ['Dole', 'Del Monte', 'Chiquita', 'Sunkist', 'Wonderful', 'Fresh Express'],
      },
      {
        type: 'Vegetables',
        brands: [
          'Fresh Express',
          'Earthbound Farm',
          "Mann's",
          'Grimmway Farms',
          'Birds Eye',
          'Green Giant',
        ],
      },
      {
        type: 'Meat & Seafood',
        brands: ['Tyson', 'Perdue', 'Butterball', 'Foster Farms', 'SeaPak', 'Bumble Bee'],
      },
      {
        type: 'Pet Supplies',
        brands: [
          'Purina',
          'Pedigree',
          'Iams',
          'Blue Buffalo',
          "Hill's Science Diet",
          'Royal Canin',
        ],
      },
      {
        type: 'Dairy & Eggs',
        brands: [
          'Horizon Organic',
          'Organic Valley',
          'Lactaid',
          'Chobani',
          'Dannon',
          "Land O'Lakes",
        ],
      },
      {
        type: 'Cooking Essentials',
        brands: ['Bertolli', 'Pompeian', 'Crisco', 'Wesson', 'Mazola', 'Great Value'],
      },
      {
        type: 'Beverages',
        brands: ['Coca-Cola', 'Pepsi', 'Nestlé', 'Tropicana', 'Minute Maid', 'Ocean Spray'],
      },
      {
        type: 'Condiments & Spices',
        brands: ['Heinz', "French's", 'McCormick', 'Tabasco', "Frank's RedHot", 'Kikkoman'],
      },
      {
        type: 'Bakery & Snacks',
        brands: ['Pepperidge Farm', "Entenmann's", 'Oreo', 'Nabisco', 'Keebler', 'Hostess'],
      },
      {
        type: 'Frozen Foods',
        brands: [
          "Stouffer's",
          'Lean Cuisine',
          'Healthy Choice',
          "Marie Callender's",
          "Amy's",
          'Evol',
        ],
      },
    ],
  },
  {
    name: 'electronics',
    icon: MdOutlineShoppingBag,
    types: [
      {
        type: 'Smartphones',
        brands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola'],
      },
      {
        type: 'Laptops & Computers',
        brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Microsoft'],
      },
      {
        type: 'Audio & Headphones',
        brands: ['Sony', 'Bose', 'Apple', 'Sennheiser', 'JBL', 'Beats'],
      },
      {
        type: 'TV & Home Theater',
        brands: ['Samsung', 'LG', 'Sony', 'TCL', 'Vizio', 'Hisense'],
      },
      {
        type: 'Smart Home',
        brands: ['Amazon', 'Google', 'Apple', 'Ring', 'Nest', 'Philips Hue'],
      },
    ],
  },
  {
    name: 'fashion',
    icon: MdOutlineFace,
    types: [
      {
        type: "Men's Clothing",
        brands: ['Nike', 'Adidas', "Levi's", 'Tommy Hilfiger', 'Calvin Klein', 'Ralph Lauren'],
      },
      {
        type: "Women's Clothing",
        brands: ['Zara', 'H&M', 'Forever 21', 'Mango', 'Gap', 'Uniqlo'],
      },
      {
        type: 'Shoes & Footwear',
        brands: ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance'],
      },
      {
        type: 'Accessories',
        brands: ['Michael Kors', 'Coach', 'Fossil', 'Ray-Ban', 'Casio', 'Swatch'],
      },
      {
        type: 'Watches & Jewelry',
        brands: ['Rolex', 'Tag Heuer', 'Fossil', 'Michael Kors', 'Pandora', 'Swarovski'],
      },
    ],
  },
  {
    name: 'home',
    icon: MdOutlineHome,
    types: [
      {
        type: 'Kitchen & Dining',
        brands: ['KitchenAid', 'Cuisinart', 'Ninja', 'Instant Pot', 'Breville', 'All-Clad'],
      },
      {
        type: 'Home Decor',
        brands: ['West Elm', 'CB2', 'Pottery Barn', 'Anthropologie', 'Wayfair', 'Target'],
      },
      {
        type: 'Bedding & Bath',
        brands: [
          'Brooklinen',
          'Parachute',
          'Boll & Branch',
          'Pottery Barn',
          'Crate & Barrel',
          'West Elm',
        ],
      },
      {
        type: 'Lighting',
        brands: ['IKEA', 'West Elm', 'CB2', 'Home Depot', "Lowe's", 'Wayfair'],
      },
      {
        type: 'Storage & Organization',
        brands: [
          'The Container Store',
          'IKEA',
          'Rubbermaid',
          'Sterilite',
          'mDesign',
          'SimpleHouseware',
        ],
      },
    ],
  },
  {
    name: 'health',
    icon: MdOutlineFace,
    types: [
      {
        type: 'Vitamins & Supplements',
        brands: ['Nature Made', 'Centrum', "Nature's Bounty", 'GNC', 'NOW Foods', 'Solgar'],
      },
      {
        type: 'Personal Care',
        brands: ['Dove', 'Nivea', 'Neutrogena', 'Cetaphil', 'CeraVe', 'Aveeno'],
      },
      {
        type: 'Fitness Equipment',
        brands: ['Bowflex', 'NordicTrack', 'Peloton', 'ProForm', 'Sunny Health', 'Fitbit'],
      },
      {
        type: 'Medical Supplies',
        brands: ['CVS Health', 'Walgreens', 'Medline', 'McKesson', 'Cardinal Health', 'Baxter'],
      },
    ],
  },
];


export const FILTER_CATEGORIES = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports & Fitness',
];
export const STOCK_STATUS_OPTIONS = ['All Status', 'active', 'low_stock', 'out_of_stock'];
