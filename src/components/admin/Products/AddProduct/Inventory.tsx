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

const Inventory = () => {
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
          <div>
            <Label htmlFor="sku">SKU</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="sku"
                placeholder="Product SKU"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
              />
              <Button variant="outline" onClick={generateSKU}>
                Generate
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Track Quantity</Label>
            <p className="text-sm text-gray-600">Track this product&apos;s inventory</p>
          </div>
          <Switch
            checked={formData.trackQuantity}
            onCheckedChange={(checked) => handleInputChange('trackQuantity', checked)}
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
            checked={formData.continueSellingWhenOutOfStock}
            onCheckedChange={(checked) =>
              handleInputChange('continueSellingWhenOutOfStock', checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;
