'use client';
import { notFound, useParams } from 'next/navigation';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { isNotFound, useProduct } from '@/lib/query/catalog';
import ProductForm from './ProductForm';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, error, isPlaceholderData, isPending, refetch } = useProduct(id);

  // Wait for the full product: the list's copy has no description or specs to edit.
  if (isPending || isPlaceholderData) return <PageLoader label="Loading the product" />;
  if (isNotFound(error)) notFound();
  if (!product) return <ErrorState error={error} onRetry={() => refetch()} />;

  // Keyed by save time, so the form starts again from what the server stored.
  return <ProductForm key={product.meta.updatedAt} product={product} />;
};

export default EditProduct;
