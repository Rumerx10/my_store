'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { FormProvider, useForm } from 'react-hook-form';
import BasicInfo from './BasicInfo';
import ProductImageField from './ProductImageField';
import Pricing from './Pricing';
import Inventory from './Inventory';
import ProductTags from './Sidebar/ProductTags';
import ProductStatus from './Sidebar/ProductStatus';
import Actions from './Sidebar/Actions';

// type Category = (typeof CATEGORIES)[number]
type ProductStatus = 'draft' | 'active';

interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: string;
  comparePrice: string;
  cost: string;
  category: string;
  brand: string;
  tags: string[];
  stock: string;
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  weight: string;
  dimensions: ProductDimensions;
  seoTitle: string;
  seoDescription: string;
  status: ProductStatus;
}

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: '',
    comparePrice: '',
    cost: '',
    category: '',
    brand: '',
    tags: [],
    stock: '',
    trackQuantity: true,
    continueSellingWhenOutOfStock: false,
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    seoTitle: '',
    seoDescription: '',
    status: 'draft',
  });

  const [images, setImages] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProductFormData | string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (
        parent === 'dimensions' &&
        child &&
        (child === 'length' || child === 'width' || child === 'height')
      ) {
        setFormData((prev) => ({
          ...prev,
          dimensions: {
            ...prev.dimensions,
            [child]: value as string,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload these to a server
      // For demo purposes, we'll create placeholder URLs
      const newImages = Array.from(files).map(
        (file, index) =>
          `/placeholder.svg?height=200&width=200&text=Product+${images.length + index + 1}`,
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (status: ProductStatus) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would send the data to your API
    console.log('Submitting product:', { ...formData, status, images });

    setIsSubmitting(false);
    router.push('/admin/products');
  };

  const methods = useForm({
    defaultValues: {
      productName: '',
      shortDesc: '',
      desc: '',
      category: '',
      brand: '',
      price: null,
      costPerUnit: null,
      sku: '',
      stock: 0,
      images: [],
      trackQty: true,
      continueSellingWhenOutOfStock: false,
    },
  });

  const onSubmit = (data: any) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container flex flex-col py-8">
        {/* Header */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-1">Create a new product for your store</p>
          </div>
          <Link href="/admin/products">
            <Button variant="outline" className="w-48">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BasicInfo />
              <ProductImageField />
              <Pricing />
              <Inventory />
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <ProductStatus />
              <ProductTags />
              <Actions />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
