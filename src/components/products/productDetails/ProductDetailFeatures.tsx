import Image from 'next/image';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { IProduct } from '@/types/api_types';

// Delivery, payment and after-sales facts for one product, from its own data.
const ProductDetailFeatures = ({ product }: { product: IProduct }) => {
  const items = [
    {
      icon: <Truck className="size-5 text-brand" />,
      title: 'Delivery',
      text: product.shippingInformation,
    },
    {
      icon: (
        <Image src="/cashondelivery.png" alt="" width={20} height={20} className="size-5 object-contain" />
      ),
      title: 'Cash on delivery',
      text: 'Pay in cash when the order arrives',
    },
    {
      icon: <RotateCcw className="size-5 text-brand" />,
      title: 'Returns',
      text: product.returnPolicy,
    },
    {
      icon: <ShieldCheck className="size-5 text-brand" />,
      title: 'Warranty',
      text: product.warrantyInformation,
    },
  ];

  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border border-gray-200/80 bg-gray-200/80 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3 bg-white p-4">
          <span className="mt-0.5 shrink-0">{item.icon}</span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProductDetailFeatures;
