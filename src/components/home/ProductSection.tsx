'use client';
import { useId } from 'react';
import { useSelector } from 'react-redux';
import { selectStoreProducts } from '@/redux/selectors';
import { IProduct } from '@/types/api_types';
import ProductCardGrid from '../products/ProductCardGrid';
import SectionHeader from '../SectionHeader';

// A titled row of products from the catalog, used by the home page sections.
const ProductSection = ({
  title,
  desc,
  href,
  linkLabel,
  filter,
  sort,
  limit = 8,
}: {
  title: string;
  desc?: string;
  href: string;
  linkLabel?: string;
  filter: (product: IProduct) => boolean;
  sort?: (a: IProduct, b: IProduct) => number;
  limit?: number;
}) => {
  const headingId = useId();
  const matching = useSelector(selectStoreProducts).filter(filter);
  const products = (sort ? [...matching].sort(sort) : matching).slice(0, limit);

  if (products.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="container mt-8 md:mt-12">
      <div className="rounded-3xl glass p-4 md:p-8">
        <SectionHeader id={headingId} title={title} desc={desc} href={href} linkLabel={linkLabel} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
