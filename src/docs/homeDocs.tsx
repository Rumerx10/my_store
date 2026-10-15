import { Banknote, ClipboardList, Headphones, Smartphone, Truck, Wrench, Zap } from 'lucide-react';

export const FEATURES = [
  {
    icon: <Wrench className="size-5" />,
    title: 'Installed for you',
    description: 'Certified team, from survey to switch-on',
  },
  {
    icon: <Banknote className="size-5" />,
    title: 'Pay your way',
    description: 'Cash on delivery, bKash, Nagad, Rocket or card',
  },
  {
    icon: <Truck className="size-5" />,
    title: 'Delivered nationwide',
    description: 'Panels and batteries packed for the road',
  },
  {
    icon: <Headphones className="size-5" />,
    title: 'Free system design',
    description: 'Tell us your bill, we size the system',
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Share your bill',
    description: 'Send us your monthly electricity bill and roof photos in chat.',
    icon: <ClipboardList className="size-5" />,
  },
  {
    step: 2,
    title: 'Get a design',
    description: 'We size the panels, inverter and battery and send a fixed quote.',
    icon: <Zap className="size-5" />,
  },
  {
    step: 3,
    title: 'We install it',
    description: 'Delivery, mounting, wiring and grid connection by our certified team.',
    icon: <Wrench className="size-5" />,
  },
  {
    step: 4,
    title: 'Watch it work',
    description: 'Follow generation, savings and battery level in the GoodWe app.',
    icon: <Smartphone className="size-5" />,
  },
];
