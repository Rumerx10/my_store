import type { Metadata } from 'next';
import ProductDetails from '@/components/products/productDetails/ProductDetails';
import { Products } from '@/docs/products';
import { excerpt } from '@/lib/richText';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = Products.find((item) => item.id === Number(id));
  if (!product) return { title: 'Product not found' };
  return {
    title: product.title,
    description: excerpt(product.description, 160),
    openGraph: { images: product.thumbnail ? [product.thumbnail] : [] },
  };
}

const page = () => {
  return <ProductDetails />;
};

export default page;
