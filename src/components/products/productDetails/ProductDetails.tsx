'use client';

import { useState } from 'react';
import { ProductDetailsTab } from './ProductDetailsTab';
import { RelatedProducts } from './RelatedProducts';
import { BackButton } from '../../BackButton';
import { ProductDetailsInfo } from './ProductDetailsInfo';
import ProductImgCarousel from '@/components/ProductImgCarousel';
import { Card } from '@/components/ui/card';
import ProductDetailFeatures from './ProductDetailFeatures';
import { Products } from '@/docs/api_products';
import { useParams } from 'next/navigation';
import SellerInfo from './SellerInfo';
import PricingDetails from './PricingDetails';

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const productId = Number(useParams().id);
  const product = Products.find((product) => product.id === productId);

  return (
    <div className="min-h-screen py-6">
      <Card className="container mx-auto px-4 py-8 flex flex-col bg-white">
        {/* Back Button */}
        <BackButton name="Products" href="/products" />
        <div className="mb-5 grid gap-6 gird-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1.5fr]">
          <div className="flex overflow-hidden ">
            <ProductImgCarousel images={product?.images} />
          </div>

          {product && (
            <ProductDetailsInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              setActiveTab={setActiveTab}
            />
          )}
          <div className="space-y-6">
            <PricingDetails price={product!.price} quantity={quantity} />
            <SellerInfo />
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
        />
        {/* Related Products */}
        <RelatedProducts />
      </Card>
    </div>
  );
}
