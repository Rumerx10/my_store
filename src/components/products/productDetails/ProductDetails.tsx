'use client';

import { useState } from 'react';
import { ProductDetailsTab } from './ProductDetailsTab';
import { RelatedProducts } from './RelatedProducts';
import { BackButton } from '../../BackButton';
import { ProductDetailsInfo } from './ProductDetailsInfo';
import ProductImgCarousel from '@/components/ProductImgCarousel';
import { Card } from '@/components/ui/card';
import ProductDetailFeatures from './ProductDetailFeatures';
import { PRODUCTS } from '@/docs/api_products';
import { useParams } from 'next/navigation';

export default function ProductDetails() {
  const id = Number(useParams().id);
  const PRODUCT = PRODUCTS.find((product) => product.id === id);
  console.log("Find Product :: ", PRODUCT);
  // const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  // const discount = Math.round(
  //   ((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100,
  // );
  // const savings = PRODUCT.originalPrice - PRODUCT.price;
  const ratingDistribution = [
    { stars: 5, count: 1847, percentage: 65 },
    { stars: 4, count: 712, percentage: 25 },
    { stars: 3, count: 199, percentage: 7 },
    { stars: 2, count: 57, percentage: 2 },
    { stars: 1, count: 32, percentage: 1 },
  ];
  

  return (
    <div className="min-h-screen py-6">
      <Card className="container mx-auto px-4 py-8 flex flex-col bg-white">
        {/* Back Button */}
        <BackButton name="Products" href="/products" />
        <div className="mb-5 grid gap-6 gird-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr]">
          <div className="flex overflow-hidden ">
            <ProductImgCarousel images={PRODUCT?.images} />
          </div>
          <ProductDetailsInfo
            product={PRODUCT}
            // selectedColor={selectedColor}
            // setSelectedColor={setSelectedColor}
            isWishlisted={isWishlisted}
            setIsWishlisted={setIsWishlisted}
            // discount={discount}
            // savings={savings}
            setActiveTab={setActiveTab}
          />
          <div className="hidden lg:block">
            <ProductDetailFeatures />
          </div>
        </div>
        <div className="lg:hidden">
          <ProductDetailFeatures />
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
      </Card>
    </div>
  );
}
