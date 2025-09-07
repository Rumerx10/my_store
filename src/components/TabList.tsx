import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsDataType } from '@/types/Types';

const TabList = ({ tabsData }: { tabsData: TabsDataType[] }) => {
  return (
    <TabsList className={`flex items-center justify-between gap-3`}>
      {tabsData.map(({ value, label, count, icon: Icon }) => (
        <TabsTrigger key={value} value={value} className="flex w-full items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {label} ({count})
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabList;
