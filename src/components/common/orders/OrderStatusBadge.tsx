import { capitalize, cn, getStatusColor, getStatusIcon } from '@/lib/utils';

const OrderStatusBadge = ({ status, className }: { status: string; className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium',
      getStatusColor(status),
      className,
    )}
  >
    {getStatusIcon(status)}
    {capitalize(status)}
  </span>
);

export default OrderStatusBadge;
