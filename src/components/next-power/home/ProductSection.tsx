'use client';
import { useId } from 'react';
import { useStoreProducts } from '@/lib/query/catalog';
import type { ApiHomeSection } from '@/lib/api/types';
import type { IProduct } from '@/types/api_types';
import ProductCardGrid from '../products/ProductCardGrid';
import SectionHeader from '../SectionHeader';

type ProductRow = Extract<ApiHomeSection, { type: 'products' }>;

// The products a row shows, in order, and where "View all" leads.
const pick = (row: ProductRow, catalog: IProduct[]) => {
  switch (row.source) {
    case 'popular':
    case 'trending':
    case 'latest':
      return {
        products: catalog.filter((p) => p[row.source as 'popular' | 'trending' | 'latest']),
        href: `/next-power/products?searchTerm=${row.source}`,
      };
    case 'deals':
      return {
        products: catalog
          .filter((p) => p.discountPercentage >= 5 && p.stock > 0)
          .sort((a, b) => b.discountPercentage - a.discountPercentage),
        href: '/next-power/deals',
        linkLabel: 'All deals',
      };
    case 'category':
      return {
        products: catalog.filter((p) => p.category === row.categorySlug),
        href: `/next-power/products?category=${row.categorySlug}`,
      };
    case 'manual':
      return {
        products: (row.productIds ?? [])
          .map((id) => catalog.find((p) => p.id === id))
          .filter((p): p is IProduct => Boolean(p)),
        href: '/next-power/products',
      };
  }
};

// A titled row of products from the catalog, as set in the seller centre.
const ProductSection = ({ section }: { section: ProductRow }) => {
  const headingId = useId();
  const { data: catalog = [] } = useStoreProducts();
  const { products, href, linkLabel } = pick(section, catalog);
  const shown = products.slice(0, section.limit);

  if (shown.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="container mt-8 md:mt-12">
      <div className="rounded-3xl glass p-4 md:p-8">
        <SectionHeader
          id={headingId}
          title={section.title}
          desc={section.subtitle || undefined}
          href={href}
          linkLabel={linkLabel}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
          {shown.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
