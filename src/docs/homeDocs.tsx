import { ShoppingCart, Eye, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';

export const FEATURES = [
  {
    icon: <Truck className="size-5" />,
    title: 'Cash on delivery',
    description: 'Pay when your order arrives',
  },
  {
    icon: <Shield className="size-5" />,
    title: 'Pay your way',
    description: 'bKash, Nagad, Rocket or card',
  },
  {
    icon: <RotateCcw className="size-5" />,
    title: 'Simple returns',
    description: 'Each product lists its return window',
  },
  {
    icon: <Headphones className="size-5" />,
    title: 'Real support',
    description: 'Chat or call us 7 days a week',
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Find what you need',
    description: 'Search by name or brand, or browse a category and filter by price.',
    icon: <Eye className="size-5" />,
  },
  {
    step: 2,
    title: 'Add it to your cart',
    description: 'Adjust quantities in the cart and apply a promo code if you have one.',
    icon: <ShoppingCart className="size-5" />,
  },
  {
    step: 3,
    title: 'Choose how to pay',
    description: 'Pay now with a card or mobile banking, or pay in cash on delivery.',
    icon: <Shield className="size-5" />,
  },
  {
    step: 4,
    title: 'Track the delivery',
    description: 'Follow the order status from My orders until it reaches your door.',
    icon: <Truck className="size-5" />,
  },
];
