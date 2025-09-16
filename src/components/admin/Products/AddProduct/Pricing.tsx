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
import InputField from '@/components/InputField';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Price" name="price" placeholder="0.00" />
          <InputField label="Cost per unit" name="costPerUnit" placeholder="0.00" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Pricing;
