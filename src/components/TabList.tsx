import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsDataType } from '@/types/Types';

const TabList = ({ tabsData }: { tabsData: TabsDataType[] }) => {
  return (
    <TabsList className={`grid w-full grid-cols-${tabsData.length}`}>
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
