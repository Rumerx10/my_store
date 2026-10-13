import type { Metadata } from 'next';
import ProductDetails from '@/components/products/productDetails/ProductDetails';
import { Products } from '@/docs/api_products';

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
    description: product.description,
    openGraph: { images: product.thumbnail ? [product.thumbnail] : [] },
  };
}

const page = () => {
  return <ProductDetails />;
};

export default page;
