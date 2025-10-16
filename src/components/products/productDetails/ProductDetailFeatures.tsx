import { Truck, Shield, RotateCcw, Award } from 'lucide-react';
import { PRODUCT } from '@/docs/products';
import SellerInfo from './SellerInfo';
import Image from 'next/image';

const ProductDetailFeatures = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <Truck className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Free Shipping</p>
            <p className="text-sm text-gray-600">{PRODUCT.shipping.estimatedDays}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <div>
            <Image src="/cashondelivery.png" alt="cash on delivery" width={24} height={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Cash On Delivery</p>
            {/* <p className="text-sm text-gray-600">{PRODUCT.shipping.estimatedDays}</p> */}
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-gray-900">Warranty</p>
            <p className="text-sm text-gray-600">{PRODUCT.warranty}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <RotateCcw className="w-6 h-6 text-orange-600" />
          <div>
            <p className="font-semibold text-gray-900">Easy Returns</p>
            <p className="text-sm text-gray-600">{PRODUCT.returnPolicy}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <Award className="w-6 h-6 text-purple-600" />
          <div>
            <p className="font-semibold text-gray-900">Authentic</p>
            <p className="text-sm text-gray-600">100% genuine product</p>
          </div>
        </div>
      </div>
      <SellerInfo />
    </div>
  );
};

export default ProductDetailFeatures;
