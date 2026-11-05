import { BadgeCheck, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IProduct } from '@/types/api_types';
import { useCategoryLabel } from '@/lib/query/shop';
import { descriptionToHtml } from '@/lib/richText';
import ProductReviews from './ProductReviews';

interface ProductDetailsTabProps {
  product: IProduct;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function ProductDetailsTab({ product, activeTab, setActiveTab }: ProductDetailsTabProps) {
  const categoryLabel = useCategoryLabel();
  const { width, height, depth } = product.dimensions;
  const specifications: [string, string][] = [
    ['Brand', product.brand ?? 'Unbranded'],
    ['Model', product.sku],
    ...(product.specs ?? []),
    ['Category', product.categoryName ?? categoryLabel(product.category)],
    ...(product.weight > 0 ? [['Weight', `${product.weight} kg`] as [string, string]] : []),
    ...(width > 0
      ? [['Dimensions', `${width} × ${height} × ${depth} cm`] as [string, string]]
      : []),
    ...(product.minimumOrderQuantity > 1
      ? [['Minimum order', `${product.minimumOrderQuantity} units`] as [string, string]]
      : []),
    ['Warranty', product.warrantyInformation],
    ['Availability', product.availabilityStatus],
  ];

  return (
    <section
      id="product-tabs"
      aria-label="Product information"
      className="scroll-mt-[calc(var(--header-h)+1rem)]"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.ratingCount ?? product.reviews.length})
          </TabsTrigger>
          <TabsTrigger value="shipping">Shipping & returns</TabsTrigger>
        </TabsList>

        <div className="mt-4 rounded-xl glass p-5 md:p-8">
          <TabsContent value="description" className="mt-0">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">About this product</h2>
            <div
              className="rich-text mt-3 max-w-[70ch]"
              // Sanitised to the editor's own tags and attributes in descriptionToHtml.
              dangerouslySetInnerHTML={{ __html: descriptionToHtml(product.description) }}
            />
            {product.highlights && product.highlights.length > 0 && (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2" aria-label="Highlights">
                {product.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300"
                  >
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            {product.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-gray-100 dark:bg-white/10 px-2.5 py-1 text-sm capitalize text-gray-700 dark:text-slate-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="specifications" className="mt-0">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">Specifications</h2>
            <dl className="mt-4 grid gap-x-10 md:grid-cols-2">
              {specifications.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-6 border-b border-gray-100 dark:border-white/5 py-3 text-sm"
                >
                  <dt className="text-gray-500 dark:text-slate-400">{key}</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-slate-100">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <ProductReviews productId={product.id} />
          </TabsContent>

          <TabsContent value="shipping" className="mt-0">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">Shipping and returns</h2>
            <ul className="mt-5 grid gap-5 md:grid-cols-2">
              {[
                { icon: Truck, title: 'Delivery', text: product.shippingInformation },
                { icon: RotateCcw, title: 'Returns', text: product.returnPolicy },
                { icon: ShieldCheck, title: 'Warranty', text: product.warrantyInformation },
                {
                  icon: Package,
                  title: 'Packaging',
                  text: 'Returned items must be unused and in their original packaging.',
                },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{title}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
