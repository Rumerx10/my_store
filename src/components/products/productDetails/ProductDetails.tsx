'use client';

import { useState } from 'react';
import { Truck, Shield, RotateCcw, Award } from 'lucide-react';
import { PRODUCT } from '@/docs/products';
import { ProductDetailsTab } from './ProductDetailsTab';
import { RelatedProducts } from './RelatedProducts';
import { BackButton } from '../../BackButton';
import { ProductDetailsInfo } from './ProductDetailsInfo';
import SellerInfo from './SellerInfo';
import Image from 'next/image';
import BreadcrumbComponent from '@/components/BreadcrumbComponent';
import ProductImgCarousel from '@/components/ProductImgCarousel';

export default function ProductDetails() {
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const discount = Math.round(
    ((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100,
  );
  const savings = PRODUCT.originalPrice - PRODUCT.price;

  const ratingDistribution = [
    { stars: 5, count: 1847, percentage: 65 },
    { stars: 4, count: 712, percentage: 25 },
    { stars: 3, count: 199, percentage: 7 },
    { stars: 2, count: 57, percentage: 2 },
    { stars: 1, count: 32, percentage: 1 },
  ];

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };



  return (
    <div className="min-h-screen flex flex-col my-8">
      <div className="container mx-auto px-4 py-8 flex flex-col bg-white">
        <BreadcrumbComponent />
        {/* Back Button */}
        <BackButton name="Products" href="/products" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <ProductImgCarousel images={PRODUCT.images} />

          {/* Product Info */}
          <ProductDetailsInfo
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            quantity={quantity}
            isWishlisted={isWishlisted}
            setIsWishlisted={setIsWishlisted}
            discount={discount}
            savings={savings}
            updateQuantity={updateQuantity}
          />

          {/* Features */}
          <div className="grid grid-cols-1 gap-4">
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

            <SellerInfo />
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductDetailsTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reviewFilter={reviewFilter}
          setReviewFilter={setReviewFilter}
          showAllReviews={showAllReviews}
          setShowAllReviews={setShowAllReviews}
          ratingDistribution={ratingDistribution}
        />

        {/* Related Products */}
        <RelatedProducts />
      </div>
    </div>
  );
}
