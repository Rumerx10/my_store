import { Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
const Actions = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <Button
            onClick={() => handleSubmit('active')}
            disabled={isSubmitting || !formData.name || !formData.price}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Publishing...' : 'Publish Product'}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>

          <Separator />

          <Button variant="ghost" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Preview Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Actions;
