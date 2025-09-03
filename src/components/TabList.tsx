import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabList = () => {
  const tabsData = [
    { value: 'all', label: 'All', count: 10 },
    { value: 'pending', label: 'Pending', count: 10, icon: Clock },
    { value: 'shipped', label: 'Shipped', count: 10, icon: Package },
    { value: 'delivered', label: 'Delivered', count: 10, icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', count: 10, icon: XCircle },
  ];
  return (
    <TabsList className="grid w-full grid-cols-5">
      {tabsData.map(({ value, label, count, icon: Icon }) => (
        <TabsTrigger key={value} value={value} className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {label} ({count})
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabList;
