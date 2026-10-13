import { Package, AlertTriangle, XCircle, Wallet } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import { formatPrice, getProductStatus } from '@/lib/utils';
import { IProduct } from '@/types/api_types';

const ProductStatisticsCards = ({ products }: { products: IProduct[] }) => {
  const count = (status: string) =>
    products.filter((product) => getProductStatus(product.stock) === status).length;
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <DashboardCard title="Products" value={products.length} icon={Package} />
      <DashboardCard title="Low stock" value={count('low_stock')} icon={AlertTriangle} />
      <DashboardCard title="Out of stock" value={count('out_of_stock')} icon={XCircle} />
      <DashboardCard title="Inventory value" value={formatPrice(inventoryValue)} icon={Wallet} />
    </div>
  );
};

export default ProductStatisticsCards;
