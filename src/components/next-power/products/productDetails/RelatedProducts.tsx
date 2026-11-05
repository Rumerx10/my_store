import { useStoreProducts } from '@/lib/query/catalog';
import { useCategoryLabel } from '@/lib/query/shop';
import { IProduct } from '@/types/api_types';
import ProductCardGrid from '../ProductCardGrid';
import SectionHeader from '@/components/next-power/SectionHeader';

// Other products from the same category, topped up with the best-rated items if it's small.
export function RelatedProducts({ product }: { product: IProduct }) {
  const { data: products = [] } = useStoreProducts();
  const categoryLabel = useCategoryLabel();
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  const others = products
    .filter((p) => p.category !== product.category)
    .sort((a, b) => b.rating - a.rating);
  const related = [...sameCategory, ...others].slice(0, 4);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-products">
      <SectionHeader
        id="related-products"
        title="You may also like"
        href={`/next-power/products?category=${product.category}`}
        linkLabel={`More in ${product.categoryName ?? categoryLabel(product.category)}`}
      />
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
        {related.map((item) => (
          <ProductCardGrid key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
