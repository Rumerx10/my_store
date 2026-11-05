import type { Metadata } from 'next';
import ProductDetails from '@/components/next-power/products/productDetails/ProductDetails';
import { excerpt } from '@/lib/richText';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    headers: { 'X-Seller-Host': process.env.NEXT_PUBLIC_STORE_HOST ?? '' },
    next: { revalidate: 300 },
  }).catch(() => null);
  if (!res?.ok) return { title: 'Product not found' };
  const product = (await res.json()) as {
    title: string;
    description: string | null;
    images: { url: string }[];
  };
  return {
    title: product.title,
    description: excerpt(product.description ?? '', 160),
    openGraph: { images: product.images[0] ? [product.images[0].url] : [] },
  };
}

const page = () => {
  return <ProductDetails />;
};

export default page;
