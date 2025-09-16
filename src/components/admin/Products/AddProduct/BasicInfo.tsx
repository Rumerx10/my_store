'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import InputField from '@/components/InputField';
import QuillDescriptionField from '@/components/QuillDescriptionField';
import SelectCategoryField from '@/components/SelectCategoryField';
import SelectBrandField from '@/components/SelectBrandField';

const BasicInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputField label="Product Name" name="productName" placeholder="Enter product name" />
        <InputField
          label="Short Description"
          name="shortDesc"
          placeholder="Brief product summary"
          type="textarea"
        />
        <QuillDescriptionField
          label="Description"
          name="desc"
          placeholder="Detail product description"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectCategoryField />
          <SelectBrandField />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfo;
