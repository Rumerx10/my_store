import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Eye,
  Package,
  DollarSign,
  Tag,
  Truck,
  BarChart3,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField';
import { useFormContext } from 'react-hook-form';

const generateSKU = (value: string) => {
  const prefix = value.substring(0, 2).toUpperCase() || 'PR';
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}-${random}`;
};

const Inventory = () => {
  const { watch, setValue } = useFormContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2 items-end">
            <InputField label="SKU" name="sku" placeholder="Product SKU" />
            <Button
              className="w-24"
              type="button"
              variant="outline"
              onClick={() => {
                const newSku = generateSKU(watch('category'));
                setValue('sku', newSku);
              }}
            >
              Generate
            </Button>
          </div>
          <InputField label="Stock Quantity" name="qty" placeholder="0" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Track Quantity</Label>
            <p className="text-sm text-gray-600">Track this product&apos;s inventory</p>
          </div>
          <Switch
            checked={watch('trackQty')}
            onCheckedChange={(checked) => setValue('trackQty', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Continue selling when out of stock</Label>
            <p className="text-sm text-gray-600">
              Allow customers to purchase when inventory reaches zero
            </p>
          </div>
          <Switch
            checked={watch('continueSellingWhenOutOfStock')}
            onCheckedChange={(checked) => setValue('continueSellingWhenOutOfStock', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;
