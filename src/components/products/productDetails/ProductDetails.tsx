'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { defaultSelection, isDraft, variantImage, type OptionSelection } from '@/lib/products';
import { categoryLabel } from '@/docs/navLinks';
import ProductImgCarousel from '@/components/ProductImgCarousel';
import { ProductDetailsTab } from './ProductDetailsTab';
import { RelatedProducts } from './RelatedProducts';
import { ProductDetailsInfo } from './ProductDetailsInfo';
import ProductDetailFeatures from './ProductDetailFeatures';
import SellerInfo from './SellerInfo';

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [chosen, setChosen] = useState<OptionSelection>({});

  const productId = Number(useParams().id);
  const product = useSelector((state: RootState) =>
    state.products.find((item) => item.id === productId),
  );

  if (!product) notFound();

  const selection = { ...defaultSelection(product), ...chosen };

  const showTab = (tab: string) => {
    setActiveTab(tab);
    document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container py-5 md:py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm">
        <ol className="flex min-w-0 items-center gap-1.5 text-gray-500">
          <li>
            <Link href="/" className="rounded transition-colors hover:text-gray-900">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
            <Link
              href={`/products?category=${product.category}`}
              className="rounded transition-colors hover:text-gray-900"
            >
              {categoryLabel(product.category)}
            </Link>
          </li>
          <li className="flex min-w-0 items-center gap-1.5">
            <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
            <span aria-current="page" className="truncate font-medium text-gray-900">
              {product.title}
            </span>
          </li>
        </ol>
      </nav>

      {isDraft(product) && (
        <p className="mb-4 rounded-xl border border-sun/60 bg-sun-soft/80 px-4 py-3 text-sm text-sun-ink">
          This product is a draft. It&apos;s hidden from the store until it&apos;s made active.
        </p>
      )}

      <div className="grid gap-8 rounded-3xl glass p-4 md:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:p-8">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <ProductImgCarousel
            images={product.images}
            title={product.title}
            activeImage={variantImage(product, selection)}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ProductDetailsInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            selection={selection}
            onSelect={(name, label) => setChosen((current) => ({ ...current, [name]: label }))}
            onShowReviews={() => showTab('reviews')}
            onShowDescription={() => showTab('description')}
          />
          <ProductDetailFeatures product={product} />
          <SellerInfo />
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <ProductDetailsTab product={product} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="mt-8 rounded-3xl glass p-4 md:mt-12 md:p-8">
        <RelatedProducts product={product} />
      </div>
    </div>
  );
}
