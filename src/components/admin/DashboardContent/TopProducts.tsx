import Panel from '@/components/dashboard/Panel';
import { TOP_PRODUCTS } from '@/docs/adminDashboard';
import { cn, formatPrice } from '@/lib/utils';

const TopProducts = () => {
  return (
    <Panel title="Top products">
      <ol className="divide-y divide-gray-100">
        {TOP_PRODUCTS.map((product, index) => (
          <li key={product.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="w-5 shrink-0 text-sm tabular-nums text-gray-400">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
              <p className="text-xs tabular-nums text-gray-500">{product.sales} sold</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums text-gray-900">
                {formatPrice(product.revenue)}
              </p>
              <p
                className={cn(
                  'text-xs tabular-nums',
                  product.growth > 0 ? 'text-hGreen' : 'text-red',
                )}
              >
                {product.growth > 0 ? '+' : ''}
                {product.growth}%
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
};

export default TopProducts;
