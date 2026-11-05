import Link from 'next/link';
import Panel from '@/components/common/Panel';
import { changeFrom, rangeInfo, type Dashboard } from '@/lib/dashboard';
import { cn, formatPrice } from '@/lib/utils';
import { useAdminHref } from '@/components/admin/adminStore';

// Best sellers by revenue in the period, with the change on the period before.
const TopProducts = ({ data }: { data: Dashboard }) => {
  const href = useAdminHref();
  const range = rangeInfo(data.range);
  const products = data.topProducts.slice(0, 5);

  return (
    <Panel title={`Top products, ${range.label.toLowerCase()}`}>
      {products.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Nothing sold in this period yet.
        </p>
      ) : (
        <ol className="divide-y divide-gray-100 dark:divide-white/10">
          {products.map((product, index) => {
            const growth = changeFrom(product.revenue, product.prevRevenue);
            return (
              <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="w-5 shrink-0 text-sm tabular-nums text-gray-400 dark:text-slate-500">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={href(`/products/edit-product/${product.id}`)}
                    className="block truncate text-sm font-medium text-gray-900 hover:text-brand dark:text-slate-100"
                  >
                    {product.title}
                  </Link>
                  <p className="text-xs tabular-nums text-gray-500 dark:text-slate-400">
                    {product.units} sold
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                    {formatPrice(product.revenue)}
                  </p>
                  <p
                    className={cn(
                      'text-xs tabular-nums',
                      growth === undefined
                        ? 'text-gray-500 dark:text-slate-400'
                        : growth >= 0
                          ? 'text-hGreen'
                          : 'text-red',
                    )}
                  >
                    {growth === undefined
                      ? 'New'
                      : `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
};

export default TopProducts;
