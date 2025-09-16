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
import { Controller, useFormContext } from 'react-hook-form';

const ProductStatus = () => {
  const { watch, control } = useFormContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Controller
          name="status"
          defaultValue="active"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ProductStatus;
