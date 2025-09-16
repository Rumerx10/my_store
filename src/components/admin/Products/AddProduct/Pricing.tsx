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

const Pricing = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Pricing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="comparePrice">Compare at Price</Label>
            <Input
              id="comparePrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.comparePrice}
              onChange={(e) => handleInputChange('comparePrice', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="cost">Cost per Item</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Pricing;
