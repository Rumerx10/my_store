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

const Seo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Engine Optimization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            placeholder="SEO title for search engines"
            value={formData.seoTitle}
            onChange={(e) => handleInputChange('seoTitle', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            placeholder="SEO description for search engines"
            value={formData.seoDescription}
            onChange={(e) => handleInputChange('seoDescription', e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Seo;
